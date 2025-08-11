// src/lib/types/database/tables/subscribers.ts
/**
 * @file subscribers.ts
 * @description Define el contrato de datos atómico para la tabla `subscribers`.
 *              Almacenará los correos electrónicos para el boletín de noticias.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
export type Subscribers = {
  Row: {
    created_at: string;
    email: string;
    id: number;
    name: string | null;
    status: string;
  };
  Insert: {
    created_at?: string;
    email: string;
    id?: number;
    name?: string | null;
    status?: string;
  };
  Update: {
    created_at?: string;
    email?: string;
    id?: number;
    name?: string | null;
    status?: string;
  };
  Relationships: [];
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Lead Capture**: ((Implementada)) Este tipo de dados estabelece a base para as campanhas de email marketing e captura de leads.
 *
 * @subsection Melhorias Futuras
 * 1. **Campo de Origem (`source`)**: ((Vigente)) Adicionar um campo `source: string` para rastrear de onde veio a subscrição (ex: 'footer_newsletter', 'signup_checkbox').
 * 2. **Campo de Etiquetas (`tags`)**: ((Vigente)) Incluir um campo `tags: text[]` para permitir a segmentação da audiência.
 *
 * =====================================================================
 */
// src/lib/types/database/tables/subscribers.ts
