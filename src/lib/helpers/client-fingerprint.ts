// src/lib/helpers/client-fingerprint.ts
/**
 * @file lib/helpers/client-fingerprint.ts
 * @description Genera una huella digital única del navegador del cliente
 *              utilizando la librería `@fingerprintjs/fingerprintjs`.
 *              Este helper se encarga de la carga diferida y la gestión
 *              de errores para la generación de la huella.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

import { logger } from "@/lib/logging";

let fpPromise: ReturnType<typeof FingerprintJS.load> | null = null;

/**
 * @async
 * @function getClientFingerprint
 * @description Obtiene la huella digital (visitorId) del navegador del cliente.
 *              Si FingerprintJS aún no ha sido cargado, lo carga de forma asíncrona.
 * @returns {Promise<string | null>} Una promesa que resuelve con la huella digital
 *                                    del cliente (string) o `null` si ocurre un error
 *                                    durante la carga o la generación de la huella.
 */
export async function getClientFingerprint(): Promise<string | null> {
  try {
    if (!fpPromise) {
      fpPromise = FingerprintJS.load();
    }
    const fp = await fpPromise;
    const result = await fp.get();
    logger.trace("Huella digital del cliente generada con éxito.", {
      visitorId: result.visitorId,
    });
    return result.visitorId;
  } catch (error) {
    logger.error("Error al generar la huella digital del cliente:", error);
    return null;
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Helper de Telemetria**: ((Implementada)) Este componente fornece uma capacidade de telemetria chave, permitindo a identificação de visitantes únicos para análise e segurança.
 *
 * @subsection Melhorias Futuras
 * 1. **Carga Diferida Condicional Avançada**: ((Vigente)) Para uma otimização extrema do LCP, o `FingerprintJS.load()` poderia ser movido para dentro de um `useEffect` com um `setTimeout`, para que o script só seja carregado quando o navegador estiver inativo.
 * 2. **Contexto de Confiança do VisitorId**: ((Vigente)) A biblioteca fornece uma pontuação de `confidence` com o `visitorId`. Este valor poderia ser incluído no log para avaliar a confiabilidade da "fingerprint", útil para detecção avançada de fraudes.
 *
 * =====================================================================
 */
// src/lib/helpers/client-fingerprint.ts
