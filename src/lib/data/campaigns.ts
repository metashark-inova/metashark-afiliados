// src/lib/data/campaigns.ts
/**
 * @file src/lib/data/campaigns.ts
 * @description Aparato de datos para la entidad 'campaigns'. Esta es la Única Fuente de
 *              Verdad para interactuar con la tabla `campaigns`. Implementa cacheo
 *              de alto rendimiento y lógica de autorización para garantizar la seguridad
 *              y la velocidad de las consultas.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

import { hasWorkspacePermission } from "./permissions";
import { getSiteDataByHost } from "./sites";

export type CampaignMetadata = Pick<
  Tables<"campaigns">,
  | "id"
  | "site_id"
  | "name"
  | "slug"
  | "created_at"
  | "updated_at"
  | "affiliate_url"
>;

export type CampaignWithContent = Tables<"campaigns"> & {
  sites: { workspace_id: string; subdomain: string | null } | null;
};

/**
 * @public
 * @async
 * @function getCampaignsMetadataBySiteId
 * @description Obtiene una lista paginada y filtrada de metadatos de campañas para un sitio específico.
 *              Los resultados se cachean para mejorar el rendimiento en la navegación.
 * @param {string} siteId - El ID del sitio para el que se obtendrán las campañas.
 * @param {object} options - Opciones de paginación y búsqueda.
 * @returns {Promise<{ campaigns: CampaignMetadata[]; totalCount: number }>} Los metadatos de las campañas y el conteo total.
 */
export async function getCampaignsMetadataBySiteId(
  siteId: string,
  { page, limit, query }: { page: number; limit: number; query?: string }
): Promise<{ campaigns: CampaignMetadata[]; totalCount: number }> {
  const cacheKey = `campaigns-meta-${siteId}-p${page}-q${query || ""}`;
  const cacheTags = [`campaigns:${siteId}`, `campaigns:${siteId}:p${page}`];

  return cache(
    async () => {
      logger.info(
        `[Cache MISS] Cargando metadatos de campañas para: ${cacheKey}`
      );
      const supabase = createClient();
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let queryBuilder = supabase
        .from("campaigns")
        .select(
          "id, site_id, name, slug, created_at, updated_at, affiliate_url",
          { count: "exact" }
        )
        .eq("site_id", siteId);

      if (query) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${query}%,slug.ilike.%${query}%`
        );
      }

      const { data, error, count } = await queryBuilder
        .order("updated_at", { ascending: false, nullsFirst: false })
        .range(from, to);

      if (error) {
        logger.error(
          `[DataLayer:Campaigns] Error al obtener campañas para el sitio ${siteId}:`,
          error
        );
        return { campaigns: [], totalCount: 0 };
      }
      return { campaigns: data as CampaignMetadata[], totalCount: count || 0 };
    },
    [cacheKey],
    { tags: cacheTags }
  )();
}

/**
 * @public
 * @async
 * @function getRecentCampaignsByWorkspaceId
 * @description Obtiene las campañas modificadas más recientemente dentro de un workspace.
 *              Crucial para la sección "Continuar trabajando en..." del dashboard.
 * @param {string} workspaceId - El ID del workspace.
 * @param {number} [limit=4] - El número máximo de campañas a devolver.
 * @returns {Promise<Tables<"campaigns">[]>} Un array de las campañas recientes.
 */
export async function getRecentCampaignsByWorkspaceId(
  workspaceId: string,
  limit: number = 4
): Promise<Tables<"campaigns">[]> {
  return cache(
    async () => {
      logger.info(
        `[Cache MISS] Cargando campañas recientes para workspace ${workspaceId}.`
      );
      const supabase = createClient();

      const { data: sites, error: sitesError } = await supabase
        .from("sites")
        .select("id")
        .eq("workspace_id", workspaceId);

      if (sitesError || !sites || sites.length === 0) {
        if (sitesError)
          logger.error(
            `[DataLayer:Campaigns] Error al obtener sitios para el workspace ${workspaceId}:`,
            sitesError
          );
        return [];
      }

      const siteIds = sites.map((s) => s.id);

      const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select("*")
        .in("site_id", siteIds)
        .order("updated_at", { ascending: false, nullsFirst: false })
        .limit(limit);

      if (campaignsError) {
        logger.error(
          `[DataLayer:Campaigns] Error al obtener campañas recientes para el workspace ${workspaceId}:`,
          campaignsError
        );
        return [];
      }

      return campaigns || [];
    },
    [`recent-campaigns-${workspaceId}`],
    { tags: [`workspaces:${workspaceId}:recent-campaigns`] }
  )();
}

/**
 * @public
 * @async
 * @function getCampaignContentById
 * @description Obtiene el contenido completo de una campaña y valida si el usuario
 *              tiene permiso para acceder a ella.
 * @param {string} campaignId - El ID de la campaña a obtener.
 * @param {string} userId - El ID del usuario que solicita el acceso.
 * @returns {Promise<CampaignWithContent | null>} El objeto de la campaña o null si no se encuentra o el acceso es denegado.
 */
export async function getCampaignContentById(
  campaignId: string,
  userId: string
): Promise<CampaignWithContent | null> {
  const supabase = createClient();
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select(`*, sites (workspace_id, subdomain)`)
    .eq("id", campaignId)
    .single();

  if (error || !campaign) {
    if (error && error.code !== "PGRST116") {
      logger.error(
        `[DataLayer:Campaigns] Error al obtener la campaña ${campaignId}:`,
        error
      );
    }
    return null;
  }

  const workspaceId = campaign.sites?.workspace_id;
  if (!workspaceId) {
    logger.error(
      `[DataLayer:Campaigns] INCONSISTENCIA DE DATOS: Campaña ${campaignId} sin workspace asociado.`
    );
    return null;
  }

  const isAuthorized = await hasWorkspacePermission(userId, workspaceId, [
    "owner",
    "admin",
    "member",
  ]);

  if (!isAuthorized) {
    logger.warn(
      `[DataLayer:Campaigns] VIOLACIÓN DE ACCESO: Usuario ${userId} intentó acceder a la campaña ${campaignId} sin permisos.`
    );
    return null;
  }

  return campaign as CampaignWithContent;
}

/**
 * @public
 * @async
 * @function getPublishedCampaignByHostAndSlug
 * @description Obtiene una campaña publicada para renderizado público, basándose en el host y el slug.
 * @param {string} host - El host (subdominio o dominio personalizado).
 * @param {string} slug - El slug de la campaña.
 * @returns {Promise<Tables<"campaigns"> | null>} La campaña publicada o null.
 */
export async function getPublishedCampaignByHostAndSlug(
  host: string,
  slug: string
): Promise<Tables<"campaigns"> | null> {
  const cacheKey = `campaign-public:${host}:${slug}`;
  const cacheTags = [`campaign:${host}:${slug}`];

  return cache(
    async () => {
      logger.info(`[Cache MISS] Buscando campaña pública para: ${cacheKey}`);

      const site = await getSiteDataByHost(host);

      if (!site) {
        logger.trace(
          `[DataLayer:Campaigns] Sitio no encontrado por host: ${host}`
        );
        return null;
      }

      const supabase = createClient();
      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("site_id", site.id)
        .eq("slug", slug)
        .single();

      if (campaignError) {
        if (campaignError.code !== "PGRST116") {
          logger.error(
            `[DataLayer:Campaigns] Error buscando campaña ${slug} en sitio ${site.id}`,
            campaignError
          );
        }
        return null;
      }

      return campaign;
    },
    [cacheKey],
    { tags: cacheTags }
  )();
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Função RPC `get_published_campaign`**: ((Vigente)) La mejora de rendimiento de élite para `getPublishedCampaignByHostAndSlug` sigue siendo consolidar la lógica en una única función de base de datos para eliminar la latencia de red entre las dos consultas (sitio y luego campaña).
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Tipo Explícito**: ((Implementada)) Se ha definido y exportado el tipo explícito `CampaignMetadata`, mejorando la seguridad de tipos y la claridad del contrato de la función `getCampaignsMetadataBySiteId`.
 * 2. **Lógica de Segurança Integrada**: ((Implementada)) A função `getCampaignContentById` integra a verificação de permissões, garantindo que os dados sensíveis do conteúdo da campanha só sejam acessíveis por usuários autorizados.
 * 3. **Estratégia de Cacheo de Elite**: ((Implementada)) Todas as funções de leitura pública (`getPublishedCampaignByHostAndSlug`) e de dados frequentemente acessados (`getRecentCampaignsByWorkspaceId`) utilizam `unstable_cache` com chaves e tags bem definidas para um desempenho máximo.
 *
 * =====================================================================
 */
// src/lib/data/campaigns.ts
