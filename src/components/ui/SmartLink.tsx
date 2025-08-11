// src/components/ui/SmartLink.tsx
/**
 * @file src/components/ui/SmartLink.tsx
 * @description Componente de enlace inteligente y atómico. Renderiza un componente
 *              `<Link>` de `next-intl` para rutas internas o una etiqueta `<a>`
 *              estándar para enlaces externos (`http`, `https`, `mailto`, `tel`) y de
 *              anclaje (`#`). Su prop `href` es agnóstica para máxima flexibilidad y para
 *              evitar conflictos con la inferencia de tipos de `next-intl`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";

import { Link } from "@/lib/navigation";

/**
 * @public
 * @interface NavLinkItem
 * @description Define el contrato de props para un item de navegación.
 */
export interface NavLinkItem {
  /**
   * @property {any} href - La destinación del enlace. Puede ser un string para
   *              rutas estáticas, anclajes y URLs externas, o un objeto para rutas
   *              dinámicas de `next-intl`. Se utiliza `any` de forma deliberada para
   *              ser compatible con el tipo complejo y genérico inferido por el
   *              componente `Link` de `next-intl`.
   */
  href: any;
  /**
   * @property {string} label - El texto visible del enlace.
   */
  label: string;
  /**
   * @property {string} [className] - Clases CSS opcionales para aplicar al enlace.
   */
  className?: string;
}

/**
 * @public
 * @component SmartLink
 * @description Renderiza el tipo de enlace correcto (`<a>` o `next-intl <Link>`)
 *              basándose en el formato del `href` proporcionado.
 * @param {NavLinkItem} props - Las propiedades del enlace.
 * @returns {React.ReactElement} El componente de enlace renderizado.
 */
export const SmartLink: React.FC<NavLinkItem> = ({
  href,
  label,
  className,
  ...props
}) => {
  const finalClassName =
    className || "text-muted-foreground transition-colors hover:text-primary";

  const hrefString = typeof href === "string" ? href : "";
  const isExternalOrAnchor =
    hrefString.startsWith("#") ||
    hrefString.startsWith("http") ||
    hrefString.startsWith("mailto:") ||
    hrefString.startsWith("tel:");

  if (isExternalOrAnchor) {
    const isExternal = hrefString.startsWith("http");
    return (
      <a
        href={hrefString}
        className={finalClassName}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {label}
      </a>
    );
  }

  // Para todas las demás rutas, se asume que son internas y se utiliza el Link de next-intl.
  return (
    <Link href={href} className={finalClassName} {...props}>
      {label}
    </Link>
  );
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Ícones Automáticos**: ((Vigente)) O componente poderia ser aprimorado para renderizar automaticamente um ícone de "link externo" (ex: `<ExternalLink />` de `lucide-react`) ao lado do `label` se `isExternal` for verdadeiro, melhorando a UX.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Navegação Universal**: ((Implementada)) Este aparato fornece uma solução robusta e centralizada para a renderização de todos os tipos de links, uma dependência crítica para os componentes `LandingHeader` e `LandingFooter`.
 * 2. **Lógica de Roteamento Inteligente**: ((Implementada)) A lógica condicional que diferencia entre links internos e externos/de âncora é crucial para que a navegação internacionalizada de `next-intl` coexista com links padrão.
 * 3. **Contrato de Tipo Flexível e Documentado**: ((Implementada)) O uso deliberado de `any` para a prop `href` é documentado para explicar a necessidade de compatibilidade com os tipos complexos de `next-intl`.
 *
 * =====================================================================
 */
// src/components/ui/SmartLink.tsx
