// src/lib/data/index.ts
/**
 * @file src/lib/data/index.ts
 * @description Manifiesto de la Capa de Datos (Barrel File). Esta es la Única Fuente
 *              de Verdad para acceder a los diferentes módulos de la capa de datos.
 *              Exporta cada módulo de datos (`sites`, `workspaces`, etc.) como un
 *              namespace, adhiriéndose al principio de "Configuración sobre Código"
 *              y proporcionando una API de consumo limpia y organizada para las
 *              Server Actions y los Server Components.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */

export * as admin from "./admin";
export * as campaigns from "./campaigns";
export * as invitations from "./invitations";
export * as modules from "./modules";
export * as notifications from "./notifications";
export * as permissions from "./permissions";
export * as sites from "./sites";
export * as workspaces from "./workspaces";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Geração Automática**: ((Vigente)) Este arquivo barril é um candidato ideal para ser gerado e mantido por um script de build (`generate-data-barrel.mjs`). Isso garantiria que ele esteja sempre sincronizado com o conteúdo do diretório `src/lib/data/`, prevenindo erros de importação por omissão manual.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Ponto de Entrada Único (Single Entry Point)**: ((Implementada)) A transcrição deste aparato estabelece um ponto de entrada único e coeso para toda a camada de dados, simplificando as importações em toda a aplicação e melhorando a organização do código.
 * 2. **API de Namespaces**: ((Implementada)) O uso de `export * as ...` cria uma API de consumo clara e baseada em namespaces (ex: `data.sites.getSiteById(...)`), o que melhora a legibilidade e evita colisões de nomes.
 *
 * =====================================================================
 */
// src/lib/data/index.ts
