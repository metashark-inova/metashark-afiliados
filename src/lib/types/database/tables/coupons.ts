// src/lib/types/database/tables/coupons.ts
/**
 * @file coupons.ts
 * @description Define el contrato de datos atómico para la tabla `coupons`.
 *              Esta tabla almacena los cupones de descuento y de regalo, actuando
 *              como un espejo de los datos configurados en el procesador de pagos (Stripe).
 * @author L.I.A Legacy
 * @version 1.0.0
 */
export type Coupons = {
  Row: {
    id: string;
    code: string;
    status: "active" | "inactive" | "expired";
    discount_type: "percentage" | "fixed_amount";
    discount_value: number;
    duration: "once" | "repeating" | "forever";
    duration_in_months: number | null;
    max_redemptions: number | null;
    redeem_by: string | null;
    created_at: string;
  };
  Insert: {
    id: string;
    code: string;
    status?: "active" | "inactive" | "expired";
    discount_type: "percentage" | "fixed_amount";
    discount_value: number;
    duration: "once" | "repeating" | "forever";
    duration_in_months?: number | null;
    max_redemptions?: number | null;
    redeem_by?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    code?: string;
    status?: "active" | "inactive" | "expired";
    discount_type?: "percentage" | "fixed_amount";
    discount_value?: number;
    duration?: "once" | "repeating" | "forever";
    duration_in_months?: number | null;
    max_redemptions?: number | null;
    redeem_by?: string | null;
    created_at?: string;
  };
  Relationships: [];
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Monetização**: ((Implementada)) Este tipo de dados estabelece a base para a gestão de descontos e promoções, um pilar da estratégia de monetização.
 *
 * @subsection Melhorias Futuras
 * 1. **Tabla de Canjes (`coupon_redemptions`)**: ((Vigente)) Criar uma tabela de união para rastrear qual usuário (`user_id`) resgatou qual cupom (`coupon_id`) e quando (`redeemed_at`).
 * 2. **Server Action `redeemCouponAction`**: ((Vigente)) Implementar uma Server Action que valide um código de cupom e o aplique à assinatura de um usuário.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/coupons.ts
