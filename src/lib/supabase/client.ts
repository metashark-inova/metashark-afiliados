// src/lib/supabase/client.ts
/**
 * @file src/lib/supabase/client.ts
 * @description Crea un cliente de Supabase para ser utilizado en el lado del navegador.
 *              Este aparato es una instancia singleton para la interacción del cliente
 *              con la API de Supabase, proporcionando seguridad de tipos completa
 *              contra el esquema de la base de datos.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { createBrowserClient } from "@supabase/ssr";

import { type Database } from "@/lib/types/database";

/**
 * @public
 * @function createClient
 * @description Crea y exporta una instancia del cliente de Supabase para el navegador.
 *              Utiliza variables de entorno públicas para la configuración.
 * @returns {import('@supabase/supabase-js').SupabaseClient<Database>} La instancia del cliente de Supabase,
 *          fuertemente tipada contra el esquema completo de la base de datos.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Validação de Variáveis de Ambiente**: ((Vigente)) Implementar uma verificação no nível da aplicação (ex: usando Zod no `env.mjs`) para garantir que as variáveis de ambiente do Supabase estejam definidas no início da aplicação, prevenindo falhas em tempo de execução.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alinhamento Estrutural**: ((Implementada)) O aparato foi transcrito e posicionado corretamente dentro da nova estrutura de diretórios `src/`.
 * 2. **Documentação TSDoc de Elite**: ((Implementada)) O aparato foi documentado de forma verbosa para garantir clareza e manutenibilidade.
 * 3. **Segurança de Tipos**: ((Implementada)) O cliente é instanciado com o tipo `Database` unificado, fornecendo segurança de tipos de ponta a ponta.
 *
 * =====================================================================
 */
// src/lib/supabase/client.ts
