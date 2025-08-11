// src/lib/data/permissions.ts
/**
 * @file src/lib/data/permissions.ts
 * @description Módulo de bajo nivel y Única Fuente de Verdad para la lógica de autorización.
 *              Este aparato contiene la función pura y reutilizable que verifica los permisos
 *              de un usuario dentro de un contexto de workspace específico. Es la base
 *              sobre la cual se construyen los guardianes de seguridad de alto nivel.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";

type WorkspaceRole = Database["public"]["Enums"]["workspace_role"];

/**
 * @public
 * @async
 * @function hasWorkspacePermission
 * @description Verifica si un usuario tiene uno de los roles requeridos en un workspace específico.
 *              Esta función encapsula la consulta a la base de datos y la lógica de comparación de roles.
 * @param {string} userId - El UUID del usuario a verificar.
 * @param {string} workspaceId - El UUID del workspace en el que se requiere el permiso.
 * @param {WorkspaceRole[]} requiredRoles - Un array de roles que otorgan el permiso.
 * @returns {Promise<boolean>} Devuelve `true` si el usuario tiene el permiso, `false` en caso contrario.
 */
export async function hasWorkspacePermission(
  userId: string,
  workspaceId: string,
  requiredRoles: WorkspaceRole[]
): Promise<boolean> {
  const supabase = createClient();

  const { data: member, error } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("user_id", userId)
    .eq("workspace_id", workspaceId)
    .single();

  if (error || !member) {
    if (error && error.code !== "PGRST116") {
      logger.error(
        `[AuthPermissions] Error al verificar permisos para usuario ${userId} en workspace ${workspaceId}:`,
        error
      );
    }
    return false;
  }

  return requiredRoles.includes(member.role);
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo de Permisos**: ((Vigente)) Para optimizar el rendimiento en peticiones que verifican el mismo permiso múltiples veces, esta función es una candidata ideal para ser envuelta en `React.cache`.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Correção Estrutural Crítica**: ((Implementada)) O aparato foi movido para sua localização canônica em `src/lib/data/`, resolvendo múltiplos erros de compilação e restaurando a integridade do grafo de dependências.
 * 2. **Atomicidade e Coesão**: ((Implementada)) Este aparato isola perfeitamente a lógica de verificação de permissões, aderindo ao Princípio de Responsabilidade Única (SRP).
 *
 * =====================================================================
 */
// src/lib/data/permissions.ts
