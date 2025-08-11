// src/lib/types/database/tables/products.ts
/**
 * @file products.ts
 * @description Define el contrato de datos atómico para la tabla `products`.
 *              Almacena los productos de Stripe a los que los usuarios pueden suscribirse.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Json } from "../_shared";

export type Products = {
  Row: {
    active: boolean | null;
    description: string | null;
    id: string;
    image: string | null;
    metadata: Json | null;
    name: string | null;
  };
  Insert: {
    active?: boolean | null;
    description?: string | null;
    id: string;
    image?: string | null;
    metadata?: Json | null;
    name?: string | null;
  };
  Update: {
    active?: boolean | null;
    description?: string | null;
    id?: string;
    image?: string | null;
    metadata?: Json | null;
    name?: string | null;
  };
  Relationships: [];
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Produto de Pagamento**: ((Implementada)) Este tipo de dados, junto com `prices`, completa a base da nossa arquitetura de monetização.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipo de Produto**: ((Vigente)) Adicionar um campo `product_type` de tipo ENUM ('subscription', 'one_time') para diferenciar entre modelos de negócio.
 * 2. **Relacionamento com Feature Flags**: ((Vigente)) Vincular produtos a uma futura tabela `feature_flags` para um controle granular sobre quais funcionalidades cada produto ativa.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/products.ts
