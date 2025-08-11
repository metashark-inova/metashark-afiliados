// src/lib/actions/sentry.actions.ts
/**
 * @file src/lib/actions/sentry.actions.ts
 * @description Aparato de diagnóstico para la integración de Sentry. Contiene una
 *              Server Action de prueba diseñada específicamente para generar un error
 *              controlado en el entorno del servidor (Node.js). Su propósito es
 *              verificar que la configuración de Sentry está capturando y reportando
 *              correctamente las excepciones que ocurren en las Server Actions.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import * as Sentry from "@sentry/nextjs";

/**
 * @public
 * @async
 * @function testSentryServerErrorAction
 * @description Lanza un error deliberado para probar la monitorización de Sentry.
 *              Este error es capturado manualmente con `Sentry.captureException` y
 *              luego relanzado para que Next.js pueda manejarlo, asegurando que
 *              tanto Sentry como el framework reaccionen como se espera.
 * @throws {Error} Lanza un error con un mensaje de prueba único y con timestamp.
 */
export async function testSentryServerErrorAction() {
  try {
    // Simulamos una operación que falla en el servidor.
    // En un caso real, esto podría ser una consulta a la base de datos que falla,
    // una llamada a una API externa que devuelve un error 500, o una lógica
    // de negocio que encuentra un estado inesperado.
    throw new Error(
      `LIA-E-S-01: Error de servidor de prueba provocado a las ${new Date().toISOString()}`
    );
  } catch (error) {
    // Esta es la instrumentación manual. Capturamos el error y lo enviamos
    // explícitamente a Sentry con todo su contexto (stack trace, etc.).
    Sentry.captureException(error);

    // Es crucial relanzar el error. Esto informa a Next.js que la Server Action
    // falló, permitiendo que el Error Boundary más cercano en la UI se active
    // y muestre un estado de error apropiado al usuario, en lugar de que la
    // acción falle silenciosamente en el servidor.
    throw error;
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Contexto de Usuario Automático**: ((Vigente)) Se podría crear un wrapper o un helper para las Server Actions que envuelva la lógica en un `try/catch` y adjunte automáticamente el `userId` y `email` del usuario actual al contexto de Sentry (`Sentry.setUser(...)`) antes de capturar la excepción.
 * 2. **Etiquetas (Tags) Dinámicas**: ((Vigente)) La llamada a `Sentry.captureException` puede ser enriquecida con etiquetas (`tags`) y datos adicionales (`extra`) para facilitar el filtrado y la búsqueda de errores en el dashboard de Sentry (ej. `workspace_id`, `action_name`).
 *
 * @subsection Melhorias Adicionadas
 * 1. **Ferramenta de Diagnóstico de Observabilidade**: ((Implementada)) Este aparato fornece uma maneira determinística e confiável de verificar a integridade da integração com o Sentry no lado do servidor, o que é fundamental para a monitorização em produção.
 * 2. **Documentação Explícita**: ((Implementada)) Os comentários no código explicam detalhadamente o "porquê" de cada passo (capturar e relançar), servindo como documentação de melhores práticas para o tratamento de erros com Sentry em Server Actions.
 *
 * =====================================================================
 */
// src/lib/actions/sentry.actions.ts
