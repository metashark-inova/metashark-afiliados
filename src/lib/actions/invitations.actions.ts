// src/lib/actions/invitations.actions.ts
/**
 * @file src/lib/actions/invitations.actions.ts
 * @description Aparato de orquestación de acciones atómico para el ciclo de vida de
 *              invitaciones. Contiene la lógica de negocio para enviar y aceptar
 *              invitaciones de workspace, validando permisos y datos, y auditando
 *              cada operación.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { ZodError } from "zod";

import { requireWorkspacePermission } from "@/lib/auth/user-permissions";
import { invitations as invitationsData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, InvitationServerSchema } from "@/lib/validators";

import { createAuditLog } from "./_helpers";

/**
 * @public
 * @async
 * @function sendWorkspaceInvitationAction
 * @description Envía una invitación a un nuevo miembro para unirse a un workspace.
 *              Valida que el actor tenga permisos de 'owner' o 'admin', que el
 *              destinatario no sea él mismo, y que no exista ya una invitación o membresía.
 * @param {FormData} formData - Los datos del formulario de invitación.
 * @returns {Promise<ActionResult<{ message: string }>>} El resultado de la operación.
 */
export async function sendWorkspaceInvitationAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn(
      "[InvitationsAction] Intento no autorizado para enviar invitación."
    );
    return { success: false, error: "No autenticado." };
  }

  try {
    const parsedData = InvitationServerSchema.parse(
      Object.fromEntries(formData.entries())
    );
    const { invitee_email, role, workspace_id } = parsedData;

    if (invitee_email === user.email) {
      return { success: false, error: "No puedes invitarte a ti mismo." };
    }

    const permissionCheck = await requireWorkspacePermission(workspace_id, [
      "owner",
      "admin",
    ]);
    if (!permissionCheck.success) {
      return { success: false, error: permissionCheck.error };
    }

    const result = await invitationsData.createInvitation({
      ...parsedData,
      invited_by: user.id,
    });

    if (!result.success) {
      // Manejar error de violación de unicidad de la base de datos de forma amigable.
      if (result.error?.code === "23505") {
        return {
          success: false,
          error: "Este usuario ya ha sido invitado o ya es miembro.",
        };
      }
      return { success: false, error: "No se pudo enviar la invitación." };
    }

    await createAuditLog("workspace_invitation_sent", {
      userId: user.id,
      targetEntityId: workspace_id,
      targetEntityType: "workspace",
      metadata: { invitedEmail: invitee_email, role },
    });

    // Revalida la caché de invitaciones para el destinatario.
    revalidateTag(`invitations:${invitee_email}`);
    logger.info("[InvitationsAction] Invitación enviada con éxito.", {
      inviterId: user.id,
      inviteeEmail: invitee_email,
      workspaceId: workspace_id,
    });
    return {
      success: true,
      data: { message: `Invitación enviada a ${invitee_email}.` },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: "Datos de invitación inválidos." };
    }
    logger.error("[InvitationsAction] Error inesperado al enviar invitación.", {
      error,
    });
    return { success: false, error: "Un error inesperado ocurrió." };
  }
}

/**
 * @public
 * @async
 * @function acceptInvitationAction
 * @description Permite a un usuario autenticado aceptar una invitación pendiente.
 *              Delega la lógica transaccional a la RPC `accept_workspace_invitation`.
 *              Revalida todas las cachés relevantes tras el éxito.
 * @param {string} invitationId - El ID de la invitación a aceptar.
 * @returns {Promise<ActionResult<{ message: string }>>} El resultado de la operación.
 */
export async function acceptInvitationAction(
  invitationId: string
): Promise<ActionResult<{ message: string }>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado." };
  }

  const result = await invitationsData.acceptInvitation(invitationId, user.id);

  if (!result.success) {
    return {
      success: false,
      error: result.error || "No se pudo aceptar la invitación.",
    };
  }

  await createAuditLog("workspace_invitation_accepted", {
    userId: user.id,
    targetEntityId: invitationId,
    targetEntityType: "invitation",
  });

  if (user.email) {
    revalidateTag(`invitations:${user.email}`);
  } else {
    logger.warn(
      `[InvitationsAction] No se pudo revalidar la caché de invitaciones por email para el usuario ${user.id} porque el email no está disponible.`
    );
  }
  revalidateTag(`workspaces:${user.id}`);
  revalidatePath("/dashboard", "layout");

  logger.info("[InvitationsAction] Invitación aceptada con éxito.", {
    userId: user.id,
    invitationId,
  });
  return {
    success: true,
    data: {
      message: result.message || "Te has unido al workspace con éxito!",
    },
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Revocar Invitación**: ((Vigente)) Crear una `revokeInvitationAction(invitationId)` que permita a los administradores cancelar una invitación pendiente.
 * 2. **Reenviar Invitación**: ((Vigente)) Añadir una `resendInvitationAction(invitationId)` que vuelva a enviar el correo de invitación, con limitación de tasa.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fluxo de Colaboração Completo**: ((Implementada)) Este aparato fornece a lógica de backend para o ciclo de vida completo de convites, uma funcionalidade essencial para equipes e agências.
 * 2. **Segurança e Validação em Camadas**: ((Implementada)) A ação de envio valida permissões (`requireWorkspacePermission`), dados de entrada (`InvitationServerSchema`) e regras de negócio (não se auto-convidar), garantindo uma operação robusta.
 * 3. **Revalidação de Cache Precisa**: ((Implementada)) As ações invalidam as tags de cache relevantes (`invitations`, `workspaces`) e o caminho do layout, garantindo que a UI de todos os usuários afetados se atualize de forma consistente.
 *
 * =====================================================================
 */
// src/lib/actions/invitations.actions.ts
