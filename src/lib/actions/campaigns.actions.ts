// src/lib/actions/campaigns.actions.ts
/**
 * @file src/lib/actions/campaigns.actions.ts
 * @description Acciones de servidor seguras para la entidad 'campaigns'. Este aparato ha
 *              sido refactorizado para una máxima cohesión y seguridad, adhiriéndose
 *              estrictamente al principio de responsabilidad única.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { type User } from "@supabase/supabase-js";
import { ZodError } from "zod";

import { sites as sitesData } from "@/lib/data";
import { hasWorkspacePermission } from "@/lib/data/permissions";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  CreateCampaignSchema,
  DeleteCampaignSchema,
} from "@/lib/validators";

import { createAuditLog } from "./_helpers";

/**
 * @private
 * @async
 * @function getAuthenticatedUser
 * @description Helper interno para obtener el usuario autenticado y centralizar
 *              el manejo de errores de sesión no encontrada.
 * @returns {Promise<{ user: User } | { error: ActionResult<never> }>} El objeto de usuario
 *          o un objeto de error si el usuario no está autenticado.
 */
async function getAuthenticatedUser(): Promise<
  { user: User } | { error: ActionResult<never> }
> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { success: false, error: "Usuario no autenticado." } };
  }
  return { user };
}

/**
 * @public
 * @async
 * @function createCampaignAction
 * @description Crea una nueva campaña, validando los datos de entrada y los permisos
 *              del usuario para actuar sobre el sitio especificado.
 * @param {FormData} formData - Los datos del formulario que deben cumplir con `CreateCampaignSchema`.
 * @returns {Promise<ActionResult<{ id: string }>>} El resultado de la operación,
 *          conteniendo el ID de la nueva campaña en caso de éxito.
 */
export async function createCampaignAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const rawData = Object.fromEntries(formData);
    const { name, slug, site_id } = CreateCampaignSchema.parse(rawData);

    const site = await sitesData.getSiteById(site_id);
    if (!site) {
      return { success: false, error: "El sitio asociado no existe." };
    }

    const isAuthorized = await hasWorkspacePermission(
      user.id,
      site.workspace_id,
      ["owner", "admin", "member"]
    );

    if (!isAuthorized) {
      logger.warn(
        `[SEGURIDAD] VIOLACIÓN DE ACCESO: Usuario ${user.id} intentó crear una campaña en el sitio ${site_id} sin permisos.`
      );
      return {
        success: false,
        error: "No tienes permiso para crear campañas en este sitio.",
      };
    }

    const supabase = createClient();
    const { data: newCampaign, error } = await supabase
      .from("campaigns")
      .insert({ name, slug, site_id, content: {} })
      .select("id")
      .single();

    if (error) {
      logger.error("Error al crear la campaña en la base de datos:", error);
      return { success: false, error: "No se pudo crear la campaña." };
    }

    await createAuditLog("campaign.created", {
      userId: user.id,
      targetEntityId: newCampaign.id,
      targetEntityType: "campaign",
      metadata: { name, siteId: site_id },
    });

    revalidatePath(`/dashboard/sites/${site_id}/campaigns`);
    return { success: true, data: { id: newCampaign.id } };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "Datos inválidos." };
    }
    logger.error("Error inesperado en createCampaignAction:", error);
    return { success: false, error: "Un error inesperado ocurrió." };
  }
}

/**
 * @public
 * @async
 * @function deleteCampaignAction
 * @description Elimina una campaña, validando que el usuario tenga permisos
 *              sobre el workspace que contiene la campaña.
 * @param {FormData} formData - Los datos del formulario que deben cumplir con `DeleteCampaignSchema`.
 * @returns {Promise<ActionResult<{ message: string }>>} El resultado de la operación.
 */
export async function deleteCampaignAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  const authResult = await getAuthenticatedUser();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { campaignId } = DeleteCampaignSchema.parse({
      campaignId: formData.get("campaignId"),
    });

    const supabase = createClient();
    const { data: campaign, error: fetchError } = await supabase
      .from("campaigns")
      .select("*, sites ( workspace_id )")
      .eq("id", campaignId)
      .single();

    if (fetchError || !campaign) {
      return { success: false, error: "La campaña no se pudo encontrar." };
    }

    const workspaceId = campaign.sites?.workspace_id;
    if (!workspaceId) {
      logger.error(
        `INCONSISTENCIA DE DATOS: Campaña ${campaignId} sin workspace asociado.`
      );
      return { success: false, error: "Error de integridad de datos." };
    }

    const isAuthorized = await hasWorkspacePermission(user.id, workspaceId, [
      "owner",
      "admin",
      "member",
    ]);

    if (!isAuthorized) {
      logger.warn(
        `[SEGURIDAD] VIOLACIÓN DE ACCESO: Usuario ${user.id} intentó eliminar la campaña ${campaignId} sin permisos.`
      );
      return {
        success: false,
        error: "No tienes permiso para eliminar esta campaña.",
      };
    }

    const { error: deleteError } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", campaignId);

    if (deleteError) {
      logger.error(`Error al eliminar la campaña ${campaignId}:`, deleteError);
      return { success: false, error: "No se pudo eliminar la campaña." };
    }

    await createAuditLog("campaign.deleted", {
      userId: user.id,
      targetEntityId: campaign.id,
      targetEntityType: "campaign",
      metadata: { name: campaign.name, siteId: campaign.site_id },
    });

    revalidatePath(`/dashboard/sites/${campaign.site_id}/campaigns`);
    return { success: true, data: { message: "Campaña eliminada." } };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "ID de campaña inválido." };
    }
    logger.error("Error inesperado en deleteCampaignAction:", error);
    return { success: false, error: "Un error inesperado ocurrió." };
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Transacciones Atómicas**: ((Vigente)) La creación de una campaña y su log de auditoría deberían ocurrir dentro de una transacción de base de datos (RPC) para garantizar la atomicidad.
 * 2. **Manejo de Errores Granular**: ((Vigente)) Mapear códigos de error específicos de PostgreSQL (ej. `23505` para duplicados) a mensajes de error más amigables para el usuario.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Princípio DRY**: ((Implementada)) A lógica de obtenção do usuário autenticado foi abstraída para um helper interno `getAuthenticatedUser`, reduzindo a duplicação de código.
 * 2. **Segurança em Camadas**: ((Implementada)) As ações validam a sessão, a existência de entidades relacionadas (sites) e as permissões do usuário antes de realizar qualquer mutação.
 * 3. **Observabilidade e Auditoria**: ((Implementada)) Todas as operações de escrita são auditadas e registradas, fornecendo uma trilha completa de modificações.
 *
 * =====================================================================
 */
// src/lib/actions/campaigns.actions.ts
