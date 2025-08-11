// src/lib/types/database/tables/notifications.ts
/**
 * @file notifications.ts
 * @description Define el contrato de datos atómico para la tabla `notifications`.
 *              Gestiona las notificaciones en la aplicación para los usuarios.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Json } from "../_shared";

export type Notifications = {
  Row: {
    id: number;
    user_id: string; // El destinatario de la notificación
    actor_id: string | null; // El usuario que originó la notificación
    type: string; // Ej: "workspace.invitation", "campaign.analysis_complete"
    data: Json | null; // Datos contextuales (ej: { workspaceName: 'Proyecto X' })
    read_at: string | null;
    created_at: string;
  };
  Insert: {
    id?: number;
    user_id: string;
    actor_id?: string | null;
    type: string;
    data?: Json | null;
    read_at?: string | null;
    created_at?: string;
  };
  Update: {
    id?: number;
    user_id?: string;
    actor_id?: string | null;
    type?: string;
    data?: Json | null;
    read_at?: string | null;
    created_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "notifications_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "notifications_actor_id_fkey";
      columns: ["actor_id"];
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
 * 1. **Contrato de Notificações**: ((Implementada)) Este tipo de dados é a base para o futuro centro de notificações em tempo real da UI, uma característica chave para o engajamento do usuário.
 *
 * @subsection Melhorias Futuras
 * 1. **Notificações Push e por Email**: ((Vigente)) Adicionar campos `email_sent_at` e `push_sent_at` para rastrear a entrega através de diferentes canais.
 * 2. **Agrupamento de Notificações**: ((Vigente)) Implementar uma lógica na camada de dados que agrupe notificações similares para evitar sobrecarregar o usuário.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/notifications.ts
