// src/lib/types/database/tables/product_categories.ts
/**
 * @file product_categories.ts
 * @description Define el contrato de datos atómico para la tabla `product_categories`.
 *              Clasifica los productos en el marketplace de afiliados.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
export type ProductCategories = {
  Row: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  };
  Insert: {
    id?: number;
    name: string;
    slug: string;
    description?: string | null;
  };
  Update: {
    id?: number;
    name?: string;
    slug?: string;
    description?: string | null;
  };
  Relationships: [];
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Categorização**: ((Implementada)) Este tipo de dados fornece a estrutura para organizar o marketplace de afiliados, melhorando a navegabilidade.
 *
 * @subsection Melhorias Futuras
 * 1. **Jerarquia de Categorías**: ((Vigente)) Adicionar uma coluna `parent_category_id: number | null` com uma autorreferência para permitir a criação de subcategorias.
 * 2. **Contador de Produtos**: ((Vigente)) Manter um campo `product_count` que seja atualizado via gatilhos de banco de dados para uma contagem eficiente de produtos por categoria.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/product_categories.ts
