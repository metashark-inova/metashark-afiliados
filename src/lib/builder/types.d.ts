// src/lib/builder/types.d.ts
/**
 * @file src/lib/builder/types.d.ts
 * @description Define las interfaces y los esquemas de validación de Zod que
 *              gobiernan la estructura de una campaña, así como la definición
 *              declarativa de las propiedades editables de los bloques.
 *              Este archivo actúa como el "contrato de datos" oficial para
 *              todo el sistema del constructor.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { z } from "zod";

// --- Esquemas de Validación (Zod) ---

export const BlockStylesSchema = z.object({
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  paddingTop: z.string().optional(),
  paddingBottom: z.string().optional(),
  marginTop: z.string().optional(),
  marginBottom: z.string().optional(),
});

export const PageBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.any()), // Permite cualquier objeto como props por ahora
  styles: BlockStylesSchema,
});

export const CampaignThemeSchema = z.object({
  globalFont: z.string(),
  globalColors: z.record(z.string()),
});

export const CampaignConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  theme: CampaignThemeSchema,
  blocks: z.array(PageBlockSchema),
});

// --- Tipos de TypeScript (Inferidos y Explícitos) ---

export type BlockStyles = z.infer<typeof BlockStylesSchema>;
export type PageBlock<T = Record<string, any>> = {
  id: string;
  type: string;
  props: T;
  styles: BlockStyles;
};
export type CampaignTheme = z.infer<typeof CampaignThemeSchema>;
export type CampaignConfig = z.infer<typeof CampaignConfigSchema>;

export type BlockPropertyType =
  | "text"
  | "textarea"
  | "boolean"
  | "color"
  | "number"
  | "select"
  | "image";

export interface SelectOption {
  value: string;
  label: string;
}

export interface EditablePropertyDefinition {
  label: string;
  type: BlockPropertyType;
  defaultValue?: any;
  placeholder?: string;
  options?: SelectOption[];
}

export type BlockPropertiesSchema = Record<string, EditablePropertyDefinition>;

export interface BlockEditableDefinition {
  properties: BlockPropertiesSchema;
  styles: BlockPropertiesSchema;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Genérico Avançado em Esquemas Zod**: ((Vigente)) O esquema `PageBlockSchema` usa `z.record(z.any())` para as props. Poderia ser criada uma função genérica para gerar esquemas de bloco específicos para validar as props de cada tipo de bloco com seu próprio esquema Zod.
 * 2. **Versionamento de Esquema**: ((Vigente)) Adicionar um campo `version: z.number()` ao `PageBlockSchema` e `CampaignConfigSchema` para facilitar futuras migrações de dados se a estrutura do JSON mudar.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Contrato de Dados do Construtor**: ((Implementada)) Este aparato estabelece o contrato de dados completo e a SSoT para toda a funcionalidade do construtor de campanhas, resolvendo a dependência crítica de `builder.actions.ts`.
 * 2. **Estrutura Declarativa**: ((Implementada)) A definição de `BlockEditableDefinition` e tipos relacionados estabelece a base para um `SettingsPanel` puramente declarativo.
 *
 * =====================================================================
 */
// src/lib/builder/types.d.ts
