// src/lib/types/database/tables/subscriptions.ts
/**
 * @file subscriptions.ts
 * @description Define el contrato de datos atómico para la tabla `subscriptions`.
 *              Gestiona el estado de las suscripciones de los usuarios a los planes.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Json } from "../_shared";
import { type Enums } from "../enums";

export type Subscriptions = {
  Row: {
    cancel_at: string | null;
    cancel_at_period_end: boolean | null;
    canceled_at: string | null;
    created: string;
    current_period_end: string;
    current_period_start: string;
    ended_at: string | null;
    id: string;
    metadata: Json | null;
    price_id: string | null;
    quantity: number | null;
    status: Enums["subscription_status"] | null;
    trial_end: string | null;
    trial_start: string | null;
    user_id: string;
  };
  Insert: {
    cancel_at?: string | null;
    cancel_at_period_end?: boolean | null;
    canceled_at?: string | null;
    created?: string;
    current_period_end?: string;
    current_period_start?: string;
    ended_at?: string | null;
    id: string;
    metadata?: Json | null;
    price_id?: string | null;
    quantity?: number | null;
    status?: Enums["subscription_status"] | null;
    trial_end?: string | null;
    trial_start?: string | null;
    user_id: string;
  };
  Update: {
    cancel_at?: string | null;
    cancel_at_period_end?: boolean | null;
    canceled_at?: string | null;
    created?: string;
    current_period_end?: string;
    current_period_start?: string;
    ended_at?: string | null;
    id?: string;
    metadata?: Json | null;
    price_id?: string | null;
    quantity?: number | null;
    status?: Enums["subscription_status"] | null;
    trial_end?: string | null;
    trial_start?: string | null;
    user_id?: string;
  };
  Relationships: [
    {
      foreignKeyName: "subscriptions_price_id_fkey";
      columns: ["price_id"];
      isOneToOne: false;
      referencedRelation: "prices";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "subscriptions_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "users";
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
 * 1. **Contrato de Assinaturas**: ((Implementada)) Este tipo de dados é a tabela mais crítica para a lógica de negócio e monetização, definindo o acesso de um usuário a funcionalidades pagas.
 *
 * @subsection Melhorias Futuras
 * 1. **Suporte para Assinaturas a Nível de Workspace**: ((Vigente)) Adicionar uma coluna `workspace_id` opcional para permitir que as assinaturas se apliquem a uma equipe inteira.
 * 2. **Tipado Fuerte para `metadata`**: ((Vigente)) Definir um esquema de Zod para o campo `metadata` e usar `z.infer` para substituir o tipo `Json` genérico.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/subscriptions.ts
