// src/lib/actions/password.actions.ts
/**
 * @file src/lib/actions/password.actions.ts
 * @description Aparato canónico para las Server Actions del ciclo de vida de la contraseña.
 *              Contiene la lógica segura para solicitar un restablecimiento y para
 *              actualizar la contraseña. Implementa un flujo de seguridad anti-enumeración
 *              y utiliza helpers de limitación de tasa y auditoría.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { logger } from "@/lib/logging";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { EmailSchema, type RequestPasswordResetState } from "@/lib/validators";

import { createAuditLog, EmailService, rateLimiter } from "./_helpers";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

type UpdatePasswordFormState = { error: string | null; success: boolean };

/**
 * @public
 * @async
 * @function requestPasswordResetAction
 * @description Inicia el flujo de restablecimiento de contraseña. Es seguro contra
 *              ataques de enumeración de usuarios: no revela si un correo electrónico
 *              existe en el sistema. Siempre redirige a una página de aviso genérica.
 * @param {RequestPasswordResetState} prevState - Estado anterior del formulario.
 * @param {FormData} formData - Datos del formulario que contienen el email.
 * @returns {Promise<RequestPasswordResetState>} El nuevo estado del formulario,
 *          conteniendo un error en caso de fallo de validación o de rate limit.
 */
export async function requestPasswordResetAction(
  prevState: RequestPasswordResetState,
  formData: FormData
): Promise<RequestPasswordResetState> {
  const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
  const limit = await rateLimiter.check(ip, "password_reset");

  if (!limit.success) {
    return {
      error:
        limit.error || "Demasiadas solicitudes. Intente nuevamente más tarde.",
    };
  }

  const email = formData.get("email");
  const validation = EmailSchema.safeParse(email);
  if (!validation.success) {
    return { error: "Por favor, introduce un email válido." };
  }

  const validatedEmail = validation.data;
  const adminSupabase = createAdminClient();

  // Flujo de seguridad canónico: no se verifica si el usuario existe.
  // Se llama a generateLink incondicionalmente.
  const { data, error } = await adminSupabase.auth.admin.generateLink({
    type: "recovery",
    email: validatedEmail,
  });

  if (error) {
    // Solo se registra el error en el servidor, no se revela al cliente.
    logger.error(
      `[PasswordActions] Error al generar link de recuperación para ${validatedEmail}:`,
      error
    );
  } else {
    await EmailService.sendPasswordResetEmail(
      validatedEmail,
      data.properties.action_link
    );
  }

  await createAuditLog("password_reset_request", {
    metadata: { targetEmail: validatedEmail, ipAddress: ip },
  });

  // Siempre se redirige para no dar información sobre la existencia del email.
  redirect("/auth-notice?message=check-email-for-reset");
}

/**
 * @public
 * @async
 * @function updatePasswordAction
 * @description Completa el flujo de restablecimiento, actualizando la contraseña del
 *              usuario. Valida que el usuario tenga una sesión de recuperación válida.
 * @param {UpdatePasswordFormState} prevState - Estado anterior del formulario.
 * @param {FormData} formData - Datos del formulario con la nueva contraseña.
 * @returns {Promise<UpdatePasswordFormState>} El nuevo estado del formulario.
 */
export async function updatePasswordAction(
  prevState: UpdatePasswordFormState,
  formData: FormData
): Promise<UpdatePasswordFormState> {
  const validation = ResetPasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validation.success) {
    const formErrors = validation.error.flatten().fieldErrors;
    const errorMessage =
      formErrors.password?.[0] ||
      formErrors.confirmPassword?.[0] ||
      "Datos inválidos.";
    return { error: errorMessage, success: false };
  }

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error:
        "Sesión de recuperación inválida o expirada. Por favor, solicita un nuevo enlace.",
      success: false,
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    logger.error(
      `[PasswordActions] Error al actualizar la contraseña para ${user.id}:`,
      error.message
    );
    if (error.message.includes("token has expired")) {
      return {
        error:
          "El enlace de reseteo ha expirado. Por favor, solicita uno nuevo.",
        success: false,
      };
    }
    return {
      error: "No fue posible actualizar la contraseña. Intente nuevamente.",
      success: false,
    };
  }

  await createAuditLog("password_reset_success", { userId: user.id });
  // Por seguridad, cerramos todas las demás sesiones activas del usuario.
  await supabase.auth.signOut({ scope: "others" });

  return { error: null, success: true };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Notificación de Cambio de Contraseña**: ((Vigente)) Después de una actualización exitosa, enviar un correo electrónico de notificación al usuario informándole que su contraseña ha sido cambiada, como una medida de seguridad adicional.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Segurança Anti-Enumeração**: ((Implementada)) A ação `requestPasswordResetAction` segue as melhores práticas de segurança ao não revelar a existência de um e-mail no sistema, prevenindo ataques de enumeração de usuários.
 * 2. **Ciclo de Vida Completo**: ((Implementada)) Este aparato fornece a lógica completa para o ciclo de vida de redefinição de senha, desde a solicitação até a atualização segura.
 * 3. **Observabilidade e Auditoria**: ((Implementada)) Ambas as ações são instrumentadas com logs de erro e de auditoria, garantindo a rastreabilidade de eventos de segurança críticos.
 *
 * =====================================================================
 */
// src/lib/actions/password.actions.ts
