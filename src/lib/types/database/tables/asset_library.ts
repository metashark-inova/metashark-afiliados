// src/lib/types/database/tables/asset_library.ts
/**
 * @file asset_library.ts
 * @description Define el contrato de datos atómico para la tabla `asset_library`.
 *              Gestiona los archivos multimedia subidos por los usuarios para su uso en campañas.
 *              Corregido para referenciar 'profiles' en lugar de 'users'.
 * @author L.I.A Legacy
 * @version 1.1.0 (Referential Integrity Fix)
 */
export type AssetLibrary = {
  Row: {
    id: string;
    workspace_id: string;
    user_id: string; // Quién subió el archivo
    file_name: string;
    file_path: string; // Ruta en Supabase Storage
    file_type: string; // ej. 'image/jpeg'
    file_size_kb: number;
    created_at: string;
  };
  Insert: {
    id?: string;
    workspace_id: string;
    user_id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size_kb: number;
    created_at?: string;
  };
  Update: never; // Los assets son inmutables; las actualizaciones son nuevas subidas.
  Relationships: [
    {
      foreignKeyName: "asset_library_workspace_id_fkey";
      columns: ["workspace_id"];
      isOneToOne: false;
      referencedRelation: "workspaces";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "asset_library_user_id_fkey";
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
 * 1. **Integridade Referencial**: ((Implementada)) A chave estrangeira `user_id` foi corrigida para referenciar `profiles` em vez de `users`, alinhando o tipo com o esquema de banco de dados canônico.
 *
 * @subsection Melhorias Futuras
 * 1. **Etiquetado de Ativos**: ((Vigente)) Adicionar um campo `tags: text[]` para que os usuários possam organizar e buscar seus arquivos por etiquetas.
 * 2. **Geração de Miniaturas (Thumbnails)**: ((Vigente)) Usar Supabase Edge Functions para gerar automaticamente miniaturas das imagens enviadas.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/asset_library.ts
