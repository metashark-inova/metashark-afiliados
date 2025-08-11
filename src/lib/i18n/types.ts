// src/lib/i18n/types.ts
/**
 * @file src/lib/i18n/types.ts
 * @description Aparato de Contratos de Datos para la Internacionalización.
 *              Este aparato deriva sus tipos de la Única Fuente de Verdad,
 *              el `i18nSchema` de Zod, garantizando una sincronización
 *              perfecta entre el contrato de datos y los tipos utilizados en el
 *              código, lo que habilita el autocompletado y la seguridad de tipos
 *              en el hook `useTypedTranslations`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */

import { type z } from "zod";

import { type i18nSchema } from "@/lib/validators/i18n.schema";

/**
 * @public
 * @typedef Messages
 * @description Representa la estructura completa y anidada de un archivo de
 *              mensajes de traducción. Este tipo es inferido directamente del
 *              `i18nSchema`, garantizando que el contrato de tipos
 *              esté siempre sincronizado con la SSoT.
 */
export type Messages = z.infer<typeof i18nSchema>;

/**
 * @public
 * @typedef NestedKeyOf
 * @description Un tipo de utilidad avanzado de TypeScript que genera una unión de todas las
 *              rutas de claves anidadas de un objeto como cadenas de texto con
 *              notación de punto (ej. "DashboardSidebar.userMenu_signOut").
 *              Es el motor que proporciona el autocompletado y la seguridad de tipos
 *              en el hook de traducción.
 * @template T - El tipo del objeto a inspeccionar.
 */
export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : never;
    }[keyof T]
  : "";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Geração de Tipos `NestedKeyOf` por Namespace**: ((Vigente)) Para uma segurança de tipos ainda mais granular, poderia ser gerado um tipo de chave aninhada para cada namespace individual (ex: `LoginPageKeys`, `DashboardSidebarKeys`), embora a abordagem atual já forneça uma segurança robusta.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Derivação da SSoT (Fonte Única da Verdade)**: ((Implementada)) O tipo `Messages` é derivado diretamente do `i18nSchema` de Zod, eliminando a redundância e garantindo que o código e o contrato de dados estejam sempre perfeitamente sincronizados.
 * 2. **Resolução de Dependência Crítica**: ((Implementada)) A transcrição deste aparato resolve a dependência final de `lib/i18n/hooks.ts`, tornando o módulo de internacionalização do cliente totalmente funcional e resolvendo a cascata de erros de compilação.
 *
 * =====================================================================
 */
// src/lib/i18n/types.ts
