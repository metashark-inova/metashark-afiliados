// src/lib/builder/block-editor-definitions.ts
/**
 * @file src/lib/builder/block-editor-definitions.ts
 * @description Manifiesto central que define declarativamente las propiedades
 *              editables y los estilos de cada tipo de bloque en el constructor.
 *              Esta es la Única Fuente de Verdad para la configuración de la UI
 *              del `SettingsPanel`, adhiriéndose al principio de "Configuración sobre Código".
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type BlockEditableDefinition } from "./types.d";

/**
 * @public
 * @constant blockEditorDefinitions
 * @description Un registro que mapea cada `block.type` (ej. "Header1", "Hero1")
 *              a su definición de propiedades y estilos editables. Cada entrada
 *              especifica la etiqueta para la UI, el tipo de control y valores
 *              por defecto o placeholders.
 */
export const blockEditorDefinitions: Record<string, BlockEditableDefinition> = {
  Header1: {
    properties: {
      logoText: {
        label: "Texto del Logo",
        type: "text",
        defaultValue: "Mi Empresa",
        placeholder: "Introduce el texto del logo",
      },
      ctaText: {
        label: "Texto del Botón CTA",
        type: "text",
        defaultValue: "Comprar Ahora",
        placeholder: "Introduce el texto del botón",
      },
    },
    styles: {
      backgroundColor: {
        label: "Color de Fondo",
        type: "color",
        defaultValue: "#333333",
      },
      textColor: {
        label: "Color del Texto",
        type: "color",
        defaultValue: "#FFFFFF",
      },
      paddingTop: {
        label: "Padding Superior (px)",
        type: "text",
        defaultValue: "16px",
      },
      paddingBottom: {
        label: "Padding Inferior (px)",
        type: "text",
        defaultValue: "16px",
      },
    },
  },

  Hero1: {
    properties: {
      title: {
        label: "Título Principal",
        type: "textarea",
        defaultValue: "Título Impactante",
        placeholder: "Introduce el título principal de tu Hero",
      },
      subtitle: {
        label: "Subtítulo",
        type: "textarea",
        defaultValue: "Un subtítulo convincente para tu oferta.",
        placeholder: "Introduce el subtítulo",
      },
    },
    styles: {
      backgroundColor: {
        label: "Color de Fondo",
        type: "color",
        defaultValue: "#F3F4F6",
      },
      textColor: {
        label: "Color del Texto",
        type: "color",
        defaultValue: "#333333",
      },
      paddingTop: {
        label: "Padding Superior (px)",
        type: "text",
        defaultValue: "80px",
      },
      paddingBottom: {
        label: "Padding Inferior (px)",
        type: "text",
        defaultValue: "80px",
      },
    },
  },
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Validação Zod para Definições**: ((Vigente)) Definir esquemas Zod para `EditablePropertyDefinition` e `BlockEditableDefinition` e validar `blockEditorDefinitions` em tempo de desenvolvimento para garantir a consistência do manifesto.
 * 2. **Tipos de Controles Avançados**: ((Vigente)) Expandir `BlockPropertyType` para incluir tipos como `number` (com min/max/step), `select` (com opções), ou `image` (com seletor de assets da `asset_library`).
 *
 * @subsection Melhorias Adicionadas
 * 1. **SSoT para Editor**: ((Implementada)) Este manifesto atua como a fonte única da verdade para a configuração da UI de edição, melhorando drasticamente a manutenibilidade e a escalabilidade do construtor. Adicionar um novo campo editável a um bloco agora requer apenas uma modificação neste arquivo.
 * 2. **Arquitetura Declarativa**: ((Implementada)) Adere ao princípio de "Configuração sobre Código", desacoplando a definição da UI da sua implementação no `SettingsPanel`.
 *
 * =====================================================================
 */
// src/lib/builder/block-editor-definitions.ts
