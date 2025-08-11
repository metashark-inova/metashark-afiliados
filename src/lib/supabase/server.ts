// src/lib/supabase/server.ts
/**
 * @file src/lib/supabase/server.ts
 * @description Aparato de utilidad para la creación de clientes Supabase de servidor.
 *              Esta es la Única Fuente de Verdad para instanciar clientes de Supabase
 *              en entornos de servidor (Server Components, Server Actions, Route Handlers).
 *              Proporciona dos factorías: una para operaciones con los permisos del
 *              usuario actual y otra con privilegios de administrador.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";

/**
 * @public
 * @function createClient
 * @description Factoría para crear un cliente de Supabase del lado del servidor que opera
 *              con los permisos del usuario actualmente autenticado. Lee las cookies
 *              de la petición entrante para gestionar la sesión.
 * @returns {import('@supabase/supabase-js').SupabaseClient<Database>} Una instancia del cliente
 *          de Supabase, fuertemente tipada, para operaciones seguras a nivel de fila (RLS).
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (_error) {
            // Se ignora de forma segura. Ocurre en Server Components de renderizado estático
            // que no pueden modificar cookies.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (_error) {
            // Se ignora de forma segura por la misma razón anterior.
          }
        },
      },
    }
  );
}

/**
 * @public
 * @function createAdminClient
 * @description Factoría para crear un cliente de Supabase del lado del servidor con
 *              privilegios de administrador (service_role). Este cliente puede
 *              eludir las políticas de Row Level Security (RLS) y debe ser utilizado
 *              exclusivamente en Server Actions y capas de datos donde se requiere
 *              acceso privilegiado y se han validado los permisos previamente.
 * @returns {import('@supabase/supabase-js').SupabaseClient<Database>} Una instancia del cliente
 *          de Supabase con privilegios de administrador, fuertemente tipada.
 */
export function createAdminClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (_error) {
            // Ignorado de forma segura.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (_error) {
            // Ignorado de forma segura.
          }
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Cacheo de Instancia por Petición**: ((Vigente)) Para una optimización de élite en Server Components, las factorías podrían ser envueltas en `React.cache` para garantizar que solo se cree una instancia de cliente por cada ciclo de renderizado de petición, reduciendo la sobrecarga.
 * 2. **Validación de Variables de Entorno**: ((Vigente)) Implementar una validación con Zod al inicio de la aplicación para asegurar que las variables de entorno de Supabase están presentes, previniendo fallos en tiempo de ejecución.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alinhamento Estrutural**: ((Implementada)) O aparato foi posicionado corretamente dentro de `src/lib/supabase/`, seguindo a nova estrutura canônica do projeto.
 * 2. **Documentação TSDoc de Elite**: ((Implementada)) O propósito de cada factoría (`createClient` vs `createAdminClient`) foi documentado de forma verbosa e explícita para garantir seu uso correto e seguro.
 * 3. **Intenção Explícita**: ((Implementada)) As variáveis de erro nos blocos `catch` foram renomeadas para `_error`, comunicando explicitamente que são ignoradas de forma deliberada e segura, alinhando-se com as melhores práticas de código limpo.
 *
 * =====================================================================
 */
// src/lib/supabase/server.ts
