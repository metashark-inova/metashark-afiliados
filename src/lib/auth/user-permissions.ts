// src/lib/auth/user-permissions.ts
/**
 * @file src/lib/auth/user-permissions.ts
 * @description Guardián de seguridad de élite y Única Fuente de Verdad para la
 *              autorización y el contexto de sesión en el entorno de SERVIDOR (Node.js).
 *              Utiliza `React.cache` para memoizar la obtención de la sesión por petición,
 *              garantizando un rendimiento máximo al evitar consultas redundantes a la
 *              base de datos durante un único ciclo de renderizado.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { type User } from "@supabase/supabase-js";

import { hasWorkspacePermission } from "@/lib/data/permissions";
import { getSiteById, type SiteBasicInfo } from "@/lib/data/sites";
import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];
type WorkspaceRole = Database["public"]["Enums"]["workspace_role"];

/**
 * @public
 * @typedef UserAuthData
 * @description Contrato de datos que representa el contexto de sesión completo
 *              y memoizado para un usuario autenticado.
 */
export type UserAuthData = {
  user: User;
  appRole: AppRole;
  activeWorkspaceId: string | null;
};

/**
 * @public
 * @typedef AuthResult<T>
 * @description Tipo de unión discriminada para los resultados de las funciones de
 *              autorización. Garantiza un manejo de errores explícito y seguro en
 *              el código que consume estos guardianes.
 */
type AuthResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: "SESSION_NOT_FOUND" | "PERMISSION_DENIED" | "NOT_FOUND";
    };

/**
 * @public
 * @async
 * @function getAuthenticatedUserAuthData
 * @description Obtiene el contexto de sesión completo del usuario para la petición actual.
 *              Gracias a `React.cache`, las consultas a la base de datos solo se
 *              ejecutarán una vez por petición, incluso si esta función es llamada
 *              múltiples veces desde diferentes Server Components o Server Actions.
 * @returns {Promise<UserAuthData | null>} El contexto de sesión memoizado o null si no hay sesión.
 */
export const getAuthenticatedUserAuthData = cache(
  async (): Promise<UserAuthData | null> => {
    logger.trace("[AuthCache] Miss: Obteniendo datos de sesión del usuario.");
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const cookieStore = cookies();
    const { data: profile } = await supabase
      .from("profiles")
      .select("app_role")
      .eq("id", user.id)
      .single();

    return {
      user,
      appRole: profile?.app_role || "user",
      activeWorkspaceId: cookieStore.get("active_workspace_id")?.value || null,
    };
  }
);

/**
 * @public
 * @async
 * @function requireAppRole
 * @description Guardián de seguridad que verifica si el usuario actual tiene uno
 *              de los roles de aplicación requeridos.
 * @param {AppRole[]} requiredRoles - Un array de roles permitidos.
 * @returns {Promise<AuthResult<UserAuthData>>} El resultado de la autorización.
 */
export async function requireAppRole(
  requiredRoles: AppRole[]
): Promise<AuthResult<UserAuthData>> {
  const authData = await getAuthenticatedUserAuthData();

  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND" };
  }

  if (!requiredRoles.includes(authData.appRole)) {
    logger.warn(
      `[AuthGuard] VIOLACIÓN DE ACCESO DE ROL: Usuario ${authData.user.id} con rol '${authData.appRole}' intentó acceder a un recurso que requiere [${requiredRoles.join(", ")}].`
    );
    return { success: false, error: "PERMISSION_DENIED" };
  }

  return { success: true, data: authData };
}

/**
 * @public
 * @async
 * @function requireWorkspacePermission
 * @description Guardián de seguridad que verifica si el usuario actual tiene
 *              permisos específicos dentro de un workspace.
 * @param {string} workspaceId - El ID del workspace a verificar.
 * @param {WorkspaceRole[]} requiredRoles - Un array de roles permitidos.
 * @returns {Promise<AuthResult<User>>} El resultado de la autorización.
 */
export async function requireWorkspacePermission(
  workspaceId: string,
  requiredRoles: WorkspaceRole[]
): Promise<AuthResult<User>> {
  const authData = await getAuthenticatedUserAuthData();

  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND" };
  }
  const { user } = authData;

  const isAuthorized = await hasWorkspacePermission(
    user.id,
    workspaceId,
    requiredRoles
  );

  if (!isAuthorized) {
    return { success: false, error: "PERMISSION_DENIED" };
  }

  return { success: true, data: user };
}

/**
 * @public
 * @async
 * @function requireSitePermission
 * @description Guardián de seguridad de alto nivel que verifica si el usuario
 *              actual tiene permisos sobre un sitio específico, comprobando su
 *              pertenencia y rol en el workspace padre.
 * @param {string} siteId - El ID del sitio a verificar.
 * @param {WorkspaceRole[]} requiredRoles - Un array de roles permitidos en el workspace.
 * @returns {Promise<AuthResult<{ user: User; site: SiteBasicInfo }>>} El resultado de la autorización,
 *          conteniendo los datos del usuario y del sitio si es exitoso.
 */
export async function requireSitePermission(
  siteId: string,
  requiredRoles: WorkspaceRole[]
): Promise<AuthResult<{ user: User; site: SiteBasicInfo }>> {
  const authData = await getAuthenticatedUserAuthData();

  if (!authData) {
    return { success: false, error: "SESSION_NOT_FOUND" };
  }
  const { user } = authData;

  const site = await getSiteById(siteId);
  if (!site) {
    return { success: false, error: "NOT_FOUND" };
  }

  const isAuthorized = await hasWorkspacePermission(
    user.id,
    site.workspace_id,
    requiredRoles
  );

  if (!isAuthorized) {
    logger.warn(
      `[AuthGuard] VIOLACIÓN DE ACCESO A SITIO: Usuario ${user.id} intentó acceder al sitio ${siteId} sin permisos en el workspace ${site.workspace_id}.`
    );
    return { success: false, error: "PERMISSION_DENIED" };
  }

  return { success: true, data: { user, site } };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Guardián de Campaña (`requireCampaignPermission`)**: ((Vigente)) Crear un guardián de nivel aún más alto que verifique los permisos a nivel de campaña, componiendo la lógica de `requireSitePermission` para una seguridad en capas.
 * 2. **Contexto de Sesión Anónima**: ((Vigente)) Considerar la creación de una función `getSessionContext` que devuelva `UserAuthData | null` sin lanzar errores, para ser usada en componentes que tienen renderizado condicional para usuarios autenticados y anónimos.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Otimização de Performance**: ((Implementada)) O uso de `React.cache` garante que as consultas de sessão e perfil se executem apenas uma vez por requisição, otimizando drasticamente o desempenho de renderizações complexas no servidor.
 * 2. **Padrão Guardião**: ((Implementada)) As funções `require...` estabelecem um padrão de segurança robusto e reutilizável para toda a camada de `actions` e `data`, melhorando a manutenibilidade e a segurança.
 * 3. **Observabilidade de Segurança**: ((Implementada)) Logs de aviso detalhados são registrados em caso de tentativas de acesso não autorizado, fornecendo visibilidade crítica sobre possíveis problemas de segurança ou bugs de lógica.
 *
 * =====================================================================
 */
// src/lib/auth/user-permissions.ts
