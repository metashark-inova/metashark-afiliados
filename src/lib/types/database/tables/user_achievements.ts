// src/lib/types/database/tables/user_achievements.ts
/**
 * @file user_achievements.ts
 * @description Define el contrato de datos atómico para la tabla de unión `user_achievements`.
 *              Registra qué logros ha desbloqueado cada usuario.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
export type UserAchievements = {
  Row: {
    id: number;
    user_id: string;
    achievement_id: number;
    achieved_at: string;
  };
  Insert: {
    id?: number;
    user_id: string;
    achievement_id: number;
    achieved_at?: string;
  };
  Update: never; // Inmutable: un logro, una vez ganado, no se modifica.
  Relationships: [
    {
      foreignKeyName: "user_achievements_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "user_achievements_achievement_id_fkey";
      columns: ["achievement_id"];
      isOneToOne: false;
      referencedRelation: "achievements";
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
 * 1. **Contrato de Gamificação (Junção)**: ((Implementada)) Este tipo de dados completa a estrutura do sistema de gamificação, registrando o progresso do usuário.
 *
 * @subsection Melhorias Futuras
 * 1. **Notificação ao Desbloquear**: ((Vigente)) Configurar um gatilho no banco de dados que, ao inserir uma linha nesta tabela, crie uma entrada na tabela `notifications` para informar ao usuário em tempo real.
 * 2. **Compartilhamento em Redes Sociais**: ((Vigente)) Adicionar um campo `share_token: string | null` para gerar uma URL pública única que o usuário possa compartilhar para mostrar sua conquista.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/user_achievements.ts
