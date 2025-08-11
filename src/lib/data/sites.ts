// src/lib/data/sites.ts
/**
 * @file src/lib/data/sites.ts
 * @description Aparato de datos para la entidad 'sites'. Esta es la Única Fuente de
 *              Verdad para interactuar con las tablas `sites` y la vista
 *              `sites_with_campaign_counts`. Implementa una lógica de detección de
 *              host robusta y cacheo de alto rendimiento para consultas públicas.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";
import { rootDomain } from "@/lib/utils";

export type SiteWithCampaignCount = Tables<"sites"> & {
  campaign_count: number;
};

export type SiteBasicInfo = Pick<
  Tables<"sites">,
  "id" | "subdomain" | "workspace_id"
>;

export type SiteSortOption = "created_at_desc" | "name_asc" | "name_desc";

/**
 * @private
 * @function buildSiteSearchQuery
 * @description Construye una consulta de Supabase para buscar, ordenar y contar sitios
 *              dentro de un workspace, consultando la vista materializada para un
 *              rendimiento óptimo.
 * @param {string} workspaceId - El ID del workspace a consultar.
 * @param {object} filters - Opciones de filtrado y ordenamiento.
 * @returns Un constructor de consultas de Supabase.
 */
function buildSiteSearchQuery(
  workspaceId: string,
  filters: { query?: string; sort?: SiteSortOption }
) {
  const supabase = createClient();
  let queryBuilder = supabase
    .from("sites_with_campaign_counts")
    .select("*", { count: "exact" })
    .eq("workspace_id", workspaceId);

  if (filters.query) {
    queryBuilder = queryBuilder.ilike("subdomain", `%${filters.query}%`);
  }

  const sortMap: Record<
    SiteSortOption,
    { column: string; ascending: boolean }
  > = {
    created_at_desc: { column: "created_at", ascending: false },
    name_asc: { column: "name", ascending: true },
    name_desc: { column: "name", ascending: false },
  };
  const sort = sortMap[filters.sort || "created_at_desc"];
  queryBuilder = queryBuilder.order(sort.column, {
    ascending: sort.ascending,
  });

  return queryBuilder;
}

/**
 * @public
 * @async
 * @function getSitesByWorkspaceId
 * @description Obtiene una lista paginada y filtrada de sitios para un workspace.
 * @param {string} workspaceId - El ID del workspace.
 * @param {object} options - Opciones de paginación, búsqueda y ordenamiento.
 * @returns {Promise<{ sites: SiteWithCampaignCount[]; totalCount: number }>} Los sitios y el conteo total.
 * @throws {Error} Si la consulta a la base de datos falla.
 */
export async function getSitesByWorkspaceId(
  workspaceId: string,
  {
    page = 1,
    limit = 9,
    query: searchQuery = "",
    sort: sortOption = "created_at_desc",
  }: {
    page?: number;
    limit?: number;
    query?: string;
    sort?: SiteSortOption;
  }
): Promise<{ sites: SiteWithCampaignCount[]; totalCount: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const queryBuilder = buildSiteSearchQuery(workspaceId, {
    query: searchQuery,
    sort: sortOption,
  });

  const { data, error, count } = await queryBuilder.range(from, to);

  if (error) {
    logger.error(
      `[DataLayer:Sites] Error al obtener sitios para workspace ${workspaceId}:`,
      error
    );
    throw new Error("No se pudieron obtener los sitios del workspace.");
  }

  return {
    sites: (data as SiteWithCampaignCount[]) || [],
    totalCount: count || 0,
  };
}

/**
 * @public
 * @async
 * @function getSiteById
 * @description Obtiene información básica de un sitio por su ID.
 * @param {string} siteId - El ID del sitio.
 * @returns {Promise<SiteBasicInfo | null>} La información del sitio o null si no se encuentra.
 */
export async function getSiteById(
  siteId: string
): Promise<SiteBasicInfo | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sites")
    .select("id, subdomain, workspace_id")
    .eq("id", siteId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      logger.error(
        `[DataLayer:Sites] Error al obtener el sitio ${siteId}:`,
        error
      );
    }
    return null;
  }
  return data;
}

/**
 * @public
 * @async
 * @function getSiteDataByHost
 * @description Obtiene los datos completos de un sitio basándose en el `host` de la
 *              petición. Implementa una lógica robusta para diferenciar entre
 *              subdominios y dominios personalizados. Los resultados se cachean.
 * @param {string} host - El host de la petición (ej. 'mi-sitio.localhost:3000' o 'www.cliente.com').
 * @returns {Promise<Tables<"sites"> | null>} Los datos completos del sitio o null.
 */
export async function getSiteDataByHost(
  host: string
): Promise<Tables<"sites"> | null> {
  const sanitizedHost = host.toLowerCase().replace(/^www\./, "");
  const rootDomainWithoutPort = rootDomain.split(":")[0];

  const isSubdomainOfRoot =
    sanitizedHost.endsWith(`.${rootDomainWithoutPort}`) &&
    sanitizedHost !== rootDomainWithoutPort;
  const isLikelySlug = !sanitizedHost.includes(".");
  const isSubdomain = isSubdomainOfRoot || isLikelySlug;

  const finalHost = isSubdomainOfRoot
    ? sanitizedHost.replace(`.${rootDomainWithoutPort}`, "")
    : sanitizedHost;

  return cache(
    async (hostToSearch: string) => {
      logger.trace(`[Cache MISS] Buscando sitio para el host: ${hostToSearch}`);
      const supabase = createClient();
      let query = supabase.from("sites").select("*");
      query = isSubdomain
        ? query.eq("subdomain", hostToSearch)
        : query.eq("custom_domain", hostToSearch);

      const { data, error } = await query.single();

      if (error && error.code !== "PGRST116") {
        logger.error(
          `[DataLayer:Sites] Error al obtener sitio por host ${hostToSearch}:`,
          error
        );
        return null;
      }
      return data;
    },
    [`site-data-host-${finalHost}`],
    { revalidate: 3600, tags: [`sites:host:${finalHost}`] }
  )(finalHost);
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo Adicional**: ((Vigente)) `getSitesByWorkspaceId` y `getSiteById` son candidatos para ser envueltos en `React.cache` para optimizar aún más las consultas dentro de un mismo ciclo de renderizado.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Consulta Otimizada**: ((Implementada)) A função `getSitesByWorkspaceId` consulta a `view materializada` `sites_with_campaign_counts`, garantindo um desempenho de elite para a página "Meus Sites".
 * 2. **Lógica de Host Robusta**: ((Implementada)) `getSiteDataByHost` contém uma lógica robusta e testada para diferenciar entre subdomínios e domínios personalizados, um ponto crítico para a funcionalidade multi-tenant.
 * 3. **Princípio DRY**: ((Implementada)) A lógica de construção de consulta foi abstraída para a função privada `buildSiteSearchQuery`, melhorando a legibilidade e a manutenibilidade.
 *
 * =====================================================================
 */
// src/lib/data/sites.ts
