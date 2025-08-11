// scripts/generate-theme-css.mjs
/**
 * @file generate-theme-css.mjs
 * @description Script para generar el archivo de variables CSS. Ha sido
 *              actualizado para apuntar al directorio 'src/styles/' canónico.
 * @author L.I.A Legacy
 * @version 3.0.0 (Canonical Src Path Alignment)
 */
import fs from "fs/promises";
import path from "path";

import { themeConfig } from "../src/styles/theme.ts";

const OUTPUT_PATH = path.join(
  process.cwd(),
  "src",
  "app",
  "theme-variables.css"
);

function toKebabCase(str) {
  return str.replace(/([a-z0-g]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}

async function generateCss() {
  let cssContent = `/*\n * Este archivo es generado automáticamente.\n * NO LO EDITE MANUALMENTE.\n * Fuente de verdad: styles/theme.ts\n */\n\n`;

  // Tema Oscuro (por defecto)
  cssContent += ":root {\n";
  for (const [key, value] of Object.entries(themeConfig.dark)) {
    cssContent += `  --${toKebabCase(key)}: ${value};\n`;
  }
  cssContent += `  --radius: ${themeConfig.radius};\n`;
  cssContent += "}\n\n";

  // Tema Claro
  cssContent += ".light {\n";
  for (const [key, value] of Object.entries(themeConfig.light)) {
    cssContent += `  --${toKebabCase(key)}: ${value};\n`;
  }
  cssContent += "}\n";

  await fs.writeFile(OUTPUT_PATH, cssContent);
  console.log(`✅ Variables de tema CSS generadas en: ${OUTPUT_PATH}`);
}

generateCss();

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alinhamento de Caminho de Build**: ((Implementada)) O caminho de importação para `theme.ts` foi corrigido para `../src/styles/theme.ts`, resolvendo o erro `ERR_MODULE_NOT_FOUND` e alinhando o script de build com a estrutura de diretórios do projeto.
 *
 * @subsection Melhorias Futuras
 * 1. **Uso de `tsconfig-paths`**: ((Vigente)) Para projetos com scripts complexos, poderíamos usar `tsx --tsconfig-paths` para permitir que os scripts de build utilizem os mesmos aliases `@/*` da aplicação, eliminando a necessidade de caminhos relativos.
 *
 * =====================================================================
 */
// scripts/generate-theme-css.mjs
