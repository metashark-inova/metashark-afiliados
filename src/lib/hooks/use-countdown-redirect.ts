// src/lib/hooks/use-countdown-redirect.ts
/**
 * @file src/lib/hooks/use-countdown-redirect.ts
 * @description Hook de React atómico y reutilizable para gestionar una cuenta regresiva
 *              que ejecuta un callback al finalizar. Ideal para redirecciones automáticas
 *              o para habilitar acciones después de un tiempo de espera.
 * @author L.I.A. Legacy
 * @version 1.0.0
 *
 * @param {number} initialCount - El número de segundos inicial desde el que empezar la cuenta regresiva.
 * @param {() => void} onCountdownEnd - La función de callback a ejecutar cuando el contador llega a cero.
 * @returns {{ countdown: number }} El valor actual del contador en segundos.
 */
"use client";

import { useEffect, useState } from "react";

import { logger } from "@/lib/logging";

export function useCountdownRedirect(
  initialCount: number,
  onCountdownEnd: () => void
): { countdown: number } {
  const [countdown, setCountdown] = useState(initialCount);

  useEffect(() => {
    // Si el contador llega a cero o menos, ejecutar el callback y detener.
    if (countdown <= 0) {
      onCountdownEnd();
      return;
    }

    // Configurar el temporizador para decrementar el contador cada segundo.
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Función de limpieza: se ejecuta cuando el componente se desmonta o
    // las dependencias del efecto cambian. Es crucial para prevenir
    // fugas de memoria y actualizaciones de estado en componentes desmontados.
    return () => {
      clearTimeout(timer);
    };
  }, [countdown, onCountdownEnd]);

  return { countdown };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Pausa e Reanudação**: ((Vigente)) Adicionar funções retornadas pelo hook (ex: `pause`, `resume`) que permitam ao componente consumidor controlar o estado do temporizador.
 * 2. **Retorno de Estado Enriquecido**: ((Vigente)) O hook poderia retornar um objeto de estado mais rico, como `{ countdown, isRunning: boolean }`, para dar mais contexto à UI.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Lógica de UI Reutilizável**: ((Implementada)) Este hook encapsula uma lógica de UI comum e reutilizável, aderindo ao princípio DRY e à "Filosofia LEGO".
 * 2. **Gerenciamento de Ciclo de Vida**: ((Implementada)) A utilização correta do `useEffect` com sua função de limpeza garante que o hook seja seguro e eficiente, sem causar vazamentos de memória.
 *
 * =====================================================================
 */
// src/lib/hooks/use-countdown-redirect.ts
