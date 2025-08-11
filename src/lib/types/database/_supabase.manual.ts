// src/lib/types/database/_supabase.manual.ts
/**
 * @file _supabase.manual.ts
 * @description Manifiesto de Tipos Manuales para la Base de Datos.
 *              Este aparato define tipos para entidades que no son generadas
 *              automáticamente por la CLI de Supabase, como las Vistas.
 *              Actúa como una capa de aumentación sobre los tipos generados.
 *              Ha sido refactorizado para incluir la definición de la vista
 *              `sites_with_campaign_counts`, resolviendo un error de tipo crítico.
 * @author L.I.A Legacy
 * @version 3.0.0 (View Augmentation)
 */
import { type Database as GeneratedDB } from "./_supabase.generated";

export type ManualDatabaseDefs = {
  public: {
    Views: {
      user_profiles_with_email: {
        Row: {
          app_role: GeneratedDB["public"]["Enums"]["app_role"] | null;
          avatar_url: string | null;
          email: string | null;
          full_name: string | null;
          id: string | null;
        };
        Insert: never;
        Update: never;
      };
      sites_with_campaign_counts: {
        Row: GeneratedDB["public"]["Tables"]["sites"]["Row"] & {
          campaign_count: number;
        };
        Insert: never;
        Update: never;
      };
    };
  };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Aumentação de Tipos de View**: ((Implementada)) Este arquivo adiciona as definições para as `Views` do banco de dados, que não são geradas automaticamente, completando a representação do esquema.
 *
 * @subsection Melhorias Futuras
 * 1. **Geração Automática de Vistas**: ((Vigente)) Continuar monitorando as atualizações da CLI do Supabase para a eventual geração automática de tipos de Vistas, o que tornaria este arquivo manual obsoleto.
 *
 * =====================================================================
 */
// src/lib/types/database/_supabase.manual.ts