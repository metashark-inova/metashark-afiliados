// src/lib/data/workspaces.ts
/**
 * @file src/lib/data/workspaces.ts
 * @description Aparato de datos para la entidad 'workspaces'. Esta es la Única Fuente
 *              de Verdad para interactuar con la tabla `workspaces` y sus entidades
 *              relacionadas. Ha sido refactorizado para una gestión de errores resiliente,
 *              manejo de inconsistencias de datos y soporte para inyección de dependencias
 *              en el entorno de pruebas.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";

import { type SupabaseClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logging";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Tables } from "@/lib/types/database";

export type Workspace = Tables<"workspaces">;
type Supabase = SupabaseClient<any, "public", any>;

/**
 * @public
 * @async
 * @function getWorkspacesByUserId
 * @description Obtiene todos los workspaces a los que un usuario pertenece a través de la tabla de unión `workspace_members`.
 * @param {string} userId - El ID del usuario.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase para inyección de dependencias.
 * @returns {Promise<Workspace[]>} Una promesa que resuelve a un array de workspaces. Devuelve un array vacío en caso de error para máxima resiliencia.
 */
export async function getWorkspacesByUserId(
  userId: string,
  supabaseClient?: Supabase
): Promise<Workspace[]> {
  const supabase = supabaseClient || createServerClient();
  try {
    const { data, error } = await supabase
      .from("workspace_members")
      .select("workspaces(*)")
      .eq("user_id", userId);

    if (error) {
      throw new Error("No se pudieron cargar los datos de los workspaces.");
    }

    // Filtra cualquier resultado nulo que pueda provenir de inconsistencias de datos.
    const workspaces: Workspace[] =
      data?.flatMap((item) => item.workspaces || []) || [];
    return workspaces;
  } catch (error) {
    logger.error(
      `Error al obtener workspaces para el usuario ${userId}:`,
      error
    );
    return []; // Retorna un array vacío para que la UI no falle.
  }
}

/**
 * @public
 * @async
 * @function getFirstWorkspaceForUser
 * @description Obtiene el primer workspace de un usuario. Es una función crítica para el
 *              flujo de onboarding, para determinar si un nuevo usuario ya ha creado
 *              o ha sido invitado a su primer workspace.
 * @param {string} userId - El ID del usuario.
 * @param {Supabase} [supabaseClient] - Instancia opcional del cliente Supabase.
 * @returns {Promise<Workspace | null>} El primer workspace encontrado o `null` si no existe o en caso de error.
 */
export async function getFirstWorkspaceForUser(
  userId: string,
  supabaseClient?: Supabase
): Promise<Workspace | null> {
  const supabase = supabaseClient || createServerClient();
  try {
    const { data, error } = await supabase
      .from("workspace_members")
      .select("workspaces(*)")
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (error) {
      // No registrar como error si simplemente no se encuentra (comportamiento esperado).
      if (error.code !== "PGRST116") {
        throw new Error("No se pudo cargar el workspace inicial del usuario.");
      }
      return null;
    }

    // Lógica de resiliencia: maneja el caso en que `data` exista pero `data.workspaces` sea nulo.
    if (!data?.workspaces) {
      return null;
    }

    const workspaceData = data.workspaces;
    return Array.isArray(workspaceData) ? null : workspaceData;
  } catch (error) {
    logger.error(`Error al obtener el primer workspace para ${userId}:`, error);
    return null; // Retorna null para que el flujo de onboarding pueda manejarlo.
  }
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo con `React.cache`**: ((Vigente)) Las funciones de esta capa de datos, especialmente `getWorkspacesByUserId`, son candidatas ideales para ser envueltas en `React.cache` para optimizar el rendimiento en Server Components, evitando consultas repetidas a la base de datos dentro del mismo ciclo de renderizado.
 * 2. **Función `getWorkspaceDetails`**: ((Vigente)) Añadir una nueva función que obtenga los detalles de un workspace junto con la lista de sus miembros y sus roles.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Gestión de Errores Resiliente**: ((Implementada)) Ambas funciones ahora utilizan bloques `try/catch` para capturar excepciones, registrar el error con contexto y devolver un valor seguro (`[]` o `null`), haciendo que la UI sea más robusta ante fallos de la base de datos.
 * 2. **Resiliencia a Inconsistencias de Datos**: ((Implementada)) La lógica ha sido fortalecida para manejar casos de borde donde las relaciones en la base de datos podrían estar inconsistentes (ej. un `workspace_member` sin un `workspace` asociado), previniendo errores en tiempo de ejecución.
 * 3. **Inyección de Dependencias para Pruebas**: ((Implementada)) Ambas funciones aceptan un cliente de Supabase opcional, lo que las hace 100% testeables de forma unitaria y desacopladas del entorno de ejecución.
 *
 * =====================================================================
 */
// src/lib/data/workspaces.ts
