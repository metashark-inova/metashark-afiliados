// src/lib/data/admin.ts
/**
 * @file src/lib/data/admin.ts
 * @description Aparato de datos para consultas de administrador. Utiliza el cliente
 *              de Supabase con rol de servicio (`createAdminClient`) para realizar
 *              consultas que eluden las políticas de Row Level Security (RLS).
 *              Este módulo es de alto privilegio y solo debe ser invocado por
 *              Server Actions que hayan validado previamente el rol del usuario.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { logger } from "@/lib/logging";
import { createAdminClient } from "@/lib/supabase/server";
import { type Tables, type Views } from "@/lib/types/database";

export type UserProfilesWithEmail = Views<"user_profiles_with_email">;

export type CampaignWithSiteInfo = Tables<"campaigns"> & {
  sites: { subdomain: string | null } | null;
};

export type SiteWithCampaignsCount = Views<"sites_with_campaign_counts">;

/**
 * @public
 * @async
 * @function getAllCampaignsWithSiteInfo
 * @description Obtiene todas las campañas de la plataforma, uniendo la información del
 *              subdominio del sitio al que pertenecen.
 * @returns {Promise<CampaignWithSiteInfo[]>} Un array de todas las campañas.
 * @throws {Error} Si la consulta a la base de datos falla.
 */
export async function getAllCampaignsWithSiteInfo(): Promise<
  CampaignWithSiteInfo[]
> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select(`*, sites (subdomain)`)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error(
      `[DataLayer:Admin] Error al obtener todas las campañas:`,
      error
    );
    throw new Error("No se pudieron obtener los datos de las campañas.");
  }

  return (data as CampaignWithSiteInfo[]) || [];
}

/**
 * @public
 * @async
 * @function getPaginatedUsersWithRoles
 * @description Obtiene una lista paginada y filtrada de todos los perfiles de usuario
 *              de la plataforma, consultando la vista `user_profiles_with_email`.
 * @param {object} options - Opciones de paginación y búsqueda.
 * @returns {Promise<{ profiles: UserProfilesWithEmail[]; totalCount: number }>} Los perfiles y el conteo total.
 * @throws {Error} Si la consulta a la base de datos falla.
 */
export async function getPaginatedUsersWithRoles({
  page = 1,
  limit = 20,
  query = "",
}: {
  page?: number;
  limit?: number;
  query?: string;
}): Promise<{ profiles: UserProfilesWithEmail[]; totalCount: number }> {
  const supabase = createAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let queryBuilder = supabase
    .from("user_profiles_with_email")
    .select("*", { count: "exact" });

  if (query) {
    queryBuilder = queryBuilder.or(
      `email.ilike.%${query}%,full_name.ilike.%${query}%`
    );
  }

  const { data: profiles, error, count } = await queryBuilder.range(from, to);

  if (error) {
    logger.error(
      `[DataLayer:Admin] Error al obtener perfiles de usuario:`,
      error
    );
    throw new Error("No se pudieron obtener los perfiles de usuario.");
  }

  return {
    profiles: (profiles as UserProfilesWithEmail[]) || [],
    totalCount: count || 0,
  };
}

/**
 * @public
 * @async
 * @function getAllSites
 * @description Obtiene una lista paginada de todos los sitios en la plataforma,
 *              consultando la vista materializada `sites_with_campaign_counts`
 *              para un rendimiento óptimo.
 * @param {object} options - Opciones de paginación.
 * @returns {Promise<{ sites: SiteWithCampaignsCount[]; totalCount: number }>} Los sitios y el conteo total.
 * @throws {Error} Si la consulta a la base de datos falla.
 */
export async function getAllSites({
  page = 1,
  limit = 12,
}: {
  page?: number;
  limit?: number;
}): Promise<{ sites: SiteWithCampaignsCount[]; totalCount: number }> {
  const supabase = createAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("sites_with_campaign_counts")
    .select(`*`, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    logger.error(`[DataLayer:Admin] Error al obtener todos los sitios:`, error);
    throw new Error("No se pudieron obtener los datos de los sitios.");
  }

  return { sites: data || [], totalCount: count || 0 };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Consulta de Logs de Auditoría**: ((Vigente)) Añadir una función `getAuditLogs({ page, limit, filters })` para permitir al `dev-console` buscar y mostrar los registros de la tabla `audit_logs`.
 * 2. **Estadísticas Globales**: ((Vigente)) Crear una función `getPlatformStatistics` que utilice RPCs para calcular y devolver métricas clave (total de usuarios, total de sitios, etc.) para un dashboard de administrador.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Separação de Privilégios**: ((Implementada)) Este aparato isola todas as consultas de alto privilégio, deixando claro quais operações de dados requerem validação de segurança de nível superior.
 * 2. **Segurança de Tipos de Views**: ((Implementada)) O uso dos tipos `UserProfilesWithEmail` e `SiteWithCampaignsCount` garante que as consultas às `Views` sejam fortemente tipadas, melhorando a robustez.
 * 3. **Observabilidade**: ((Implementada)) Todas as funções incluem logging de erro detalhado para facilitar o diagnóstico de falhas em consultas administrativas.
 *
 * =====================================================================
 */
// src/lib/data/admin.ts
