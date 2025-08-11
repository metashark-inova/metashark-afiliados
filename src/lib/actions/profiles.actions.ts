// src/lib/actions/profiles.actions.ts
/**
 * @file src/lib/actions/profiles.actions.ts
 * @description Contiene las Server Actions relacionadas con la gestión y personalización
 *              del perfil del usuario, como la disposición de su dashboard. Cada acción
 *              está protegida, asegurando que solo el usuario autenticado pueda
 *              modificar sus propios datos.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { type ActionResult } from "@/lib/validators";

/**
 * @public
 * @async
 * @function updateDashboardLayoutAction
 * @description Actualiza el orden de los módulos en el dashboard para el usuario autenticado.
 *              Guarda la disposición personalizada en la columna `dashboard_layout` de la
 *              tabla `profiles`.
 * @param {string[]} moduleIds - Un array de IDs de módulos en el nuevo orden deseado.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación, que puede ser un
 *          éxito o un fallo con un mensaje de error.
 */
export async function updateDashboardLayoutAction(
  moduleIds: string[]
): Promise<ActionResult<void>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ dashboard_layout: moduleIds })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: "No se pudo guardar el layout." };
  }

  // Revalida el layout del dashboard para que los cambios se reflejen inmediatamente.
  // La opción 'layout' asegura que el layout padre y sus hijos se re-rendericen.
  revalidatePath("/dashboard", "layout");

  return { success: true, data: undefined };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Ação de Atualização de Perfil Completa (`updateProfileAction`)**: ((Vigente)) Criar uma nova Server Action que permita ao usuário atualizar seu `full_name` e `avatar_url`, validando os dados com Zod e, possivelmente, interagindo com o Supabase Storage para o upload de avatares.
 * 2. **Gestão de Preferências de UI**: ((Vigente)) Expandir o sistema para guardar mais preferências do usuário na tabela `profiles`, como o tema preferido (claro/escuro) ou o estado da barra lateral (colapsada/expandida), através de uma ação `updateUserPreferencesAction`.
 * 3. **Validação de `moduleIds`**: ((Vigente)) Antes de guardar, a ação poderia adicionar uma validação no servidor que verifique se todos os IDs no array `moduleIds` correspondem a módulos existentes na tabela `feature_modules`, prevenindo dados corrompidos.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Personalização da Experiência do Usuário**: ((Implementada)) Esta ação fornece a lógica de backend para uma característica chave de UX: a capacidade do usuário de personalizar seu próprio ambiente de trabalho.
 * 2. **Segurança por Padrão**: ((Implementada)) A ação valida a sessão do usuário antes de realizar qualquer mutação e opera estritamente no `user.id` da sessão, garantindo que um usuário não possa modificar o perfil de outro.
 * 3. **Revalidação de Cache Eficiente**: ((Implementada)) Utiliza `revalidatePath` com a opção `layout`, que é a estratégia de invalidação de cache correta e de melhor desempenho para mudanças que afetam a estrutura do layout principal.
 *
 * =====================================================================
 */
// src/lib/actions/profiles.actions.ts
