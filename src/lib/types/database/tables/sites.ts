// src/lib/types/database/tables/sites.ts
/**
 * @file sites.ts
 * @description Define el contrato de datos atómico para la tabla `sites`.
 *              Sincronizado con el esquema remoto para reflejar la nulidad
 *              de `owner_id` y la presencia de todos los campos.
 * @author L.I.A Legacy
 * @version 2.0.0 (Remote Schema Synchronized)
 */
export type Sites = {
  Row: {
    created_at: string;
    custom_domain: string | null;
    description: string | null;
    icon: string | null;
    id: string;
    name: string;
    owner_id: string | null;
    subdomain: string | null;
    updated_at: string | null;
    workspace_id: string;
  };
  Insert: {
    created_at?: string;
    custom_domain?: string | null;
    description?: string | null;
    icon?: string | null;
    id?: string;
    name: string;
    owner_id?: string | null;
    subdomain?: string | null;
    updated_at?: string | null;
    workspace_id: string;
  };
  Update: {
    created_at?: string;
    custom_domain?: string | null;
    description?: string | null;
    icon?: string | null;
    id?: string;
    name?: string;
    owner_id?: string | null;
    subdomain?: string | null;
    updated_at?: string | null;
    workspace_id?: string;
  };
  Relationships: [
    {
      foreignKeyName: "sites_owner_id_fkey";
      columns: ["owner_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "sites_workspace_id_fkey";
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
 * 1. **Contrato de Entidade Site**: ((Implementada)) Este tipo de dados define a estrutura da entidade `site`, que atua como um contêiner para campanhas.
 *
 * @subsection Melhorias Futuras
 * 1. **Estado de Domínio Personalizado**: ((Vigente)) Adicionar um campo `custom_domain_status` de tipo ENUM para gerenciar o processo de verificação de domínios.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/sites.ts
