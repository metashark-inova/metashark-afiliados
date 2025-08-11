// src/lib/data/notifications.ts
/**
 * @file src/lib/data/notifications.ts
 * @description Aparato de datos para notificaciones e invitaciones. Esta es la
 *              Única Fuente de Verdad para obtener las invitaciones pendientes de un
 *              usuario, una pieza clave para la funcionalidad de colaboración en
 *              tiempo real.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";

type Supabase = SupabaseClient<any, "public", any>;

/**
 * @private
 * @typedef RawInvitationData
 * @description Define la estructura de datos cruda devuelta por la consulta de Supabase.
 *              La relación con `workspaces` puede devolver un objeto o un array de un solo elemento.
 */
type RawInvitationData = {
  id: string;
  status: string;
  workspaces:
    | { name: string; icon: string | null }
    | { name: string; icon: string | null }[]
    | null;
};

/**
 * @public
 * @typedef Invitation
 * @description Define el contrato de datos limpio y canónico para una invitación,
 *              como se espera que sea consumido por la UI.
 */
export type Invitation = {
  id: string;
  status: string;
  workspaces: { name: string; icon: string | null } | null;
};

/**
 * @public
 * @async
 * @function getPendingInvitationsByEmail
 * @description Obtiene y transforma todas las invitaciones pendientes para un email de usuario.
 *              Esta función realiza la consulta a la base de datos y normaliza la estructura
 *              de datos para asegurar que `workspaces` sea siempre un objeto o nulo.
 * @param {string} userEmail - El email del usuario para buscar invitaciones.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente de Supabase para inyección de dependencias.
 * @returns {Promise<Invitation[]>} Una promesa que resuelve a un array de invitaciones.
 * @throws {Error} Si la consulta a la base de datos falla, se registra el error y se lanza una excepción.
 */
export async function getPendingInvitationsByEmail(
  userEmail: string,
  supabaseClient?: Supabase
): Promise<Invitation[]> {
  const supabase = supabaseClient || createServerClient();
  const { data, error } = await supabase
    .from("invitations")
    .select("id, status, workspaces (name, icon)")
    .eq("invitee_email", userEmail)
    .eq("status", "pending");

  if (error) {
    logger.error(
      `[DataLayer:Notifications] Error al obtener invitaciones para ${userEmail}:`,
      error
    );
    throw new Error("No se pudieron cargar las invitaciones.");
  }

  // Normaliza la estructura de datos para la UI.
  const pendingInvitations: Invitation[] =
    (data as RawInvitationData[])?.map((inv) => ({
      id: inv.id,
      status: inv.status,
      workspaces: Array.isArray(inv.workspaces)
        ? inv.workspaces[0] || null
        : inv.workspaces,
    })) || [];

  return pendingInvitations;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Reintroducción de Notificaciones Genéricas**: ((Vigente)) Si la funcionalidad de notificaciones más allá de las invitaciones es necesaria, se debe crear la tabla `notifications` en la base de datos, regenerar los tipos y luego reintroducir la lógica para consultar esa tabla, probablemente en una nueva función `getUnreadNotificationsByUserId`.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Foco e Coesão (SRP)**: ((Implementada)) O aparato agora foca exclusivamente na lógica de convites, que é a implementação real no esquema do banco de dados. A lógica para a tabela inexistente `notifications` foi removida, eliminando a dívida técnica e o código morto.
 * 2. **Normalização de Dados**: ((Implementada)) A função inclui uma etapa de transformação de dados que garante que a propriedade `workspaces` sempre tenha um formato consistente (objeto ou nulo), tornando o contrato com a UI mais robusto e previsível.
 * 3. **Injeção de Dependências**: ((Implementada)) A função suporta injeção de dependências para o cliente Supabase, garantindo 100% de testabilidade.
 *
 * =====================================================================
 */
// src/lib/data/notifications.ts
