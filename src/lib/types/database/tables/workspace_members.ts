// src/lib/types/database/tables/workspace_members.ts
/**
 * @file workspace_members.ts
 * @description Define el contrato de datos atómico para la tabla de unión `workspace_members`.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Enums } from "../enums";

export type WorkspaceMembers = {
  Row: {
    created_at: string;
    id: string;
    role: Enums["workspace_role"];
    user_id: string;
    workspace_id: string;
  };
  Insert: {
    created_at?: string;
    id?: string;
    role?: Enums["workspace_role"];
    user_id: string;
    workspace_id: string;
  };
  Update: {
    created_at?: string;
    id?: string;
    role?: Enums["workspace_role"];
    user_id?: string;
    workspace_id?: string;
  };
  Relationships: [
    {
      foreignKeyName: "workspace_members_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "workspace_members_workspace_id_fkey";
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
 * 1. **Contrato de Colaboração Multi-Tenant**: ((Implementada)) Este tipo de dados é a base do sistema de permissões e colaboração, definindo a relação muitos-para-muitos entre usuários e workspaces.
 *
 * @subsection Melhorias Futuras
 * 1. **Estado do Membro**: ((Vigente)) Incluir um campo `status: string` (ex: 'active', 'deactivated') para permitir que os administradores desativem temporariamente o acesso de um membro sem o remover.
 * 2. **Convidado Por**: ((Vigente)) Adicionar um campo `invited_by: string | null` que seja uma chave estrangeira para `profiles.id` para rastrear quem convidou cada membro.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/workspace_members.ts
