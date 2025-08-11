// src/lib/types/database/tables/feature_flags.ts
/**
 * @file feature_flags.ts
 * @description Define el contrato de datos atómico para la tabla `feature_flags`.
 *              Permite la gestión dinámica de características sin necesidad de redespliegues.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
export type FeatureFlags = {
  Row: {
    id: number;
    name: string; // Ej: "enable_new_dashboard_ui"
    is_active: boolean;
    rollout_percentage: number; // Un valor de 0 a 100
    target_users: string[] | null; // Array de user_ids para un despliegue dirigido
    target_workspaces: string[] | null; // Array de workspace_ids
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: number;
    name: string;
    is_active?: boolean;
    rollout_percentage?: number;
    target_users?: string[] | null;
    target_workspaces?: string[] | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: number;
    name?: string;
    is_active?: boolean;
    rollout_percentage?: number;
    target_users?: string[] | null;
    target_workspaces?: string[] | null;
    created_at?: string;
    updated_at?: string;
  };
  Relationships: [];
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Lançamento Progressivo**: ((Implementada)) Este tipo de dados estabelece a base para A/B testing, lançamentos canary e gestão de funcionalidades em produção, uma capacidade de engenharia de elite.
 *
 * @subsection Melhorias Futuras
 * 1. **Integração com `middleware.ts`**: ((Vigente)) A lógica do middleware deve ser a principal consumidora desta tabela para reescrever URLs ou modificar respostas com base nos flags ativos para o usuário.
 * 2. **Tipado Automático de Flags**: ((Vigente)) Criar um script que leia os `name` desta tabela e gere um tipo de união de TypeScript (ex: `type AvailableFlags = "enable_new_dashboard" | ...`) para um uso seguro dos flags no código.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/feature_flags.ts
