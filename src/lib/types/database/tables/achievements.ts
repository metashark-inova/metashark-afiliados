// src/lib/types/database/tables/achievements.ts
/**
 * @file achievements.ts
 * @description Define el contrato de datos atómico para la tabla `achievements`.
 *              Almacena la definición de todos los logros o insignias que los usuarios pueden ganar.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
import { type Json } from "../_shared";
import { type Enums } from "../enums";

export type Achievements = {
  Row: {
    id: number;
    name: string;
    description: string;
    icon_url: string | null;
    type: Enums["achievement_type"];
    criteria: Json; // Ej: { "metric": "campaigns_created", "value": 10 }
    created_at: string;
  };
  Insert: {
    id?: number;
    name: string;
    description: string;
    icon_url?: string | null;
    type: Enums["achievement_type"];
    criteria: Json;
    created_at?: string;
  };
  Update: {
    id?: number;
    name?: string;
    description?: string;
    icon_url?: string | null;
    type?: Enums["achievement_type"];
    criteria?: Json;
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
 * 1. **Contrato de Gamificação**: ((Implementada)) Este tipo de dados estabelece a base para o sistema de gamificação da plataforma.
 *
 * @subsection Melhorias Futuras
 * 1. **Sistema de Pontos de Experiência (XP)**: ((Vigente)) Adicionar um campo `xp_reward: number` a esta tabela para que cada conquista conceda pontos.
 * 2. **Conquistas Secretas**: ((Vigente)) Incluir um campo booleano `is_secret` para ocultar certas conquistas até que sejam desbloqueadas.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/achievements.ts
