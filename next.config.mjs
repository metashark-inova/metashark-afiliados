// next.config.mjs
/**
 * @file Manifiesto de configuración de Next.js
 * @description Configuración canónica para el proyecto, utilizando la extensión
 *              .mjs para compatibilidad con el runtime de Next.js y JSDoc para
 *              seguridad de tipos.
 * @author L.I.A Legacy
 * @version 1.0.0 (Runtime Compatibility)
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Opciones de configuración de Next.js irán aquí */
};

export default nextConfig;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Compatibilidade com o Runtime**: ((Implementada)) O arquivo foi renomeado para `next.config.mjs` e seu conteúdo foi ajustado para JavaScript puro com anotações JSDoc. Isso resolve o erro `Configuring Next.js via 'next.config.ts' is not supported` e restaura a funcionalidade do servidor de desenvolvimento.
 *
 * @subsection Melhorias Futuras
 * 1. **Integração de `next-intl`**: ((Vigente)) O conteúdo deste arquivo precisará ser expandido para incluir o plugin `next-intl` quando começarmos a migrar as páginas, conforme visto no snapshot original.
 * 2. **Integração de Sentry**: ((Vigente)) A configuração do Sentry também será adicionada a este arquivo em uma fase posterior para garantir a observabilidade.
 *
 * =====================================================================
 */
// next.config.mjs
