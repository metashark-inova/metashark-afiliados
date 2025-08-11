// src/lib/data/modules.ts
/**
 * @file src/lib/data/modules.ts
 * @description Aparato de datos para la entidad 'feature_modules'. Esta es la
 *              Única Fuente de Verdad para obtener la lista de módulos de
 *              funcionalidades disponibles para un usuario, respetando su plan
 *              de suscripción y su layout personalizado.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";

import { unstable_cache as cache } from "next/cache";
import { type User, type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";

export type FeatureModule = {
  id: string;
  title: string;
  description: string;
  tooltip: string;
  icon: string;
  href: string;
  status: "active" | "soon" | "locked";
};

type PlanHierarchy = "free" | "pro" | "enterprise";
type Supabase = SupabaseClient<any, "public", any>;

/**
 * @private
 * @async
 * @function getBaseModules
 * @description Obtiene la lista base de todos los módulos de funcionalidades
 *              desde la base de datos. El resultado se cachea agresivamente
 *              ya que esta información cambia con poca frecuencia.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<any[]>} Un array de los módulos base.
 */
const getBaseModules = cache(
  async (supabaseClient?: Supabase) => {
    logger.info(
      `[Cache MISS] Cargando feature_modules base desde la base de datos.`
    );
    const supabase = supabaseClient || createServerClient();
    const { data, error } = await supabase
      .from("feature_modules")
      .select("*")
      .order("display_order");

    if (error) {
      logger.error("Error crítico al obtener feature_modules:", error);
      return [];
    }
    return data || [];
  },
  ["feature_modules"],
  { tags: ["feature_modules"] }
);

/**
 * @public
 * @async
 * @function getFeatureModulesForUser
 * @description Obtiene y personaliza la lista de módulos para un usuario específico.
 *              Determina el estado de cada módulo ('active', 'soon', 'locked')
 *              basándose en el plan del usuario y ordena los módulos según el
 *              layout personalizado guardado en su perfil.
 * @param {User} user - El objeto de usuario autenticado.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<FeatureModule[]>} La lista final de módulos para el usuario.
 */
export async function getFeatureModulesForUser(
  user: User,
  supabaseClient?: Supabase
): Promise<FeatureModule[]> {
  const supabase = supabaseClient || createServerClient();

  const [baseModules, { data: profile }] = await Promise.all([
    getBaseModules(supabase),
    supabase
      .from("profiles")
      .select("dashboard_layout")
      .eq("id", user.id)
      .single(),
  ]);

  if (!baseModules || baseModules.length === 0) {
    return [];
  }

  const planHierarchy: Record<PlanHierarchy, number> = {
    free: 1,
    pro: 2,
    enterprise: 3,
  };
  const userPlan = (user.app_metadata?.plan as PlanHierarchy) || "free";
  const userLevel = planHierarchy[userPlan] || 1;

  const modulesWithStatus: FeatureModule[] = baseModules.map((mod: any) => {
    const requiredLevel =
      planHierarchy[mod.required_plan as PlanHierarchy] || 1;
    const isUnlocked = userLevel >= requiredLevel;

    let status: FeatureModule["status"] = "locked";
    if (isUnlocked) {
      status = mod.status === "active" ? "active" : "soon";
    }

    return {
      id: mod.id,
      title: mod.title,
      description: mod.description,
      tooltip: mod.tooltip ?? "",
      icon: mod.icon_name,
      href: mod.href,
      status,
    };
  });

  const userLayout = profile?.dashboard_layout as string[] | null;
  if (userLayout && userLayout.length > 0) {
    const moduleMap = new Map(modulesWithStatus.map((mod) => [mod.id, mod]));
    const orderedModules: FeatureModule[] = [];
    const remainingModules = new Set(modulesWithStatus);

    for (const moduleId of userLayout) {
      if (moduleMap.has(moduleId)) {
        const mod = moduleMap.get(moduleId)!;
        orderedModules.push(mod);
        remainingModules.delete(mod);
      }
    }
    return [...orderedModules, ...Array.from(remainingModules)];
  }

  return modulesWithStatus;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Tipado Fuerte para `app_metadata`**: ((Vigente)) Extender el tipo `User` de Supabase para incluir `app_metadata.plan` y así eliminar el `as PlanHierarchy`. Esto se puede lograr a través de la aumentación de tipos en el cliente de Supabase.
 * 2. **Tipado de Módulo de Base de Datos**: ((Vigente)) Reemplazar el tipo `any` en `baseModules.map((mod: any) => ...)` con un tipo explícito `Tables<"feature_modules">` para una máxima seguridad de tipos.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Lógica de Negócio de Personalização**: ((Implementada)) Este aparato contém a lógica de negócio essencial para personalizar a experiência do dashboard do usuário, mostrando os módulos corretos com base em seu plano e em seu layout salvo.
 * 2. **Otimização de Cache**: ((Implementada)) A consulta à tabela `feature_modules`, que muda com pouca frequência, é agressivamente cacheada para garantir um desempenho de carregamento rápido para o layout do dashboard.
 * 3. **Injeção de Dependências**: ((Implementada)) A função aceita um cliente Supabase opcional, tornando-a testável de forma isolada.
 *
 * =====================================================================
 */
// src/lib/data/modules.ts
