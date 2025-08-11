// src/lib/auth/middleware-permissions.ts
/**
 * @file src/lib/auth/middleware-permissions.ts
 * @description Aparato de lógica de sesión especializado y optimizado para el Edge Runtime (Middleware).
 *              Esta es la Única Fuente de Verdad para obtener el contexto de autenticación
 *              del usuario dentro del middleware. NO UTILIZA `React.cache`, ya que no
 *              está disponible en el Edge Runtime, garantizando la compatibilidad.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import "server-only";

import { cookies } from "next/headers";
import { type User } from "@supabase/supabase-js";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/types/database";

type AppRole = Database["public"]["Enums"]["app_role"];

/**
 * @public
 * @typedef UserAuthData
 * @description Define el contrato de datos para el contexto de sesión del usuario en el middleware.
 *              Es una estructura de datos ligera, optimizada para el rendimiento en el Edge.
 */
export type UserAuthData = {
  user: User;
  appRole: AppRole;
  activeWorkspaceId: string | null;
};

/**
 * @public
 * @async
 * @function getAuthDataForMiddleware
 * @description Obtiene los datos de sesión esenciales para el middleware. Realiza una
 *              consulta a la base de datos para obtener el rol de aplicación del usuario
 *              y lee la cookie `active_workspace_id` para determinar el contexto
 *              actual del usuario. Es una implementación ligera, sin caché, y segura
 *              para ejecutar en el Edge Runtime.
 * @returns {Promise<UserAuthData | null>} El contexto de sesión completo del usuario o `null`
 *          si el usuario no está autenticado.
 */
export async function getAuthDataForMiddleware(): Promise<UserAuthData | null> {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const cookieStore = cookies();
  const { data: profile } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .single();

  return {
    user,
    appRole: profile?.app_role || "user",
    activeWorkspaceId: cookieStore.get("active_workspace_id")?.value || null,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo a Nivel de Edge (Vercel KV)**: ((Vigente)) Para una optimización de élite, los datos del perfil (especialmente el `app_role` que cambia con poca frecuencia) podrían ser cacheados en un almacenamiento de Edge como Vercel KV con un TTL corto. Esto reduciría la latencia al evitar una consulta a la base de datos en cada ejecución del middleware para usuarios ya conocidos.
 * 2. **Tipado de `User`**: ((Vigente)) Considerar extender el tipo `User` de Supabase para incluir `app_metadata.app_role` directamente, si la lógica del trigger `handle_new_user` se modifica para poblarlo, simplificando así la consulta en este módulo.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Lógica Especializada para Edge**: ((Implementada)) Este aparato aísla la lógica de obtención de sesión para el middleware, reconociendo las restricciones del Edge Runtime (sin `React.cache`) y proporcionando una solución compatible y de alto rendimiento.
 * 2. **Documentação TSDoc Clara**: ((Implementada)) La documentación explica explícitamente por qué este aparato es necesario y por qué difiere de su contraparte para el entorno Node.js, mejorando la mantenibilidad.
 * 3. **Segurança de Tipos**: ((Implementada)) Utiliza tipos derivados del esquema de la base de datos para garantizar la consistencia.
 *
 * =====================================================================
 */
// src/lib/auth/middleware-permissions.ts
