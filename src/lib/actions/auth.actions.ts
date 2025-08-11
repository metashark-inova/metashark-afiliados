// src/lib/actions/auth.actions.ts
/**
 * @file src/lib/actions/auth.actions.ts
 * @description Contiene las Server Actions para el flujo de autenticación soberano.
 *              Este aparato nos da control total sobre la lógica de registro e inicio
 *              de sesión, permitiendo la integración de validación robusta con Zod,
 *              limitación de tasa (rate limiting) y una observabilidad completa a través
 *              de logs de auditoría.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionResult,
  SignInSchema,
  SignUpSchema,
} from "@/lib/validators";

import { createAuditLog, rateLimiter } from "./_helpers";

/**
 * @public
 * @async
 * @function signUpAction
 * @description Maneja el registro de un nuevo usuario. Valida los datos de entrada,
 *              llama a la función `signUp` de Supabase y redirige al usuario a una
 *              página de aviso para que confirme su correo electrónico.
 * @param {unknown} prevState - Estado anterior, requerido por `useFormState`.
 * @param {FormData} formData - Los datos del formulario de registro.
 * @returns {Promise<ActionResult<null>>} El resultado de la operación, conteniendo
 *          un error si la validación o el registro fallan.
 */
export async function signUpAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<null>> {
  const supabase = createClient();
  const rawData = Object.fromEntries(formData);
  try {
    const { email, password } = SignUpSchema.parse(rawData);
    const origin = headers().get("origin");
    const emailRedirectTo = `${origin}/api/auth/callback`;

    logger.trace(`[AuthActions] Iniciando registro para ${email}`);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    });

    if (error) {
      logger.warn(`[AuthActions] Fallo en el registro para ${email}`, {
        message: error.message,
      });
      return {
        success: false,
        error:
          "No se pudo completar el registro. El correo electrónico ya podría estar en uso.",
      };
    }

    await createAuditLog("user_signup_initiated", {
      metadata: { email },
    });
    logger.info(
      `[AuthActions] Registro exitoso para ${email}. Esperando confirmación.`
    );
    redirect("/auth-notice?message=check-email-for-confirmation");
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("[AuthActions] Datos de registro inválidos.", {
        errors: error.flatten(),
      });
      return { success: false, error: "Datos de registro inválidos." };
    }
    logger.error("[AuthActions] Error inesperado en signUpAction", { error });
    return { success: false, error: "Un error inesperado ocurrió." };
  }
}

/**
 * @public
 * @async
 * @function signInWithPasswordAction
 * @description Maneja el inicio de sesión de un usuario con correo y contraseña.
 *              Aplica limitación de tasa, valida las credenciales y, en caso de éxito,
 *              redirige al dashboard. Registra los intentos de inicio de sesión fallidos.
 * @param {unknown} prevState - Estado anterior, requerido por `useFormState`.
 * @param {FormData} formData - Los datos del formulario de inicio de sesión.
 * @returns {Promise<ActionResult<null>>} El resultado de la operación.
 */
export async function signInWithPasswordAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult<null>> {
  const ip = headers().get("x-forwarded-for");
  const limit = await rateLimiter.check(ip, "login");
  if (!limit.success) {
    return { success: false, error: limit.error! };
  }

  const rawData = Object.fromEntries(formData);
  try {
    const { email, password } = SignInSchema.parse(rawData);
    const supabase = createClient();

    logger.trace(
      `[AuthActions] Iniciando intento de inicio de sesión para ${email}`
    );

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      await createAuditLog("user_login_failed", {
        metadata: { email, reason: error.message },
      });
      logger.warn(`[AuthActions] Intento de login fallido para ${email}`, {
        message: error.message,
      });
      return { success: false, error: "Credenciales inválidas." };
    }
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn("[AuthActions] Datos de inicio de sesión inválidos.", {
        errors: error.flatten(),
      });
      return { success: false, error: "Datos de inicio de sesión inválidos." };
    }
    logger.error("[AuthActions] Error inesperado en signInAction", { error });
    return { success: false, error: "Un error inesperado ocurrió." };
  }

  // El `onAuthStateChange` de Supabase se encargará de crear el log de auditoría
  // para el inicio de sesión exitoso.
  redirect("/dashboard");
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Errores I18n**: ((Vigente)) Devolver claves de internacionalización (ej. "error_user_already_exists") en lugar de strings codificados para que la UI muestre mensajes traducidos.
 * 2. **Soporte para OAuth**: ((Vigente)) Crear una nueva Server Action `signInWithOAuth(provider)` que inicie el flujo de autenticación de terceros con Supabase.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fluxo de Autenticação Soberano**: ((Implementada)) Este aparato nos dá controle total sobre a lógica de registro e login, desacoplando-nos da UI de autenticação padrão do Supabase.
 * 2. **Segurança Reforçada**: ((Implementada)) A ação `signInWithPasswordAction` integra o helper de `rateLimiter`, uma camada de segurança essencial contra ataques de força bruta.
 * 3. **Observabilidade Completa**: ((Implementada)) Todas as ações são instrumentadas com logs de `trace`, `info`, `warn` e `error`, e registram eventos de auditoria cruciais para a segurança.
 *
 * =====================================================================
 */
// src/lib/actions/auth.actions.ts
