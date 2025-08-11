// src/lib/actions/_helpers/audit-log.helper.ts
/**
 * @file src/lib/actions/_helpers/audit-log.helper.ts
 * @description Helper atómico y reutilizable para registrar eventos de auditoría.
 *              Esta es una pieza crucial para la seguridad, la observabilidad y la
 *              trazabilidad de acciones críticas en toda la plataforma.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function createAuditLog
 * @description Registra un evento de auditoría en la tabla `audit_logs` de la base de datos.
 *              Captura la acción, el actor, la entidad objetivo, metadatos adicionales
 *              y la dirección IP de la petición.
 * @param {string} action - El nombre de la acción realizada (ej. "user.login", "site.created").
 * @param {object} details - Un objeto que contiene los detalles del evento.
 * @param {string} [details.userId] - El ID del usuario que realizó la acción.
 * @param {string} [details.targetEntityId] - El ID de la entidad afectada por la acción.
 * @param {string} [details.targetEntityType] - El tipo de la entidad afectada.
 * @param {Json} [details.metadata] - Metadatos adicionales relevantes en formato JSON.
 */
export async function createAuditLog(
  action: string,
  details: {
    userId?: string;
    targetEntityId?: string;
    targetEntityType?: string;
    metadata?: Json;
    [key: string]: any;
  }
) {
  try {
    const supabase = createClient();
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";

    const { error } = await supabase.from("audit_logs").insert({
      action,
      actor_id: details.userId,
      target_entity_id: details.targetEntityId,
      target_entity_type: details.targetEntityType,
      metadata: details.metadata || {},
      ip_address: ip,
    });

    if (error) {
      logger.error(
        `[AuditLogHelper] No se pudo guardar el log de auditoría para la acción '${action}':`,
        error
      );
    }
  } catch (e) {
    logger.error(
      `[AuditLogHelper] Fallo crítico al intentar guardar el log para la acción '${action}':`,
      e
    );
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Procesamiento Asíncrono**: ((Vigente)) Para acciones de muy alta frecuencia, la inserción del log podría ser delegada a una cola de trabajos (ej. Supabase Edge Functions con RabbitMQ o Vercel KV) para no añadir latencia a la respuesta de la Server Action principal.
 * 2. **Enriquecimiento Automático de Contexto**: ((Vigente)) El helper podría ser mejorado para obtener automáticamente el `userId` de la sesión activa si no se proporciona, simplificando su uso en las Server Actions.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fundamento de Segurança e Observabilidade**: ((Implementada)) Este helper estabelece a base para um sistema de auditoria robusto, uma dependência crítica para a maioria das Server Actions que modificam dados.
 * 2. **Manejo de Erros Resiliente**: ((Implementada)) A função utiliza um bloco `try/catch` para garantir que uma falha no sistema de logging de auditoria nunca interrompa a execução da Server Action principal.
 * 3. **Tipagem Segura de Metadados**: ((Implementada)) O uso do tipo `Json` importado de `_shared.ts` garante que os metadados sejam sempre um tipo de dados válido para a coluna `jsonb` do PostgreSQL.
 *
 * =====================================================================
 */
// src/lib/actions/_helpers/audit-log.helper.ts
