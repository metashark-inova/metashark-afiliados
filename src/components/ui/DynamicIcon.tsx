// src/components/ui/DynamicIcon.tsx
/**
 * @file src/components/ui/DynamicIcon.tsx
 * @description Componente de UI atómico y de alto rendimiento para renderizar
 *              iconos de `lucide-react` de forma dinámica a partir de un nombre
 *              proporcionado como string. Es una pieza clave de la arquitectura
 *              para cumplir con las reglas de React Server Components (RSC),
 *              permitiendo que los componentes de servidor especifiquen un icono
 *              sin pasar una función no serializable al cliente.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import { icons, type LucideProps } from "lucide-react";

import { logger } from "@/lib/logging";

interface DynamicIconProps extends LucideProps {
  /**
   * El nombre del icono de `lucide-react` a renderizar, en formato PascalCase.
   * @example "Home", "CheckCircle", "AlertTriangle"
   */
  name: string;
}

/**
 * @public
 * @component DynamicIcon
 * @description Renderiza un icono de `lucide-react` basándose en el string `name`.
 *              Si el nombre del icono no se encuentra en el registro de `lucide-react`,
 *              registra una advertencia y no renderiza nada.
 * @param {DynamicIconProps} props - Propiedades del componente.
 * @returns {React.ReactElement | null} El componente de icono renderizado o `null`.
 */
export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    logger.warn(`[DynamicIcon] Ícono no encontrado en lucide-react: "${name}"`);
    return null;
  }

  return <LucideIcon {...props} />;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Ícone de Fallback**: ((Vigente)) Em vez de retornar `null`, o componente poderia renderizar um ícone de fallback genérico (ex: `HelpCircle`) quando um ícone não é encontrado, para indicar visualmente na UI que algo está faltando, especialmente útil durante o desenvolvimento.
 * 2. **Otimização de Carregamento (Dynamic Import)**: ((Vigente)) Para aplicações com um número massivo de ícones, a importação de `lucide-react` poderia ser otimizada. Em vez de importar o objeto `icons` completo, poderíamos usar importações dinâmicas (`import()`) para carregar apenas os ícones necessários sob demanda, reduzindo o tamanho do bundle inicial.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolução de Dependência Crítica**: ((Implementada)) A transcrição deste aparato resolve o erro de compilação `TS2307` em `ActionCard.tsx`, permitindo a sua correta renderização.
 * 2. **Conformidade com RSC**: ((Implementada)) Este componente é a implementação da solução arquitetônica para o problema de passar componentes (funções) do servidor para o cliente.
 * 3. **Observabilidade**: ((Implementada)) O componente registra uma advertência clara quando um nome de ícone inválido é fornecido, facilitando a depuração.
 *
 * =====================================================================
 */
// src/components/ui/DynamicIcon.tsx
