// src/lib/types/database/enums.ts
/**
 * @file enums.ts
 * @description Contiene las definiciones de tipo para todos los ENUMs de la base de datos.
 *              Ha sido sincronizado con los tipos autogenerados para resolver
 *              conflictos de compatibilidad.
 * @author Metashark (adaptado de Supabase CLI, expandido por L.I.A Legacy)
 * @version 2.0.0 (Schema Synchronization)
 */
export type Enums = {
  app_role: "user" | "admin" | "developer";
  subscription_interval: "day" | "week" | "month" | "year";
  subscription_price_type: "one_time" | "recurring";
  subscription_status:
    | "trialing"
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "unpaid";
  workspace_role: "owner" | "admin" | "member";
  token_type: "general_purpose" | "image_generation" | "text_analysis";
  ticket_status:
    | "open"
    | "in_progress"
    | "awaiting_reply"
    | "resolved"
    | "closed";
  ticket_priority: "low" | "medium" | "high" | "urgent";
  achievement_type:
    | "onboarding"
    | "creation_milestone"
    | "performance_milestone"
    | "community";
  leaderboard_scope: "global" | "workspace" | "country";
  commission_type: "percentage" | "fixed_amount";
  product_status: "active" | "inactive" | "pending_approval";
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Tipos Enum**: ((Implementada)) Este arquivo centraliza todos os tipos ENUM, fornecendo uma SSoT para os estados discretos em toda a aplicação e resolvendo uma dependência chave para os tipos de tabela.
 *
 * @subsection Melhorias Futuras
 * 1. **Geração Automática**: ((Vigente)) Idealmente, este arquivo deveria ser gerado automaticamente pela introspecção do esquema da base de dados para garantir uma sincronização contínua e sem erros.
 *
 * =====================================================================
 */
// src/lib/types/database/enums.ts
