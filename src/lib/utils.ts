// src/lib/utils.ts
/**
 * @file src/lib/utils.ts
 * @description Colección de funciones de utilidad de propósito general. Este aparato
 *              proporciona herramientas reutilizables y atómicas que son consumidas
 *              en toda la aplicación, desde componentes de UI hasta manejadores
 *              de middleware.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @public
 * @constant protocol
 * @description Determina el protocolo de URL (`http` o `https`) basado en el entorno de Node.js.
 */
export const protocol =
  process.env.NODE_ENV === "production" ? "https" : "http";

/**
 * @public
 * @constant rootDomain
 * @description Define el dominio raíz de la aplicación a partir de variables de entorno,
 *              con un fallback a `localhost:3000` para desarrollo local.
 */
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

/**
 * @public
 * @function cn
 * @description Combina clases de Tailwind CSS de forma inteligente. Permite la
 *              aplicación condicional de clases y resuelve automáticamente
 *              conflictos de clases de Tailwind (ej. `p-2` y `p-4` se resuelve a `p-4`).
 * @param {...ClassValue[]} inputs - Una secuencia de clases a combinar.
 * @returns {string} La cadena de clases finales, optimizada y sin conflictos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @public
 * @function debounce
 * @description Crea una versión "debounced" de una función. La función debounced
 *              solo se ejecutará después de que haya pasado un tiempo determinado
 *              sin ser llamada. Esencial para optimizar eventos frecuentes como la
 *              escritura en un campo de búsqueda.
 * @template F - El tipo de la función a debouncing.
 * @param {F} func - La función a la que aplicar el debounce.
 * @param {number} waitFor - El tiempo de espera en milisegundos.
 * @returns {F} Una nueva función debounced que devuelve una promesa.
 */
export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number
): F {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    })) as F;
}

/**
 * @public
 * @function isPrivateIpAddress
 * @description Verifica si una dirección IP dada es una dirección IP privada (LAN).
 *              Esto es útil para evitar realizar lookups de GeoIP en IPs internas
 *              que no son consultables por APIs públicas.
 * @param {string} ip - La dirección IP a verificar.
 * @returns {boolean} `true` si la IP es privada, `false` en caso contrario.
 */
export function isPrivateIpAddress(ip: string): boolean {
  const privateIpRegex =
    /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3})|(127\.0\.0\.1)$/;
  return privateIpRegex.test(ip);
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Validação de URL Canônica**: ((Vigente)) Adicionar uma função para validar e limpar URLs, garantindo que sejam sempre canônicas e seguras (ex: removendo parâmetros de rastreamento).
 * 2. **Formatação Localizada**: ((Vigente)) Implementar helpers para formatar números, moedas ou datas de forma localizada, utilizando a API `Intl`.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fundação de Utilitários**: ((Implementada)) A transcrição deste arquivo fornece a função `cn`, uma dependência crítica para todos os componentes de UI, e `debounce`, essencial para hooks de validação em tempo real.
 * 2. **Helper de Segurança de Rede**: ((Implementada)) A função `isPrivateIpAddress` é uma peça importante para a otimização e segurança do serviço de GeoIP no middleware.
 *
 * =====================================================================
 */
// src/lib/utils.ts
