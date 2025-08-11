// src/app/layout.tsx
/**
 * @file app/layout.tsx
 * @description Layout Raíz Mínimo y Global.
 *              Su única responsabilidad es definir la estructura HTML base
 *              (`<html>` y `<body>`), satisfaciendo el requisito fundamental de
 *              Next.js y estableciendo un atributo `lang` de fallback para
 *              páginas no internacionalizadas, cumpliendo con los estándares de
 *              accesibilidad.
 * @author L.I.A. Legacy
 * @version 2.0.0
 */
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Migração de Layout Fundamental**: ((Implementada)) Este aparato estabelece a estrutura HTML raiz para toda a aplicação, um passo essencial antes de introduzir layouts mais complexos.
 * 2. **Cumprimento de Acessibilidade (WCAG)**: ((Implementada)) O atributo `lang="en"` garante que todas as páginas, incluindo as de erro não internacionalizadas, tenham um idioma definido, cumprindo os padrões de acessibilidade.
 *
 * @subsection Melhorias Futuras
 * 1. **Supressão de Hydration Warning**: ((Vigente)) Se as extensões do navegador injetarem elementos no `<html>`, pode ser necessário adicionar `suppressHydrationWarning={true}` à tag `<html>` para uma experiência de desenvolvimento mais limpa, conforme recomendado pela documentação do Next.js.
 *
 * =====================================================================
 */
// src/app/layout.tsx
