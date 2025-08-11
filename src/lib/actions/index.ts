// src/lib/actions/index.ts
/**
 * @file src/lib/actions/index.ts
 * @description Manifiesto de la API de Acciones del Servidor (Barrel File).
 *              Esta es la Única Fuente de Verdad para consumir Server Actions
 *              desde los componentes de cliente. Exporta todos los módulos de
 *              acciones, agrupados por namespaces de dominio para una máxima
 *              organización, claridad y prevención de colisiones de nombres.
 * @author L.I.A. Legacy
 * @version 1.0.0
 *
 * @example
 * // Antes (Importación granular):
 * // import { createSiteAction } from "@/lib/actions/sites.actions";
 *
 * // Ahora (Importación por namespace):
 * // import { sites as sitesActions } from "@/lib/actions";
 * // Uso: sitesActions.createSiteAction(...)
 */
import "server-only";

export * as admin from "./admin.actions";
export * as auth from "./auth.actions";
export * as builder from "./builder.actions";
export * as campaigns from "./campaigns.actions";
export * as invitations from "./invitations.actions";
export * as password from "./password.actions";
export * as profiles from "./profiles.actions";
export * as session from "./session.actions";
export * as sites from "./sites.actions";
export * as telemetry from "./telemetry.actions";
export * as workspaces from "./workspaces.actions";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Geração Automática**: ((Vigente)) Este arquivo é um candidato ideal para ser mantido por um script de build (`generate-actions-barrel.mjs`). Isso garante que ele permaneça sincronizado com a estrutura de arquivos sem intervenção manual.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Ponto de Entrada Único**: ((Implementada)) Este arquivo estabelece um ponto de entrada único e coeso para toda a camada de ações, melhorando a organização e a experiência do desenvolvedor.
 * 2. **Prevenção de Conflitos**: ((Implementada)) O uso de namespaces previne colisões de nomes entre funções de diferentes módulos (ex: `deleteAction` em `sites.actions` e `campaigns.actions`).
 *
 * =====================================================================
 */
// src/lib/actions/index.ts
