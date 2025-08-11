import { type Enums } from "../enums";
export type AffiliateProducts = {
  Row: {
    id: number;
    vendor_id: string; // FK a profiles.id
    category_id: number; // FK a product_categories.id
    name: string;
    description: string;
    landing_page_url: string;
    commission_type: Enums["commission_type"];
    commission_rate: number;
    status: Enums["product_status"];
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: number;
    vendor_id: string;
    category_id: number;
    name: string;
    description: string;
    landing_page_url: string;
    commission_type: Enums["commission_type"];
    commission_rate: number;
    status?: Enums["product_status"];
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: number;
    vendor_id?: string;
    category_id?: number;
    name?: string;
    description?: string;
    landing_page_url?: string;
    commission_type?: Enums["commission_type"];
    commission_rate?: number;
    status?: Enums["product_status"];
    created_at?: string;
    updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "affiliate_products_vendor_id_fkey";
      columns: ["vendor_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "affiliate_products_category_id_fkey";
      columns: ["category_id"];
      isOneToOne: false;
      referencedRelation: "product_categories";
      referencedColumns: ["id"];
    },
  ];
};


/*
=====================================================================
MEJORA CONTINUA
=====================================================================
@subsection Melhorias Adicionadas
Contrato de Marketplace: ((Implementada)) Este tipo de dados estabelece a base para o marketplace interno de produtos de afiliados.
@subsection Melhorias Futuras
Tabla affiliate_links: ((Vigente)) Criar uma tabela para gerar e armazenar links de afiliado únicos por usuário e por produto.
Métricas de Rendimento Agregadas: ((Vigente)) Incluir campos denormalizados como average_conversion_rate ou earnings_per_click para ajudar os afiliados a escolher as melhores ofertas.
=====================================================================
*/
// src/lib/types/database/tables/affiliate_products.ts