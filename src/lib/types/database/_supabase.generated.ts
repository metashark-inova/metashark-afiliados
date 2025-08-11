// src/lib/types/database/_supabase.generated.ts
/**
 * @file _supabase.generated.ts
 * @description Snapshot de tipos de base de datos generado estáticamente.
 *              ESTE ARCHIVO ES UN FALLBACK. La práctica de élite es regenerarlo
 *              con `pnpm gen:types` después de cualquier cambio en el esquema de la BD.
 * @author L.I.A. Legacy (Snapshot Estático)
 * @version 2025-08-10T00:00:00.000Z
 */
import { type Enums } from "./enums";
import { type Functions } from "./functions";
import * as Tables from "./tables";

export type Database = {
  public: {
    Tables: {
      achievements: Tables.Achievements;
      affiliate_products: Tables.AffiliateProducts;
      asset_library: Tables.AssetLibrary;
      audit_logs: Tables.AuditLogs;
      brand_kits: Tables.BrandKits;
      campaigns: Tables.Campaigns;
      coupons: Tables.Coupons;
      custom_blocks: Tables.CustomBlocks;
      customers: Tables.Customers;
      feature_flags: Tables.FeatureFlags;
      invitations: Tables.Invitations;
      notifications: Tables.Notifications;
      prices: Tables.Prices;
      product_categories: Tables.ProductCategories;
      products: Tables.Products;
      profiles: Tables.Profiles;
      site_templates: Tables.SiteTemplates;
      sites: Tables.Sites;
      subscribers: Tables.Subscribers;
      subscriptions: Tables.Subscriptions;
      template_categories: Tables.TemplateCategories;
      ticket_messages: Tables.TicketMessages;
      tickets: Tables.Tickets;
      user_achievements: Tables.UserAchievements;
      user_tokens: Tables.UserTokens;
      visitor_logs: Tables.VisitorLogs;
      workspace_members: Tables.WorkspaceMembers;
      workspaces: Tables.Workspaces;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: Functions;
    Enums: Enums;
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Estrutura de Banco de Dados Base**: ((Implementada)) Este arquivo cria a estrutura `Database` fundamental que será consumida e aumentada por outros módulos de tipo.
 *
 * @subsection Melhorias Futuras
 * 1. **Geração Automática**: ((Vigente)) O script `pnpm gen:types` deve ser reativado e executado para garantir que este arquivo seja um reflexo fiel e atualizado do esquema do banco de dados remoto.
 *
 * =====================================================================
 */
// src/lib/types/database/_supabase.generated.ts
