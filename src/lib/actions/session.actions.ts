// src/lib/actions/session.actions.ts
/**
 * @file src/lib/actions/session.actions.ts
 * @description Aparato de acción atómico. Su Única Responsabilidad es gestionar
 *              el ciclo de vida de la sesión del usuario, específicamente el cierre de sesión.
 *              Esta granularidad mejora la cohesión y la claridad de la arquitectura de acciones.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { createAuditLog } from "./_helpers/audit-log.helper";

/**
 * @public
 * @async
 * @function signOutAction
 * @description Cierra la sesión del usuario actual. Si existe una sesión activa,
 *              registra el evento en la auditoría para una trazabilidad completa.
 *              Finalmente, redirige al usuario a la página de inicio.
 * @returns {Promise<void>} No devuelve ningún valor, ya que su efecto secundario
 *          principal es una redirección.
 */
export async function signOutAction(): Promise<void> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await createAuditLog("user_sign_out", { userId: session.user.id });
  }

  await supabase.auth.signOut();
  return redirect("/");
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Cierre de Sesión Global**: ((Vigente)) Supabase permite invalidar todas las sesiones activas para un usuario (`signOut({ scope: 'global' })`). Se podría añadir una Server Action `signOutFromAllDevicesAction` para esta funcionalidad de seguridad.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Atomicidade e Coesão (SRP)**: ((Implementada)) A lógica de encerramento de sessão foi isolada em seu próprio módulo, melhorando a coesão e aderindo ao Princípio de Responsabilidade Única.
 * 2. **Observabilidade de Segurança**: ((Implementada)) A ação registra um log de auditoria antes de encerrar a sessão, garantindo que todas as saídas sejam rastreadas.
 * 3. **Resiliência**: ((Implementada)) A ação funciona corretamente mesmo se for chamada quando não há uma sessão ativa, simplesmente redirecionando o usuário sem falhar.
 *
 * =====================================================================
 */
// src/lib/actions/session.actions.ts
