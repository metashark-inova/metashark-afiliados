// src/lib/types/database/tables/ticket_messages.ts
/**
 * @file ticket_messages.ts
 * @description Define el contrato de datos atómico para la tabla `ticket_messages`.
 *              Almacena el hilo de conversación para cada ticket de soporte.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Json } from "../_shared";

export type TicketMessages = {
  Row: {
    id: number;
    ticket_id: number;
    user_id: string; // El autor del mensaje
    content: string;
    created_at: string;
    attachments: Json | null; // Array de URLs a archivos en Supabase Storage
  };
  Insert: {
    id?: number;
    ticket_id: number;
    user_id: string;
    content: string;
    created_at?: string;
    attachments?: Json | null;
  };
  Update: {
    id?: number;
    ticket_id?: number;
    user_id?: string;
    content?: string;
    created_at?: string;
    attachments?: Json | null;
  };
  Relationships: [
    {
      foreignKeyName: "ticket_messages_ticket_id_fkey";
      columns: ["ticket_id"];
      isOneToOne: false;
      referencedRelation: "tickets";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "ticket_messages_user_id_fkey";
      columns: ["user_id"];
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
 * 1. **Contrato de Mensagens de Suporte**: ((Implementada)) Este tipo de dados é essencial para a funcionalidade do sistema de tickets de suporte.
 *
 * @subsection Melhorias Futuras
 * 1. **Suporte para Mensagens Internas**: ((Vigente)) Adicionar um campo booleano `is_internal_note` para permitir que os agentes de suporte deixem comentários em um ticket que não são visíveis para o cliente.
 * 2. **Suporte para Rich Text/Markdown**: ((Vigente)) O campo `content` poderia armazenar Markdown. A UI se encarregaria de renderizá-lo de forma segura.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/ticket_messages.ts
