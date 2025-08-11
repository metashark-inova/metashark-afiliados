// src/lib/types/database/tables/custom_blocks.ts
/**
 * @file custom_blocks.ts
 * @description Define el contrato de datos atómico para la tabla `custom_blocks`.
 *              Permite a los usuarios guardar bloques personalizados para reutilizarlos en el constructor.
 *              Corregido para referenciar 'profiles' en lugar de 'users'.
 * @author L.I.A Legacy
 * @version 1.1.0 (Referential Integrity Fix)
 */
import { type Json } from "../_shared";

export type CustomBlocks = {
  Row: {
    id: number;
    workspace_id: string;
    user_id: string;
    block_type: string; // El tipo de bloque original (ej. 'Hero1')
    block_data: Json; // El objeto completo de props y styles del bloque
    preview_image_url: string | null;
    name: string;
    created_at: string;
  };
  Insert: {
    id?: number;
    workspace_id: string;
    user_id: string;
    block_type: string;
    block_data: Json;
    preview_image_url?: string | null;
    name: string;
    created_at?: string;
  };
  Update: {
    id?: number;
    workspace_id?: string;
    user_id?: string;
    block_type?: string;
    block_data?: Json;
    preview_image_url?: string | null;
    name?: string;
    created_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "custom_blocks_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "custom_blocks_user_id_fkey";
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
 * 1. **Contrato de Bloco Personalizado**: ((Implementada)) Este tipo de dados estabelece a base para a funcionalidade de biblioteca de componentes do usuário, uma característica chave de produtividade.
 * 2. **Integridade Referencial**: ((Implementada)) A chave estrangeira foi corrigida para apontar para `profiles`, mantendo a consistência do esquema.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Fuerte para `block_data`**: ((Vigente)) Usar `z.infer<typeof PageBlockSchema>` para substituir o tipo `Json` genérico, garantindo a integridade dos dados guardados.
 * 2. **Geração Automática de Pré-visualização**: ((Vigente)) Implementar uma Edge Function que renderize o `block_data` em um ambiente headless e gere uma imagem de pré-visualização.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/custom_blocks.ts
