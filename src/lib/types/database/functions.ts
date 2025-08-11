// src/lib/types/database/functions.ts
/**
 * @file functions.ts
 * @description Contiene las definiciones de tipo para todas las funciones RPC
 *              (Remote Procedure Call) de la base de datos.
 *              ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE. NO LO EDITE MANUALMENTE.
 * @author L.I.A Legacy (Generado por scripts/generate-rpc-types.mjs)
 * @version 2025-08-09T20:25:40.939Z
 */
import { type Json } from "./_shared";

export type Functions = {
  accept_workspace_invitation: {
    Args: Record<string, never>;
    Returns: Json;
  };
  create_workspace_with_owner: {
    Args: {
      owner_user_id: string;
      new_workspace_name: string;
      new_workspace_icon: string;
    };
    Returns: { id: string }[];
  };
  get_public_table_names: {
    Args: Record<string, never>;
    Returns: { table_name: string }[];
  };
  get_system_diagnostics: {
    Args: Record<string, never>;
    Returns: Json;
  };
  execute_sql: {
    Args: Record<string, never>;
    Returns: Json;
  };
  reset_for_tests: {
    Args: Record<string, never>;
    Returns: string;
  };
  delete_all_users_and_data: {
    Args: Record<string, never>;
    Returns: { deleted_user_id: string }[];
  };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Funções RPC**: ((Implementada)) Este tipo de dados resolve a dependência final do arquivo `_supabase.generated.ts`, permitindo que o sistema de tipos da base de dados seja totalmente montado.
 *
 * @subsection Melhorias Futuras
 * 1. **Geração Automática**: ((Vigente)) O script `pnpm gen:rpc-types` deve ser migrado e reativado para manter este arquivo sincronizado com o esquema do banco de dados.
 *
 * =====================================================================
 */
// src/lib/types/database/functions.ts
