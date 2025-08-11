// src/lib/types/database/tables/brand_kits.ts
/**
 * @file brand_kits.ts
 * @description Define el contrato de datos atómico para la tabla `brand_kits`.
 *              Permite a los usuarios definir y aplicar su propia identidad de marca a las campañas.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Json } from "../_shared";

export type BrandKits = {
  Row: {
    id: number;
    workspace_id: string;
    name: string;
    colors: Json | null; // Ej: { "primary": "#FFFFFF", "secondary": "#000000" }
    fonts: Json | null; // Ej: { "headings": "font_name", "body": "font_name" }
    logo_url: string | null; // URL a un asset en Supabase Storage
    is_default: boolean;
    created_at: string;
  };
  Insert: {
    id?: number;
    workspace_id: string;
    name: string;
    colors?: Json | null;
    fonts?: Json | null;
    logo_url?: string | null;
    is_default?: boolean;
    created_at?: string;
  };
  Update: {
    id?: number;
    workspace_id?: string;
    name?: string;
    colors?: Json | null;
    fonts?: Json | null;
    logo_url?: string | null;
    is_default?: boolean;
    created_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "brand_kits_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
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
 * 1. **Contrato de Personalização**: ((Implementada)) Este tipo de dados estabelece a base para a funcionalidade de kits de marca, uma característica premium essencial para agências.
 *
 * @subsection Melhorias Futuras
 * 1. **Esquemas Zod para `colors` e `fonts`**: ((Vigente)) Definir esquemas de Zod para a estrutura dos campos JSON e usar `z.infer` para substituir o tipo `Json`, garantindo que os dados guardados sempre tenham a forma correta.
 * 2. **Vinculação a Campanhas**: ((Vigente)) Adicionar uma coluna `brand_kit_id: number | null` à tabela `campaigns` para permitir aplicar um kit de marca específico a cada campanha.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/brand_kits.ts
