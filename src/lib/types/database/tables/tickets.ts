// src/lib/types/database/tables/tickets.ts
/**
 * @file tickets.ts
 * @description Define el contrato de datos atómico para la tabla `tickets`.
 *              Esta es la entidad principal para el sistema de soporte al cliente.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Enums } from "../enums";

export type Tickets = {
  Row: {
    id: number;
    user_id: string;
    workspace_id: string | null;
    subject: string;
    status: Enums["ticket_status"];
    priority: Enums["ticket_priority"];
    created_at: string;
    updated_at: string;
    assigned_to: string | null;
  };
  Insert: {
    id?: number;
    user_id: string;
    workspace_id?: string | null;
    subject: string;
    status?: Enums["ticket_status"];
    priority?: Enums["ticket_priority"];
    created_at?: string;
    updated_at?: string;
    assigned_to?: string | null;
  };
  Update: {
    id?: number;
    user_id?: string;
    workspace_id?: string | null;
    subject?: string;
    status?: Enums["ticket_status"];
    priority?: Enums["ticket_priority"];
    created_at?: string;
    updated_at?: string;
    assigned_to?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "tickets_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "tickets_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "tickets_assigned_to_fkey";
      columns: ["assigned_to"];
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
 * 1. **Contrato do Sistema de Suporte**: ((Implementada)) Este tipo de dados, juntamente com `ticket_messages`, completa a base para o sistema de suporte ao cliente.
 *
 * @subsection Melhorias Futuras
 * 1. **Busca de Texto Completo (Full-Text Search)**: ((Vigente)) A nível de banco de dados, criar um índice `tsvector` combinando o `subject` e o conteúdo das mensagens para permitir buscas eficientes.
 * 2. **Acompanhamento de SLA (Service Level Agreement)**: ((Vigente)) Adicionar colunas como `first_response_at` e `resolved_at` para medir os tempos de resposta e resolução.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/tickets.ts
