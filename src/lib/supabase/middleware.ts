// src/lib/supabase/middleware.ts
/**
 * @file src/lib/supabase/middleware.ts
 * @description Aparato de utilidad para la creación de un cliente Supabase de servidor,
 *              específicamente diseñado para el entorno de Middleware de Next.js (Edge Runtime).
 *              Este cliente es único porque gestiona la sesión del usuario leyendo y
 *              escribiendo cookies directamente en los objetos NextRequest y NextResponse,
 *              manteniendo el estado de autenticación a lo largo del pipeline.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { type NextRequest, NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { logger } from "@/lib/logging";
import { type Database } from "@/lib/types/database";

/**
 * @public
 * @async
 * @function createClient
 * @description Factoría para crear una instancia del cliente de Supabase dentro del Middleware.
 *              Esta función es la única forma canónica de interactuar con Supabase en el
 *              Edge Runtime de manera segura y con estado.
 * @param {NextRequest} request - El objeto de la petición entrante, del cual se leen las cookies.
 * @param {NextResponse} [existingResponse] - Una respuesta existente para encadenar. Si no se provee, se crea una nueva.
 * @returns {Promise<{ supabase: import('@supabase/supabase-js').SupabaseClient<Database>; response: NextResponse; }>} Un objeto que contiene
 *          tanto la instancia del cliente Supabase como el objeto de respuesta actualizado con las cookies de sesión.
 */
export async function createClient(
  request: NextRequest,
  existingResponse?: NextResponse
) {
  logger.trace("[SupabaseMiddlewareClient] Creando instancia de cliente...");

  // Encadena la respuesta si ya existe una, o crea una nueva.
  // Esto es crucial para preservar las cabeceras establecidas por manejadores anteriores.
  let response = existingResponse
    ? new NextResponse(existingResponse.body, existingResponse)
    : NextResponse.next({
        request: {
          headers: request.headers,
        },
      });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          logger.trace(`[SupabaseMiddlewareClient] Setting cookie: ${name}`);
          request.cookies.set({ name, value, ...options });
          response = new NextResponse(response.body, response);
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          logger.trace(`[SupabaseMiddlewareClient] Removing cookie: ${name}`);
          request.cookies.set({ name, value: "", ...options });
          response = new NextResponse(response.body, response);
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refresca la sesión del usuario si existe una cookie válida.
  await supabase.auth.getUser();
  logger.trace("[SupabaseMiddlewareClient] Sesión de usuario refrescada.");

  return { supabase, response };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Errores en `getUser`**: ((Vigente)) Envolver la llamada `supabase.auth.getUser()` en un bloque `try/catch` para registrar explícitamente cualquier error que ocurra durante el refresco de la sesión, lo que mejoraría la capacidad de diagnóstico de problemas de autenticación en el Edge.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Observabilidade**: ((Implementada)) Se han añadido logs de `trace` para monitorear la creación del cliente, el establecimiento/eliminación de cookies y el refresco de la sesión, proporcionando una visibilidad completa del ciclo de vida de la autenticación en el middleware.
 * 2. **Documentação TSDoc de Elite**: ((Implementada)) El propósito y funcionamiento del cliente de middleware, que es un concepto complejo, ha sido documentado exhaustivamente.
 * 3. **Alinhamento Estrutural**: ((Implementada)) El aparato se ha posicionado en la nueva estructura canónica `src/`.
 *
 * =====================================================================
 */
// src/lib/supabase/middleware.ts
