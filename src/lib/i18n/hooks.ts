// src/lib/i18n/hooks.ts
/**
 * @file src/lib/i18n/hooks.ts
 * @description Aparato de Hooks de Internacionalización. Proporciona una interfaz
 *              de consumo tipada para las traducciones, incluyendo soporte completo
 *              para texto enriquecido (`t.rich`). Este hook es la forma canónica
 *              para que los componentes de cliente accedan a las cadenas de texto.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { type ReactNode } from "react";
import { type RichTranslationValues, useTranslations } from "next-intl";

import { type Messages, type NestedKeyOf } from "./types";

/**
 * @private
 * @typedef TypedTranslationFunction
 * @description Define la firma de la función de traducción `t` con claves tipo-seguras.
 */
type TypedTranslationFunction<T> = (
  key: NestedKeyOf<T>,
  values?: RichTranslationValues
) => string;

/**
 * @private
 * @typedef TypedRichTranslationFunction
 * @description Define la firma de la función de traducción `t.rich` con claves tipo-seguras.
 */
type TypedRichTranslationFunction<T> = (
  key: NestedKeyOf<T>,
  values?: RichTranslationValues
) => ReactNode;

/**
 * @public
 * @function useTypedTranslations
 * @description Un wrapper tipado alrededor de `useTranslations` de `next-intl`.
 *              Proporciona seguridad de tipos en tiempo de compilación para las claves
 *              de traducción, previniendo errores de tipeo y asegurando que solo
 *              se puedan usar claves válidas definidas en el `i18nSchema`.
 * @template T - El namespace de los mensajes a utilizar.
 * @param {T} namespace - El namespace (archivo de mensajes) del cual obtener las traducciones.
 * @returns {TypedTranslationFunction<Messages[T]> & { rich: TypedRichTranslationFunction<Messages[T]> }}
 *          Una función `t` y su método `rich` con seguridad de tipos para las claves.
 */
export const useTypedTranslations = <T extends keyof Messages>(
  namespace: T
) => {
  const t = useTranslations(namespace as any);

  return t as TypedTranslationFunction<Messages[T]> & {
    rich: TypedRichTranslationFunction<Messages[T]>;
  };
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Suporte para `t.raw`**: ((Vigente)) A assinatura de tipo poderia ser estendida para incluir também o método `t.raw` da `next-intl`, que retorna o valor da tradução sem processar nenhum componente ICU, para casos de uso avançados.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Segurança de Tipos em i18n**: ((Implementada)) Este hook é a peça central da nossa estratégia de internacionalização tipo-segura. Sua reconstrução resolve os erros `TS2307` em todos os componentes que o consomem.
 * 2. **Suporte para Texto Enriquecido**: ((Implementada)) O tipo de retorno inclui suporte para `t.rich`, permitindo a renderização segura de traduções que contêm formatação HTML (como `<strong>`).
 * 3. **Dependência de `types.ts`**: ((Implementada)) Este aparato depende de `lib/i18n/types.ts`, que será o próximo a ser transcrito para resolver o erro de importação.
 *
 * =====================================================================
 */
// src/lib/i18n/hooks.ts
