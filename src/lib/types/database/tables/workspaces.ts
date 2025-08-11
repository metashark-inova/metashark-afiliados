// src/lib/types/database/tables/workspaces.ts
/**
 * @file workspaces.ts
 * @description Define el contrato de datos atómico para la tabla `workspaces`.
 *              Sincronizado con el esquema remoto para eliminar el campo obsoleto
 *              `storage_used_mb`.
 * @author L.I.A Legacy
 * @version 2.0.0 (Remote Schema Synchronized)
 */
export type Workspaces = {
  Row: {
    created_at: string;
    current_site_count: number;
    id: string;
    icon: string | null;
    name: string;
    owner_id: string;
    updated_at: string | null;
  };
  Insert: {
    created_at?: string;
    current_site_count?: number;
    id?: string;
    icon?: string | null;
    name: string;
    owner_id: string;
    updated_at?: string | null;
  };
  Update: {
    created_at?: string;
    current_site_count?: number;
    id?: string;
    icon?: string | null;
    name?: string;
    owner_id?: string;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "workspaces_owner_id_fkey";
      columns: ["owner_id"];
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
 * 1. **Contrato de Entidade Multi-Tenant**: ((Implementada)) Este tipo de dados define a estrutura da entidade `workspace`, o contêiner de mais alto nível na hierarquia de dados do usuário.
 *
 * @subsection Melhorias Futuras
 * 1. **Limites de Recursos**: ((Vigente)) Considerar adicionar colunas como `max_sites` ou `max_members` que possam ser configuradas de acordo com o plano do workspace.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/workspaces.ts
