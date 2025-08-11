// src/lib/types/database/tables/site_templates.ts
/**
 * @file site_templates.ts
 * @description Define el contrato de datos atómico para la tabla `site_templates`.
 *              Esta es la entidad central para la funcionalidad de creación de
 *              sitios a partir de plantillas predefinidas.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Json } from "../_shared";

export type SiteTemplates = {
  Row: {
    id: string;
    name: string;
    description: string | null;
    category_id: number | null;
    preview_image_url: string | null;
    structure: Json;
    author_id: string | null;
    is_public: boolean;
    usage_count: number;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    name: string;
    description?: string | null;
    category_id?: number | null;
    preview_image_url?: string | null;
    structure: Json;
    author_id?: string | null;
    is_public?: boolean;
    usage_count?: number;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    description?: string | null;
    category_id?: number | null;
    preview_image_url?: string | null;
    structure?: Json;
    author_id?: string | null;
    is_public?: boolean;
    usage_count?: number;
    created_at?: string;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "site_templates_category_id_fkey";
      columns: ["category_id"];
      isOneToOne: false;
      referencedRelation: "template_categories";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "site_templates_author_id_fkey";
      columns: ["author_id"];
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
 * 1. **Contrato de Galeria de Modelos**: ((Implementada)) Este tipo de dados estabelece a base para a galeria de modelos, uma característica chave para acelerar o fluxo de trabalho do usuário.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Fuerte para `structure`**: ((Vigente)) Reemplazar el tipo genérico `Json` con un tipo inferido de un esquema de Zod (`z.infer<typeof SiteTemplateStructureSchema>`) para proporcionar segurança de tipos de ponta a ponta.
 * 2. **Versionado de Modelos**: ((Vigente)) Adicionar um campo `version: number` para gerenciar futuras atualizações na estrutura de um modelo sem quebrar os sites existentes que o utilizaram.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/site_templates.ts
