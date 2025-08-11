// tailwind.config.mjs
/**
 * @file tailwind.config.mjs
 * @description Configuración de Tailwind CSS. Consume la Única Fuente de Verdad
 *              desde `styles/theme.ts` para una consistencia garantizada.
 *              Los caminos de 'content' han sido actualizados para la estructura 'src/'.
 * @author Metashark (Refactorizado por L.I.A Legacy)
 * @version 6.0.0 (Single Source of Truth & Src Directory Alignment)
 */
import defaultTheme from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

import { themeConfig } from "./styles/theme.ts";

function toKebabCase(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}

function generateTailwindColors(theme) {
  const colors = {};
  for (const key in theme) {
    if (key.endsWith("Foreground")) continue;
    const foregroundKey = `${key}Foreground`;
    colors[toKebabCase(key)] = {
      DEFAULT: `hsl(var(--${toKebabCase(key)}))`,
      foreground: `hsl(var(--${toKebabCase(foregroundKey)}))`,
    };
  }
  return colors;
}

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        ...generateTailwindColors(themeConfig.dark),
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alinhamento Estrutural**: ((Implementada)) Os caminhos na propriedade `content` foram atualizados para apontar para o diretório `src/`, garantindo que o Tailwind CSS analise os arquivos corretos na nova estrutura do projeto.
 * 2. **Consumo de SSoT**: ((Implementada)) O aparato mantém a prática de elite de consumir `themeConfig` de `styles/theme.ts`, garantindo consistência visual.
 *
 * @subsection Melhorias Futuras
 * 1. **Plugin Personalizado**: ((Vigente)) Para projetos maiores, a lógica `generateTailwindColors` poderia ser extraída para um plugin de Tailwind local para uma configuração ainda mais limpa.
 *
 * =====================================================================
 */
// tailwind.config.mjs
