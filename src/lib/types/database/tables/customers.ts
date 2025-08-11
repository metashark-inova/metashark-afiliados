// src/lib/types/database/tables/customers.ts
/**
 * @file customers.ts
 * @description Define el contrato de datos atómico para la tabla `customers`.
 *              Actúa como un puente entre los usuarios de la plataforma y los
 *              clientes en el sistema de pagos (Stripe).
 * @author L.I.A Legacy
 * @version 1.0.0
 */
export type Customers = {
  Row: {
    id: string;
    stripe_customer_id: string | null;
  };
  Insert: {
    id: string;
    stripe_customer_id?: string | null;
  };
  Update: {
    id?: string;
    stripe_customer_id?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "customers_id_fkey";
      columns: ["id"];
      isOneToOne: true;
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
 * 1. **Contrato de Cliente de Pagamentos**: ((Implementada)) Este tipo de dados estabelece a ligação entre o sistema de usuários e o sistema de pagamentos, sendo uma peça fundamental para a monetização.
 *
 * @subsection Melhorias Futuras
 * 1. **Sincronização de Metadados**: ((Vigente)) Adicionar um campo `metadata: Json` para armazenar informações adicionais sincronizadas a partir do Stripe, como o método de pagamento padrão.
 * 2. **Timestamp de Sincronização**: ((Vigente)) Incluir um campo `last_synced_at: string` para rastrear quando foi a última vez que os dados deste cliente foram sincronizados com o Stripe.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/customers.ts
