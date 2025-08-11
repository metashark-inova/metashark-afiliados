// src/lib/types/database/index.ts
/**
 * @file index.ts
 * @description Manifiesto de Tipos de Base de Datos Canónico y Ensamblador.
 *              Este aparato fusiona los tipos generados automáticamente con los
 *              tipos manuales (Vistas) para crear un único tipo `Database`
 *              que representa el esquema completo.
 * @author L.I.A Legacy
 * @version 11.0.0
 */
import { type Database as GeneratedDB } from "./_supabase.generated";
import { type ManualDatabaseDefs } from "./_supabase.manual";

export type Database = GeneratedDB & ManualDatabaseDefs;

export * from "./_shared";
export * from "./views";

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Tipo `Database` Unificado**: ((Implementada)) Este arquivo cria e exporta o tipo `Database` unificado, que é a SSoT para o esquema completo e será usado para instanciar todos os clientes Supabase com segurança de tipos de ponta a ponta.
 * 2. **Resolução de Dependência Circular**: ((Implementada)) A criação deste arquivo resolve a dependência circular que estava causando o erro de compilação no arquivo `_shared.ts`.
 *
 * @subsection Melhorias Futuras
 * 1. **Automatização da Fusão**: ((Vigente)) Um script de build poderia, teoricamente, automatizar a fusão de tipos se o número de fontes de tipos manuais crescesse, mas a abordagem atual é perfeitamente adequada.
 *
 * =====================================================================
 */
// src/lib/types/database/index.ts
