// src/lib/actions/admin.actions.ts
/**
 * @file src/lib/actions/admin.actions.ts
 * @description Contiene Server Actions de alto privilegio, restringidas a roles
 *              administrativos ('admin', 'developer'). Cada acción en este módulo
 *              DEBE comenzar con una verificación de rol explícita utilizando el
 *              guardián de seguridad `requireAppRole`. Estas operaciones son
 *              sensibles y se registran en la auditoría para una trazabilidad completa.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAppRole } from "@/lib/auth/user-permissions";
import { logger } from "@/lib/logging";
import { createAdminClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";
import { type ActionResult } from "@/lib/validators";

import { createAuditLog } from "./_helpers";

/**
 * @public
 * @async
 * @function impersonateUserAction
 * @description [Privilegio: developer] Permite a un desarrollador iniciar sesión como
 *              otro usuario. Genera un enlace mágico de un solo uso para fines de
 *              depuración y soporte. Es una operación de alto riesgo que se audita.
 * @param {string} userId - El ID del usuario a suplantar.
 * @returns {Promise<ActionResult<{ signInLink: string }>>} El resultado de la operación,
 *          conteniendo el enlace de inicio de sesión si tiene éxito.
 */
export async function impersonateUserAction(
  userId: string
): Promise<ActionResult<{ signInLink: string }>> {
  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    return { success: false, error: roleCheck.error };
  }

  if (roleCheck.data.user.id === userId) {
    return { success: false, error: "No puedes suplantarte a ti mismo." };
  }

  const adminSupabase = createAdminClient();
  const { data: userData, error: userError } =
    await adminSupabase.auth.admin.getUserById(userId);

  if (userError || !userData.user) {
    logger.error(
      `[AdminActions] Error al obtener usuario para suplantación ${userId}:`,
      userError
    );
    return { success: false, error: "Usuario no encontrado." };
  }

  const { data, error } = await adminSupabase.auth.admin.generateLink({
    type: "magiclink",
    email: userData.user.email!,
  });

  if (error) {
    logger.error(
      `[AdminActions] Error al generar link de suplantación para ${userId}:`,
      error
    );
    return {
      success: false,
      error: "No se pudo generar el link de suplantación.",
    };
  }

  await createAuditLog("user_impersonated", {
    userId: roleCheck.data.user.id,
    targetEntityId: userId,
    targetEntityType: "user",
    metadata: { impersonatedEmail: userData.user.email },
  });

  return { success: true, data: { signInLink: data.properties.action_link } };
}

/**
 * @public
 * @async
 * @function deleteSiteAsAdminAction
 * @description [Privilegio: admin, developer] Permite a un administrador eliminar
 *              permanentemente un sitio de la plataforma.
 * @param {FormData} formData - Datos del formulario que contienen 'subdomain' y 'siteId'.
 * @returns {Promise<ActionResult<{ message: string }>>} El resultado de la operación.
 */
export async function deleteSiteAsAdminAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  const roleCheck = await requireAppRole(["admin", "developer"]);
  if (!roleCheck.success) {
    return { success: false, error: roleCheck.error };
  }

  const subdomain = formData.get("subdomain") as string;
  if (!subdomain) return { success: false, error: "Subdominio ausente." };

  const adminSupabase = createAdminClient();
  const { error, data: deletedSite } = await adminSupabase
    .from("sites")
    .delete()
    .eq("subdomain", subdomain)
    .select("id, subdomain")
    .single();

  if (error || !deletedSite) {
    logger.error(
      `[AdminActions] Error al eliminar el sitio ${subdomain}:`,
      error
    );
    return { success: false, error: "No se pudo eliminar el sitio." };
  }

  revalidateTag(`sites:${subdomain}`);
  revalidatePath("/admin");

  await createAuditLog("site_deleted_admin", {
    userId: roleCheck.data.user.id,
    targetEntityId: deletedSite.id,
    targetEntityType: "site",
    metadata: { subdomain: deletedSite.subdomain },
  });

  return {
    success: true,
    data: { message: `Sitio ${subdomain} eliminado correctamente.` },
  };
}

/**
 * @public
 * @async
 * @function updateUserRoleAction
 * @description [Privilegio: developer] Permite a un desarrollador cambiar el rol de
 *              aplicación (`app_role`) de otro usuario.
 * @param {string} userId - El ID del usuario cuyo rol se va a modificar.
 * @param {Database["public"]["Enums"]["app_role"]} newRole - El nuevo rol a asignar.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function updateUserRoleAction(
  userId: string,
  newRole: Database["public"]["Enums"]["app_role"]
): Promise<ActionResult<void>> {
  const roleCheck = await requireAppRole(["developer"]);
  if (!roleCheck.success) {
    return { success: false, error: roleCheck.error };
  }

  if (roleCheck.data.user.id === userId) {
    return { success: false, error: "No puedes cambiar tu propio rol." };
  }

  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase
    .from("profiles")
    .update({ app_role: newRole })
    .eq("id", userId);

  if (error) {
    logger.error(
      `[AdminActions] Error al actualizar rol para ${userId}:`,
      error
    );
    return { success: false, error: "No se pudo actualizar el rol." };
  }

  revalidatePath("/dev-console/users");

  await createAuditLog("user_role_updated", {
    userId: roleCheck.data.user.id,
    targetEntityId: userId,
    targetEntityType: "user",
    metadata: { newRole },
  });

  return { success: true, data: undefined };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Transacciones de Base de Datos**: ((Vigente)) Para operaciones que involucran múltiples escrituras (ej. `deleteSite` y todas sus campañas asociadas), envolverlas en una transacción (RPC) para garantizar la atomicidad.
 * 2. **Protección Contra Auto-Modificación Crítica**: ((Vigente)) Implementar lógica para impedir que el último administrador/desarrollador sea degradado de rol o que su cuenta sea eliminada, para evitar un bloqueo total del sistema.
 * 3. **Error I18n Keys**: ((Vigente)) En lugar de devolver strings de error codificados (ej. "No puedes cambiar tu propio rol."), devolver claves de internacionalización (ej. "error_cannot_change_own_role") para que la UI pueda mostrar el mensaje traducido.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Segurança por Padrão**: ((Implementada)) Cada ação começa com uma chamada ao guardião de segurança `requireAppRole`, garantindo que apenas usuários com os privilégios corretos possam executar estas operações sensíveis.
 * 2. **Observabilidade e Auditoria**: ((Implementada)) Todas as ações registram um log de auditoria detalhado com `createAuditLog`, fornecendo uma trilha completa de todas as operações administrativas.
 * 3. **Revalidação de Cache**: ((Implementada)) As ações que modificam dados (`deleteSite`, `updateUserRole`) invalidam as caches relevantes (`revalidatePath`, `revalidateTag`), garantindo que a UI reflita as mudanças imediatamente.
 *
 * =====================================================================
 */
// src/lib/actions/admin.actions.ts
