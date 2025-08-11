// src/lib/types/database/tables/visitor_logs.ts
/**
 * @file visitor_logs.ts
 * @description Define el contrato de datos para `visitor_logs`. Ha sido enriquecido
 *              para incluir datos de atribución, contexto y seguridad.
 * @author L.I.A Legacy
 * @version 3.0.0 (Enriched Telemetry)
 */
import { type Json } from "../_shared";

export type VisitorLogs = {
  Row: {
    id: string;
    session_id: string;
    user_id: string | null;
    fingerprint: string;
    ip_address: string;
    geo_data: Json | null;
    user_agent: string | null;
    utm_params: Json | null;
    created_at: string;
    referrer: string | null;
    landing_page: string | null;
    browser_context: Json | null;
    is_bot: boolean;
    is_known_abuser: boolean;
  };
  Insert: {
    id?: string;
    session_id: string;
    user_id?: string | null;
    fingerprint: string;
    ip_address: string;
    geo_data?: Json | null;
    user_agent?: string | null;
    utm_params?: Json | null;
    created_at?: string;
    referrer?: string | null;
    landing_page?: string | null;
    browser_context?: Json | null;
    is_bot?: boolean;
    is_known_abuser?: boolean;
  };
  Update: never;
  Relationships: [
    {
      foreignKeyName: "visitor_logs_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
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
 * 1. **Contrato de Telemetria Avançada**: ((Implementada)) Este tipo de dados estabelece a base para um sistema de telemetria e análise de visitantes de nível de produção.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Fuerte para `Json`**: ((Vigente)) Definir esquemas Zod específicos para `geo_data`, `utm_params` e `browser_context` e usar `z.infer` para substituir o tipo `Json`, garantindo a integridade dos dados de telemetria.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/visitor_logs.ts
