// src/lib/data/invitations.ts
/**
 * @file src/lib/data/invitations.ts
 * @description Aparato de datos atómico para la entidad de invitaciones.
 *              Esta es la Única Fuente de Verdad para las operaciones de escritura
 *              relacionadas con la tabla `invitations` y sus RPCs asociadas.
 *              Las operaciones de lectura se encuentran en `notifications.ts`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Enums, type TablesInsert } from "@/lib/types/database";

type Supabase = SupabaseClient<any, "public", any>;

/**
 * @public
 * @typedef {object} CreateInvitationPayload
 * @description Contrato de datos para crear una nueva inserción de invitación.
 */
type CreateInvitationPayload = {
  workspace_id: string;
  invitee_email: string;
  role: Enums<"workspace_role">;
  invited_by: string;
};

/**
 * @public
 * @async
 * @function createInvitation
 * @description Inserta un nuevo registro de invitación en la base de datos.
 * @param {CreateInvitationPayload} payload - Los datos para la nueva invitación.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase para inyección de dependencias.
 * @returns {Promise<{ success: boolean; error?: { code: string; message: string } }>} Un objeto indicando el éxito o fallo de la operación.
 */
export async function createInvitation(
  payload: CreateInvitationPayload,
  supabaseClient?: Supabase
): Promise<{ success: boolean; error?: { code: string; message: string } }> {
  const supabase = supabaseClient || createServerClient();
  const invitationData: TablesInsert<"invitations"> = {
    ...payload,
    status: "pending",
  };

  logger.trace("[DataLayer:Invitations] Intentando crear invitación.", {
    payload,
  });

  const { error } = await supabase.from("invitations").insert(invitationData);

  if (error) {
    logger.error("[DataLayer:Invitations] Error al crear invitación.", {
      code: error.code,
      message: error.message,
    });
    return {
      success: false,
      error: { code: error.code, message: error.message },
    };
  }

  logger.info("[DataLayer:Invitations] Invitación creada con éxito.", {
    invitee: payload.invitee_email,
    workspaceId: payload.workspace_id,
  });

  return { success: true };
}

/**
 * @public
 * @async
 * @function acceptInvitation
 * @description Invoca la RPC segura para aceptar una invitación de workspace.
 *              Esta función encapsula la llamada a la lógica de base de datos que
 *              añade al usuario como miembro y actualiza el estado de la invitación.
 * @param {string} invitationId - El ID de la invitación a ser aceptada.
 * @param {string} acceptingUserId - El ID del usuario que está aceptando.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase para inyección de dependencias.
 * @returns {Promise<{ success: boolean; error?: string; message?: string }>} Un objeto indicando el resultado de la operación.
 */
export async function acceptInvitation(
  invitationId: string,
  acceptingUserId: string,
  supabaseClient?: Supabase
): Promise<{ success: boolean; error?: string; message?: string }> {
  const supabase = supabaseClient || createServerClient();

  logger.trace("[DataLayer:Invitations] Intentando aceptar invitación.", {
    invitationId,
    userId: acceptingUserId,
  });

  const { data, error } = await supabase.rpc("accept_workspace_invitation", {
    invitation_id: invitationId,
    accepting_user_id: acceptingUserId,
  });

  const rpcResult = data as {
    success: boolean;
    error: string;
    message: string;
  } | null;

  if (error) {
    logger.error("[DataLayer:Invitations] RPC falló al aceptar invitación.", {
      invitationId,
      error,
    });
    return { success: false, error: "No se pudo procesar la aceptación." };
  }

  if (rpcResult && !rpcResult.success) {
    logger.warn(
      "[DataLayer:Invitations] RPC devolvió un error de lógica de negocio.",
      {
        invitationId,
        rpcError: rpcResult.error,
      }
    );
    return { success: false, error: rpcResult.error };
  }

  logger.info("[DataLayer:Invitations] Invitación aceptada vía RPC.", {
    invitationId,
    userId: acceptingUserId,
  });

  return { success: true, message: rpcResult?.message };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Función `revokeInvitation`**: ((Vigente)) Implementar una función que permita a un administrador de workspace revocar una invitación pendiente, cambiando su estado a 'revoked'.
 * 2. **Función `getInvitationById`**: ((Vigente)) Añadir una función para obtener los detalles de una invitación, que será útil para la futura acción de revocación y para mostrar más detalles en la UI.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidade da Camada de Dados**: ((Implementada)) Este aparato isola completamente a lógica de escrita de convites, aderindo à arquitetura canônica e ao Princípio de Responsabilidade Única.
 * 2. **Segurança via RPC**: ((Implementada)) A lógica de aceitação de convite é delegada a uma função RPC, o que é uma prática de elite, pois garante que a lógica de negócio complexa (inserir em `workspace_members` e atualizar `invitations`) ocorra de forma atômica dentro de uma transação no banco de dados.
 * 3. **Observabilidade Completa**: ((Implementada)) Logs de `trace`, `info`, `warn` e `error` fornecem uma visibilidade completa sobre o ciclo de vida das operações de convite.
 *
 * =====================================================================
 */
// src/lib/data/invitations.ts
