// src/lib/supabase/auth-theme.ts
/**
 * @file src/lib/supabase/auth-theme.ts
 * @description Manifiesto de Estilo Declarativo. Esta es la Única Fuente de Verdad (SSoT)
 *              para la apariencia del componente de UI de autenticación de Supabase
 *              (`@supabase/auth-ui-react`). Este aparato garantiza que el formulario
 *              de login/signup se alinee perfectamente con la identidad visual de la
 *              marca, consumiendo las variables CSS canónicas del sistema de diseño.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type Theme } from "@supabase/auth-ui-shared";

/**
 * @public
 * @constant brandTheme
 * @description Un objeto de tema compatible con `@supabase/auth-ui-react` que mapea
 *              los elementos de la UI del formulario a las variables CSS del sistema
 *              de diseño (`--primary`, `--foreground`, etc.). Esto desacopla el estilo
 *              del componente de la implementación, adhiriéndose al principio de
 *              "Configuración sobre Código".
 */
export const brandTheme: Theme = {
  default: {
    colors: {
      brand: "hsl(var(--primary))",
      brandAccent: "hsl(var(--primary) / 0.8)",
      brandButtonText: "hsl(var(--primary-foreground))",
      defaultButtonBackground: "hsl(var(--card))",
      defaultButtonBackgroundHover: "hsl(var(--muted))",
      defaultButtonBorder: "hsl(var(--border))",
      defaultButtonText: "hsl(var(--foreground))",
      dividerBackground: "hsl(var(--border))",
      inputBackground: "hsl(var(--input))",
      inputBorder: "hsl(var(--border))",
      inputBorderHover: "hsl(var(--ring))",
      inputBorderFocus: "hsl(var(--ring))",
      inputText: "hsl(var(--foreground))",
      inputLabelText: "hsl(var(--muted-foreground))",
      inputPlaceholder: "hsl(var(--muted-foreground) / 0.6)",
      messageText: "hsl(var(--foreground))",
      messageTextDanger: "hsl(var(--destructive))",
      anchorTextColor: "hsl(var(--muted-foreground))",
      anchorTextHoverColor: "hsl(var(--primary))",
    },
    space: {
      spaceSmall: "4px",
      spaceMedium: "8px",
      spaceLarge: "16px",
      labelBottomMargin: "8px",
      anchorBottomMargin: "4px",
      emailInputSpacing: "8px",
      socialAuthSpacing: "8px",
      buttonPadding: "10px 15px",
      inputPadding: "10px 15px",
    },
    fontSizes: {
      baseBodySize: "14px",
      baseInputSize: "14px",
      baseLabelSize: "14px",
      baseButtonSize: "14px",
    },
    fonts: {
      bodyFontFamily: `var(--font-geist-sans), sans-serif`,
      buttonFontFamily: `var(--font-geist-sans), sans-serif`,
      inputFontFamily: `var(--font-geist-sans), sans-serif`,
      labelFontFamily: `var(--font-geist-sans), sans-serif`,
    },
    radii: {
      borderRadiusButton: "var(--radius)",
      buttonBorderRadius: "var(--radius)",
      inputBorderRadius: "var(--radius)",
    },
  },
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Tema Claro Dinâmico**: ((Vigente)) Desenvolver uma lógica que detecte o tema ativo da aplicação (usando `next-themes`) e passe uma versão do `brandTheme` adaptada para o tema claro, fazendo com que o formulário do Supabase mude de aparência junto com o restante da aplicação.
 * 2. **Variantes de Tema**: ((Vigente)) O arquivo poderia ser expandido para exportar múltiplos temas (ex: `minimalTheme`, `corporateTheme`) que poderiam ser aplicados dinamicamente ao componente de autenticação dependendo do contexto.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Coesão da Identidade Visual**: ((Implementada)) A transcrição deste aparato garante que a experiência de autenticação do usuário seja visualmente coesa com o resto da plataforma, um detalhe crucial para a confiança e o profissionalismo da marca.
 * 2. **Manutenibilidade do Estilo**: ((Implementada)) Centralizar a configuração de estilo do formulário de autenticação neste manifesto declarativo torna futuras modificações na marca mais fáceis e menos propensas a erros.
 *
 * =====================================================================
 */
// src/lib/supabase/auth-theme.ts
