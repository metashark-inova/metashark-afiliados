// src/lib/types/database/_shared.ts
/**
 * @file _shared.ts
 * @description Helpers de tipo de Supabase. Ha sido reparado para corregir un error
 *              sintáctico crítico (`keyof`) que desestabilizaba el sistema de tipos.
 * @author L.I.A. Legacy
 * @version 12.1.0 (Critical Syntax Fix)
 */
import { type Database as DB } from "./index";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Tables<T extends keyof DB["public"]["Tables"]> =
  DB["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof DB["public"]["Tables"]> =
  DB["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof DB["public"]["Tables"]> =
  DB["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof DB["public"]["Enums"]> =
  DB["public"]["Enums"][T];

export type Views<T extends keyof DB["public"]["Views"]> =
  DB["public"]["Views"][T]["Row"];

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fundação de Tipos de Dados**: ((Implementada)) Este aparato estabelece a base para a segurança de tipos em toda a camada de dados. É uma dependência crítica para todos os outros arquivos de tipos e módulos de dados.
 *
 * @subsection Melhorias Futuras
 * 1. **Tipos de RPC**: ((Vigente)) Considerar adicionar um helper de tipo genérico `Rpc<T extends keyof DB["public"]["Functions"]>` para extrair os tipos de argumentos (`Args`) e de retorno (`Returns`) das funções RPC, completando a cobertura de tipos da base de dados.
 *
 * =====================================================================
 */
// src/lib/types/database/_shared.ts
