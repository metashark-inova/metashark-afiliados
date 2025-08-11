// src/lib/types/database/tables/profiles.ts
/**
 * @file profiles.ts
 * @description Define el contrato de datos atómico para la tabla `profiles`.
 *              Sincronizado con el esquema remoto para eliminar el campo obsoleto
 *              `inferred_preferences`.
 * @author L.I.A Legacy
 * @version 2.0.0 (Remote Schema Synchronized)
 */
import { type Json } from "../_shared";
import { type Enums } from "../enums";

export type Profiles = {
  Row: {
    app_role: Enums["app_role"];
    avatar_url: string | null;
    dashboard_layout: Json | null;
    full_name: string | null;
    id: string;
    updated_at: string | null;
  };
  Insert: {
    app_role?: Enums["app_role"];
    avatar_url?: string | null;
    dashboard_layout?: Json | null;
    full_name?: string | null;
    id: string;
    updated_at?: string | null;
  };
  Update: {
    app_role?: Enums["app_role"];
    avatar_url?: string | null;
    dashboard_layout?: Json | null;
    full_name?: string | null;
    id?: string;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "profiles_id_fkey";
      columns: ["id"];
      isOneToOne: true;
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
 * 1. **Contrato de Perfil de Usuário**: ((Implementada)) Este tipo de dados é fundamental, ligando a autenticação do Supabase aos dados específicos da nossa aplicação, como papéis e personalização da UI.
 *
 * @subsection Melhorias Futuras
 * 1. **Campo de Preferências de UI**: ((Vigente)) Considerar adicionar um campo `preferences: Json` para armazenar configurações do usuário, como o tema preferido (claro/escuro).
 *
 * =====================================================================
 */
// src/lib/types/database/tables/profiles.ts
