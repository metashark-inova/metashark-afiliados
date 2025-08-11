// src/lib/types/database/tables/audit_logs.ts
/**
 * @file audit_logs.ts
 * @description Define el contrato de datos atómico para la tabla `audit_logs`.
 *              Esta tabla proporciona un registro de auditoría inmutable de todas las
 *              acciones críticas realizadas en la plataforma, esencial para la seguridad y la depuración.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Json } from "../_shared";

export type AuditLogs = {
  Row: {
    id: number;
    created_at: string;
    actor_id: string | null; // El usuario que realizó la acción
    action: string; // Ej: "user.login", "site.created", "workspace.member.invited"
    target_entity_id: string | null; // El ID del objeto afectado (ej. site_id)
    target_entity_type: string | null; // Ej: "site", "campaign"
    metadata: Json | null; // Detalles adicionales en formato JSON
    ip_address: string | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    actor_id?: string | null;
    action: string;
    target_entity_id?: string | null;
    target_entity_type?: string | null;
    metadata?: Json | null;
    ip_address?: string | null;
  };
  Update: never; // Esta tabla debe ser inmutable (append-only)
  Relationships: [
    {
      foreignKeyName: "audit_logs_actor_id_fkey";
      columns: ["actor_id"];
      isOneToOne: false;
      referencedRelation: "users";
      referencedColumns: ["id"];
    },
  ];
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Observabilidade**: ((Implementada)) Este tipo de dados é a espinha dorsal da segurança e observabilidade do sistema, permitindo um rastreamento completo das ações dos usuários.
 *
 * @subsection Melhorias Futuras
 * 1. **Visualizador de Logs no `dev-console`**: ((Vigente)) Criar uma interface no painel de desenvolvedor para buscar, filtrar e visualizar esses logs.
 * 2. **Sistema de Alertas**: ((Vigente)) Configurar gatilhos no banco de dados que, diante de certas ações críticas, enviem um alerta a um canal de monitoramento.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/audit_logs.ts
