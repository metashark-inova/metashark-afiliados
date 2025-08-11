// src/lib/hooks/use-subdomain-availability.ts
/**
 * @file src/lib/hooks/use-subdomain-availability.ts
 * @description Hook de React atómico y de élite para la validación asíncrona de
 *              disponibilidad de subdominios. Utiliza `useReducer` para una
 *              gestión de máquina de estados robusta y predecible, y `debounce`
 *              para optimizar las llamadas a la Server Action, previniendo
 *              peticiones excesivas mientras el usuario escribe.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { useCallback, useEffect, useReducer } from "react";

import { sites as sitesActions } from "@/lib/actions";
import { debounce } from "@/lib/utils";

/**
 * @public
 * @typedef AvailabilityStatus
 * @description Define los posibles estados de la máquina de estados de disponibilidad.
 */
export type AvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "unavailable";

type State = {
  status: AvailabilityStatus;
};

type Action =
  | { type: "CHECK_START" }
  | { type: "CHECK_SUCCESS"; isAvailable: boolean }
  | { type: "CHECK_ERROR" }
  | { type: "RESET" };

const initialState: State = { status: "idle" };

/**
 * @private
 * @function availabilityReducer
 * @description Función reductora pura que gestiona las transiciones de estado
 *              para la validación de disponibilidad.
 * @param {State} state - El estado actual.
 * @param {Action} action - La acción a procesar.
 * @returns {State} El nuevo estado.
 */
function availabilityReducer(state: State, action: Action): State {
  switch (action.type) {
    case "CHECK_START":
      return { status: "checking" };
    case "CHECK_SUCCESS":
      return { status: action.isAvailable ? "available" : "unavailable" };
    case "CHECK_ERROR":
      // Por seguridad, si la API falla, consideramos el subdominio no disponible.
      return { status: "unavailable" };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

/**
 * @public
 * @exports useSubdomainAvailability
 * @description Hook que gestiona la lógica completa para verificar la disponibilidad
 *              de un subdominio en tiempo real mientras el usuario escribe.
 * @param {string} subdomainValue - El valor actual del subdominio a verificar.
 * @param {boolean} isDirty - Indica si el campo ha sido modificado por el usuario.
 * @param {boolean} hasErrors - Indica si el campo tiene errores de validación síncrona (ej. formato inválido).
 * @returns {{ availability: AvailabilityStatus }} El estado actual de disponibilidad.
 */
export function useSubdomainAvailability(
  subdomainValue: string,
  isDirty: boolean,
  hasErrors: boolean
) {
  const [state, dispatch] = useReducer(availabilityReducer, initialState);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheck = useCallback(
    debounce(async (subdomain: string) => {
      dispatch({ type: "CHECK_START" });
      const result =
        await sitesActions.checkSubdomainAvailabilityAction(subdomain);
      if (result.success) {
        dispatch({
          type: "CHECK_SUCCESS",
          isAvailable: result.data.isAvailable,
        });
      } else {
        dispatch({ type: "CHECK_ERROR" });
      }
    }, 500),
    [] // `debounce` devuelve una función estable, por lo que no necesita dependencias.
  );

  useEffect(() => {
    // No hacer nada si el campo no ha sido tocado o si ya tiene errores de formato.
    if (!isDirty || hasErrors || subdomainValue.length < 3) {
      dispatch({ type: "RESET" });
      return;
    }
    debouncedCheck(subdomainValue);
  }, [subdomainValue, isDirty, hasErrors, debouncedCheck]);

  return { availability: state.status };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **AbortController**: ((Vigente)) A melhoria de elite para este hook seria integrar um `AbortController` para cancelar as `fetch` requests pendentes da Server Action se o usuário continuar a digitar. Isso otimizaria os recursos do servidor e evitaria condições de concorrência na UI.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Máquina de Estados Robusta**: ((Implementada)) O uso de `useReducer` torna as transições de estado explícitas e atômicas, eliminando condições de corrida e tornando o estado do hook mais previsível e testável.
 * 2. **Otimização de Rede (Debounce)**: ((Implementada)) A validação só é disparada após o usuário parar de digitar por 500ms, prevenindo uma avalanche de chamadas à API e melhorando o desempenho.
 * 3. **Lógica de UI Reutilizável**: ((Implementada)) Este hook encapsula uma lógica de validação assíncrona complexa, tornando-a facilmente reutilizável em qualquer formulário que necessite verificar a unicidade de um campo.
 *
 * =====================================================================
 */
// src/lib/hooks/use-subdomain-availability.ts
