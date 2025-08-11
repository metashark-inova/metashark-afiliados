// src/lib/types/database/tables/invitations.ts
/**
 * @file invitations.ts
 * @description Define el contrato de datos atómico para la tabla `invitations`.
 *              Gestiona el flujo de invitaciones de usuarios a workspaces.
 *              Corregido para referenciar 'profiles' en lugar de 'users'.
 * @author L.I.A Legacy
 * @version 1.1.0 (Referential Integrity Fix)
 */
import { type Enums } from "../enums";

export type Invitations = {
  Row: {
    created_at: string;
    id: string;
    invitee_email: string;
    invited_by: string;
    role: Enums["workspace_role"];
    status: string;
    updated_at: string;
    workspace_id: string;
  };
  Insert: {
    created_at?: string;
    id?: string;
    invitee_email: string;
    invited_by: string;
    role: Enums["workspace_role"];
    status?: string;
    updated_at?: string;
    workspace_id: string;
  };
  Update: {
    created_at?: string;
    id?: string;
    invitee_email?: string;
    invited_by?: string;
    role?: Enums["workspace_role"];
    status?: string;
    updated_at?: string;
    workspace_id?: string;
  };
  Relationships: [
    {
      foreignKeyName: "invitations_invited_by_fkey";
      columns: ["invited_by"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "invitations_workspace_id_fkey";
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
 * 1. **Contrato de Colaboração**: ((Implementada)) Este tipo de dados é crucial para a funcionalidade de colaboração da plataforma.
 * 2. **Integridade Referencial**: ((Implementada)) A chave estrangeira foi corrigida para apontar para `profiles`, mantendo a consistência do esquema.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipo ENUM para `status`**: ((Vigente)) Converter o campo `status` de `string` para um tipo ENUM da base de dados para garantir a integridade dos dados ('pending', 'accepted', 'declined').
 * 2. **Data de Expiração**: ((Vigente)) Adicionar um campo `expires_at: string` para que os convites possam ser invalidados automaticamente.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/invitations.ts
