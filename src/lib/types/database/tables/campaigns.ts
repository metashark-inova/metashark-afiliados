// src/lib/types/database/tables/campaigns.ts
/**
 * @file campaigns.ts
 * @description Define el contrato de datos atómico para la tabla `campaigns`.
 *              Esta tabla es el núcleo de las operaciones de marketing, almacenando
 *              el contenido JSON que define la estructura de una landing page.
 *              Ha sido refactorizado para incluir el campo `affiliate_url`,
 *              resolviendo una inconsistencia de tipos en toda la aplicación.
 * @author L.I.A Legacy
 * @version 1.1.0 (Schema Alignment)
 */
import { type Json } from "../_shared";

export type Campaigns = {
  Row: {
    content: Json | null;
    created_at: string;
    id: string;
    name: string;
    site_id: string;
    slug: string | null;
    updated_at: string | null;
    affiliate_url: string | null;
  };
  Insert: {
    content?: Json | null;
    created_at?: string;
    id?: string;
    name: string;
    site_id: string;
    slug?: string | null;
    updated_at?: string | null;
    affiliate_url?: string | null;
  };
  Update: {
    content?: Json | null;
    created_at?: string;
    id?: string;
    name?: string;
    site_id?: string;
    slug?: string | null;
    updated_at?: string | null;
    affiliate_url?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "campaigns_site_id_fkey";
      columns: ["site_id"];
      isOneToOne: false;
      referencedRelation: "sites";
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
 * 1. **Contrato de Entidade Central**: ((Implementada)) Este tipo de dados define a estrutura da entidade mais crítica da aplicação.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Fuerte para `content`**: ((Vigente)) Reemplazar el tipo genérico `Json` con un tipo inferido de un esquema de Zod (`z.infer<typeof CampaignConfigSchema>`).
 * 2. **Campo de Estado (`status`)**: ((Vigente)) Añadir un campo `status` de tipo ENUM (ej: 'draft', 'published', 'archived') para permitir un flujo de trabajo de publicación más robusto.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/campaigns.ts
