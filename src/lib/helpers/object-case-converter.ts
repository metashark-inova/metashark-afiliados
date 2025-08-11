// src/lib/helpers/object-case-converter.ts
/**
 * @file object-case-converter.ts
 * @description Aparato de utilidade atômico e puro para conversão de nomenclatura de chaves de objetos.
 *              Esta é uma peça fundamental para a sincronização entre a lógica da aplicação (camelCase)
 *              e a camada da base de dados (snake_case).
 * @author L.I.A Legacy
 * @version 1.0.0
 */

/**
 * Converte uma string de camelCase ou PascalCase para snake_case.
 * @param str - A string a ser convertida.
 * @returns A string convertida em snake_case.
 */
const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Converte recursivamente todas as chaves de um objeto de camelCase para snake_case.
 * @param obj - O objeto a ser transformado.
 * @returns Um novo objeto com todas as chaves em snake_case.
 */
export function keysToSnakeCase<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToSnakeCase(v));
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const snakeKey = toSnakeCase(key);
        acc[snakeKey] = keysToSnakeCase(obj[key]);
        return acc;
      },
      {} as Record<string, any>
    );
  }
  return obj;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolução de Dependência**: ((Implementada)) A migração deste helper resolve a dependência do `lib/validators/index.ts`, tornando o bloco de validadores totalmente funcional.
 *
 * @subsection Melhorias Futuras
 * 1. **Função `keysToCamelCase`**: ((Vigente)) Adicionar uma função complementar, `keysToCamelCase`, para transformar os dados que vêm do banco de dados (que estão em `snake_case`) para `camelCase` para uso na aplicação.
 *
 * =====================================================================
 */
// src/lib/helpers/object-case-converter.ts
