// src/lib/actions/telemetry.actions.ts
/**
 * @file src/lib/actions/telemetry.actions.ts
 * @description Contiene la Server Action para la telemetría del lado del cliente.
 *              Este aparato actúa como el punto de entrada del servidor para enriquecer
 *              los logs de sesión iniciados en el middleware con datos que solo están
 *              disponibles en el navegador (ej. fingerprint, resolución de pantalla).
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { ZodError } from "zod";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type TablesInsert } from "@/lib/types/database";
import { type ActionResult, ClientVisitSchema } from "@/lib/validators";

/**
 * @public
 * @async
 * @function logClientVisitAction
 * @description Registra o actualiza los datos de una visita de cliente en la tabla `visitor_logs`.
 *              Utiliza una operación `upsert` basada en el `session_id` para ser idempotente.
 *              Es resiliente y puede generar un `sessionId` si el cliente no lo proporciona,
 *              aunque se espera que lo haga a través de la cookie del middleware.
 * @param {unknown} payload - Los datos del cliente, que serán validados contra `ClientVisitSchema`.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function logClientVisitAction(
  payload: unknown
): Promise<ActionResult<void>> {
  logger.trace("[TelemetryAction] Iniciando log de visita de cliente.", {
    payload,
  });
  try {
    const validatedData = ClientVisitSchema.parse(payload);
    const {
      sessionId,
      fingerprint,
      screenWidth,
      screenHeight,
      userAgentClientHint,
    } = validatedData;

    const finalSessionId = sessionId || randomUUID();
    if (!sessionId) {
      logger.warn(
        `[TelemetryAction] Cliente no proporcionó sessionId. Generando uno nuevo: ${finalSessionId}`
      );
    }

    const supabase = createClient();
    const headersList = headers();
    const ipAddress = headersList.get("x-forwarded-for") ?? "127.0.0.1";

    const clientLogData: TablesInsert<"visitor_logs"> = {
      session_id: finalSessionId,
      fingerprint: fingerprint,
      ip_address: ipAddress,
      browser_context: {
        screenWidth,
        screenHeight,
        userAgentClientHint,
      },
    };

    const { error } = await supabase
      .from("visitor_logs")
      .upsert(clientLogData, { onConflict: "session_id" });

    if (error) {
      logger.error("[TelemetryAction] Error en upsert de visita de cliente:", {
        error: error.message,
        details: error.details,
      });
      return { success: false, error: "No se pudo registrar la visita." };
    }

    logger.info("[TelemetryAction] Visita de cliente registrada/actualizada.", {
      sessionId: finalSessionId,
    });
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn(
        "[TelemetryAction] Datos de visita de cliente inválidos:",
        error.flatten()
      );
      return { success: false, error: "Datos de cliente inválidos." };
    }
    logger.error(
      "[TelemetryAction] Error inesperado en logClientVisitAction:",
      error
    );
    return { success: false, error: "Un error inesperado ocurrió." };
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Enriquecimento de `user_id`**: ((Vigente)) A ação poderia tentar obter a sessão do usuário atual (`supabase.auth.getUser()`) e, se existir, adicionar o `user_id` ao `visitor_log`, vinculando a sessão anônima a um usuário autenticado.
 * 2. **Validação de Fingerprint do Servidor**: ((Vigente)) Para uma segurança de elite, o servidor poderia gerar sua própria `fingerprint` baseada em cabeçalhos e compará-la com a do cliente para detectar inconsistências.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Ponto de Coleta de Telemetria**: ((Implementada)) Este aparato estabelece o endpoint do servidor para a coleta de dados de telemetria do cliente, uma função essencial para a análise de visitantes.
 * 2. **Resiliência e Idempotência**: ((Implementada)) O uso de `upsert` torna a ação idempotente, evitando registros duplicados. A geração de `sessionId` como fallback a torna resiliente a falhas no cliente.
 * 3. **Segurança de Validação**: ((Implementada)) A validação rigorosa com Zod (`ClientVisitSchema`) na entrada da ação protege contra a injeção de dados malformados na base de dados.
 *
 * =====================================================================
 */
// src/lib/actions/telemetry.actions.ts
