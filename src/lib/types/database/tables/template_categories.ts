// src/lib/types/database/tables/template_categories.ts
/**
 * @file template_categories.ts
 * @description Define el contrato de datos atómico para la tabla `template_categories`.
 *              Esta tabla permite organizar los templates de sitio en una galería
 *              filtrable y navegable para una mejor experiencia de usuario.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
export type TemplateCategories = {
  Row: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
  };
  Insert: {
    id?: number;
    name: string;
    slug: string;
    description?: string | null;
    created_at?: string;
  };
  Update: {
    id?: number;
    name?: string;
    slug?: string;
    description?: string | null;
    created_at?: string;
  };
  Relationships: [];
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Categorização de Modelos**: ((Implementada)) Este tipo de dados fornece a estrutura para organizar a galeria de modelos, melhorando a experiência do usuário.
 *
 * @subsection Melhorias Futuras
 * 1. **Jerarquia de Categorías**: ((Vigente)) Adicionar uma coluna `parent_category_id: number | null` com uma autorreferência para permitir a criação de subcategorias (ex. E-commerce > Roupas).
 *
 * =====================================================================
 */
// src/lib/types/database/tables/template_categories.ts
