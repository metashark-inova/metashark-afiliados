// src/lib/actions/_helpers/index.ts
/**
 * @file src/lib/actions/_helpers/index.ts
 * @description Archivo barril (Barrel File) y manifiesto para los helpers de Server Actions.
 *              Esta es la Única Fuente de Verdad para importar funciones auxiliares
 *              compartidas entre las Server Actions. Agrupa los helpers bajo namespaces
 *              lógicos para una API de consumo limpia y organizada.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import "server-only";

import { createAuditLog as auditLog } from "./audit-log.helper";
import { EmailService as email } from "./email-service.helper";
import { checkRateLimit } from "./rate-limiter.helper";

/**
 * @public
 * @constant createAuditLog
 * @description Namespace para el helper de logging de auditoría.
 * @example
 * import { createAuditLog } from "@/lib/actions/_helpers";
 * await createAuditLog("user.login", { ... });
 */
export { auditLog as createAuditLog };

/**
 * @public
 * @constant EmailService
 * @description Namespace para el servicio de envío de correos electrónicos.
 * @example
 * import { EmailService } from "@/lib/actions/_helpers";
 * await EmailService.sendPasswordResetEmail(...);
 */
export { email as EmailService };

/**
 * @public
 * @constant rateLimiter
 * @description Namespace para el helper de limitación de tasa.
 * @example
 * import { rateLimiter } from "@/lib/actions/_helpers";
 * const limit = await rateLimiter.check(ip, "login");
 */
export const rateLimiter = {
  check: checkRateLimit,
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Geração Automática**: ((Vigente)) Este arquivo barril é um candidato ideal para ser gerado e mantido por um script de build, garantindo que ele esteja sempre sincronizado com o conteúdo do diretório `_helpers/`.
 *
 * @subsection Melhorias Adicionadas
 * 1. **API de Helpers Organizada**: ((Implementada)) A transcrição deste aparato estabelece uma API de consumo limpa e baseada em namespaces para todos os helpers, melhorando a legibilidade e a manutenibilidade das Server Actions que os consomem.
 * 2. **Desacoplamento**: ((Implementada)) Ao reexportar os helpers, este arquivo permite que as Server Actions dependam apenas deste ponto de entrada, desacoplando-as da estrutura de arquivos interna do diretório `_helpers`.
 *
 * =====================================================================
 */
// src/lib/actions/_helpers/index.ts
