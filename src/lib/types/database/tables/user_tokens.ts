// src/lib/types/database/tables/user_tokens.ts
/**
 * @file user_tokens.ts
 * @description Define el contrato de datos atómico para la tabla `user_tokens`.
 *              Esta tabla es fundamental para la monetización basada en el uso,
 *              rastreando los créditos de IA consumibles por cada usuario.
 *              Corregido para referenciar 'profiles' en lugar de 'users'.
 * @author L.I.A Legacy
 * @version 1.1.0 (Referential Integrity Fix)
 */
import { type Enums } from "../enums";

export type UserTokens = {
  Row: {
    id: number;
    user_id: string;
    token_type: Enums["token_type"];
    balance: number;
    last_updated_at: string;
  };
  Insert: {
    id?: number;
    user_id: string;
    token_type: Enums["token_type"];
    balance?: number;
    last_updated_at?: string;
  };
  Update: {
    id?: number;
    user_id?: string;
    token_type?: Enums["token_type"];
    balance?: number;
    last_updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "user_tokens_user_id_fkey";
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
 * 1. **Contrato de Créditos de IA**: ((Implementada)) Este tipo de dados estabelece a base para a monetização baseada no uso das funcionalidades de IA.
 * 2. **Integridade Referencial**: ((Implementada)) A chave estrangeira foi corrigida para apontar para `profiles`, mantendo a consistência do esquema.
 *
 * @subsection Melhorias Futuras
 * 1. **Tabla de Transações (`token_transactions`)**: ((Vigente)) Criar uma tabela de log inalterável que registre cada débito e crédito de tokens para fins de auditoria.
 * 2. **Suporte para Expiração de Tokens**: ((Vigente)) Adicionar uma coluna `expires_at: string | null` para implementar tokens que expiram, como os de teste gratuito.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/user_tokens.ts
