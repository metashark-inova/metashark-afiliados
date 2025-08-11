// src/lib/logging.ts
/**
 * @file src/lib/logging.ts
 * @description Aparato de Logging Canónico y de Alta Visibilidad.
 *              Esta es la Única Fuente de Verdad para el logging en el entorno de servidor (Node.js).
 *              Utiliza una implementación simplificada y de alto rendimiento que formatea
 *              los logs para una legibilidad óptima en desarrollo y los envía a Sentry
 *              en producción (o entornos similares), garantizando una observabilidad completa.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import * as Sentry from "@sentry/nextjs";

/**
 * @typedef LogLevel
 * @description Define los niveles de severidad de log soportados.
 */
type LogLevel = "trace" | "info" | "warn" | "error";

/**
 * @private
 * @function logToConsole
 * @description Formatea y colorea los mensajes de log para la consola de desarrollo.
 *              Esta función solo se ejecuta si `process.env.NODE_ENV` es 'development'.
 * @param {LogLevel} level - El nivel del log.
 * @param {string} message - El mensaje principal.
 * @param {any[]} context - Datos adicionales a registrar, que serán formateados.
 */
function logToConsole(level: LogLevel, message: string, ...context: any[]) {
  if (process.env.NODE_ENV !== "development") return;

  const colors = {
    trace: "\x1b[90m", // Gray
    info: "\x1b[32m", // Green
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
  };
  const color = colors[level] || "\x1b[37m"; // Default to white
  const reset = "\x1b[0m";
  const timestamp = new Date().toLocaleTimeString();

  console.log(
    `${color}[${level.toUpperCase()}]${reset} [${timestamp}] ${message}`,
    ...context
  );
}

/**
 * @public
 * @constant logger
 * @description El objeto logger principal para el entorno de servidor Node.js.
 *              Proporciona métodos para cada nivel de severidad. Los logs de nivel
 *              `info`, `warn`, y `error` son enviados a Sentry.
 */
export const logger = {
  /**
   * Registra mensajes de diagnóstico detallados. Usado para seguir el flujo de
   * ejecución de código complejo. Solo se muestra en desarrollo.
   * @param {string} message - El mensaje de trace.
   * @param {...any[]} context - Datos contextuales adicionales.
   */
  trace: (message: string, ...context: any[]) => {
    logToConsole("trace", message, ...context);
  },
  /**
   * Registra eventos informativos que destacan el progreso de la aplicación.
   * @param {string} message - El mensaje de información.
   * @param {...any[]} context - Datos contextuales adicionales.
   */
  info: (message: string, ...context: any[]) => {
    logToConsole("info", message, ...context);
    Sentry.captureMessage(message, { level: "info", extra: { context } });
  },
  /**
   * Registra eventos inesperados o problemas potenciales que no son críticos.
   * @param {string} message - El mensaje de advertencia.
   * @param {...any[]} context - Datos contextuales adicionales.
   */
  warn: (message: string, ...context: any[]) => {
    logToConsole("warn", message, ...context);
    Sentry.captureMessage(message, { level: "warning", extra: { context } });
  },
  /**
   * Registra errores y excepciones que requieren atención inmediata.
   * @param {string} message - El mensaje de error.
   * @param {...any[]} context - El error o datos contextuales adicionales.
   */
  error: (message: string, ...context: any[]) => {
    logToConsole("error", message, ...context);
    Sentry.captureMessage(message, { level: "error", extra: { context } });
  },
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Contexto de Request Automático**: ((Vigente)) Integrar con `AsyncLocalStorage` de Node.js para adjuntar automáticamente un ID de petición único a cada log generado durante un ciclo de petición-respuesta, facilitando el rastreo de flujos completos en producción.
 * 2. **Logging Estructurado en Producción**: ((Vigente)) En lugar de `logToConsole`, en producción los logs podrían ser formateados como JSON estructurado para una mejor ingesta y búsqueda en plataformas de logging como Datadog o Logtail, además de Sentry.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Dependência Fundamental**: ((Implementada)) A transcrição deste aparato é um pré-requisito para todos os módulos do lado do servidor que implementam a observabilidade, desbloqueando a camada de `actions`, `data` e `middleware`.
 * 2. **Observabilidade Integrada**: ((Implementada)) O logger está pré-configurado para enviar logs de níveis relevantes para o Sentry, estabelecendo a base para a monitorização em produção desde o início.
 * 3. **Legibilidade em Desenvolvimento**: ((Implementada)) O uso de logs coloridos e formatados para o ambiente de desenvolvimento melhora drasticamente a experiência de depuração.
 *
 * =====================================================================
 */
// src/lib/logging.ts
