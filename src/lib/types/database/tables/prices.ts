// src/lib/types/database/tables/prices.ts
/**
 * @file prices.ts
 * @description Define el contrato de datos atómico para la tabla `prices`.
 *              Almacena la información de los planes de precios de Stripe.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Json } from "../_shared";
import { type Enums } from "../enums";

export type Prices = {
  Row: {
    active: boolean | null;
    currency: string | null;
    description: string | null;
    id: string;
    interval: Enums["subscription_interval"] | null;
    interval_count: number | null;
    metadata: Json | null;
    product_id: string | null;
    trial_period_days: number | null;
    type: Enums["subscription_price_type"] | null;
    unit_amount: number | null;
  };
  Insert: {
    active?: boolean | null;
    currency?: string | null;
    description?: string | null;
    id: string;
    interval?: Enums["subscription_interval"] | null;
    interval_count?: number | null;
    metadata?: Json | null;
    product_id?: string | null;
    trial_period_days?: number | null;
    type?: Enums["subscription_price_type"] | null;
    unit_amount?: number | null;
  };
  Update: {
    active?: boolean | null;
    currency?: string | null;
    description?: string | null;
    id?: string;
    interval?: Enums["subscription_interval"] | null;
    interval_count?: number | null;
    metadata?: Json | null;
    product_id?: string | null;
    trial_period_days?: number | null;
    type?: Enums["subscription_price_type"] | null;
    unit_amount?: number | null;
  };
  Relationships: [
    {
      foreignKeyName: "prices_product_id_fkey";
      columns: ["product_id"];
      isOneToOne: false;
      referencedRelation: "products";
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
 * 1. **Contrato de Preços**: ((Implementada)) Este tipo de dados é um pilar da estratégia de monetização, definindo como os produtos são precificados.
 *
 * @subsection Melhorias Futuras
 * 1. **Campo de Nível de Plano**: ((Vigente)) Adicionar um campo `plan_tier` de tipo ENUM ('free', 'pro', 'enterprise') para facilitar as consultas de permissões baseadas no nível do plano.
 * 2. **Campo de Características**: ((Vigente)) Incluir um campo `features: jsonb` para listar de forma declarativa as características que este preço desbloqueia.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/prices.ts
