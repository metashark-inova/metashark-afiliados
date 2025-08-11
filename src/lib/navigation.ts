// src/lib/navigation.ts
/**
 * @file src/lib/navigation.ts
 * @description Manifiesto de Enrutamiento y Navegación de Élite.
 *              Este aparato es la Única Fuente de Verdad para la configuración
 *              de internacionalización (i18n) y la definición de todas las rutas
 *              de la aplicación. Centraliza la configuración de `next-intl` para
 *              proporcionar componentes y hooks de navegación tipo-seguros y
 *              conscientes del locale.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */

import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from "next-intl/navigation";

/**
 * @public
 * @constant locales
 * @description Define los idiomas (locales) soportados por la aplicación.
 *              El `as const` es crucial para que TypeScript infiera un tipo
 *              de unión literal en lugar de `string[]`, habilitando la
 *              seguridad de tipos en toda la librería.
 */
export const locales = ["en-US", "es-ES", "pt-BR"] as const;
export type AppLocale = (typeof locales)[number];

/**
 * @public
 * @constant localePrefix
 * @description Define la estrategia para el prefijo de locale en la URL.
 *              `as-needed` significa que el prefijo no se usará para el idioma por defecto.
 */
export const localePrefix = "as-needed";

/**
 * @public
 * @constant pathnames
 * @description Mapeo de rutas canónicas a sus posibles traducciones. En este
 *              proyecto, las rutas no se traducen, por lo que el mapeo es 1:1.
 *              Este objeto es consumido por `createLocalizedPathnamesNavigation`
 *              para construir los componentes de navegación.
 */
export const pathnames = {
  "/": "/",
  "/about": "/about",
  "/admin": "/admin",
  "/auth/login": "/auth/login",
  "/auth/signup": "/auth/signup",
  "/blog": "/blog",
  "/builder/[campaignId]": "/builder/[campaignId]",
  "/choose-language": "/choose-language",
  "/contact": "/contact",
  "/cookies": "/cookies",
  "/dashboard": "/dashboard",
  "/dashboard/settings": "/dashboard/settings",
  "/dashboard/sites": "/dashboard/sites",
  "/dashboard/sites/[siteId]/campaigns": "/dashboard/sites/[siteId]/campaigns",
  "/dev-console": "/dev-console",
  "/dev-console/campaigns": "/dev-console/campaigns",
  "/dev-console/logs": "/dev-console/logs",
  "/dev-console/sentry-test": "/dev-console/sentry-test",
  "/dev-console/telemetry": "/dev-console/telemetry",
  "/dev-console/users": "/dev-console/users",
  "/disclaimer": "/disclaimer",
  "/forgot-password": "/forgot-password",
  "/gallery/bridgepages": "/gallery/bridgepages",
  "/gallery/landings": "/gallery/landings",
  "/legal": "/legal",
  "/lia-chat": "/lia-chat",
  "/privacy": "/privacy",
  "/reset-password": "/reset-password",
  "/support": "/support",
  "/terms": "/terms",
  "/unauthorized": "/unauthorized",
  "/welcome": "/welcome",
  "/wiki": "/wiki",
} satisfies Pathnames<typeof locales>;

/**
 * @public
 * @exports Link, redirect, usePathname, useRouter
 * @description Exportaciones generadas por `next-intl` que están "envueltas" para
 *              ser conscientes del locale actual. Estos deben ser usados en toda la
 *              aplicación en lugar de sus contrapartes de `next/navigation`.
 */
export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Geração Automática**: ((Vigente)) O objeto `pathnames` é um candidato ideal para ser gerado automaticamente por um script (`generate-routes-manifest.mjs`) que escaneie o diretório `src/app/[locale]` para evitar desincronizações manuais.
 * 2. **Tradução de Rotas**: ((Vigente)) Para uma estratégia de SEO internacional avançada, o objeto `pathnames` pode ser expandido para mapear rotas a suas traduções, por exemplo: `'/about': { en: '/about', es: '/sobre-nos' }`.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolução de Dependência de Renderização**: ((Implementada)) A transcrição deste arquivo é o passo mais crítico para permitir que a aplicação seja renderizada, pois é uma dependência direta do `LocaleLayout`.
 * 2. **SSoT de Navegação**: ((Implementada)) Este aparato centraliza toda a configuração de rotas e internacionalização, aderindo aos princípios de DRY e Configuração sobre Código.
 *
 * =====================================================================
 */
// src/lib/navigation.ts
