// src/components/ui/textarea.tsx
/**
 * @file textarea.tsx
 * @description Componente de área de texto reutilizable, estilizado para coincidir
 * con la estética de Shadcn/UI y la identidad de marca de la aplicación.
 *
 * @author Metashark (adaptado de Shadcn/UI)
 * @version 1.1.0 (Empty Object Type Fix)
 */
import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Controle de Formulário Multilinha**: ((Implementada)) Este componente adiciona o controle de formulário padrão para todas as entradas de texto longas, como descrições.
 *
 * @subsection Melhorias Futuras
 * 1. **Auto-ajuste de Altura**: ((Vigente)) Integrar uma pequena lógica ou uma biblioteca leve para que o `textarea` cresça automaticamente em altura à medida que o usuário digita, evitando a necessidade de barras de rolagem internas para textos longos.
 * 2. **Contador de Caracteres**: ((Vigente)) Adicionar uma prop opcional `maxLength` que, quando fornecida, mostre um contador de caracteres (ex: "120/500") abaixo do componente para dar feedback ao usuário.
 *
 * =====================================================================
 */
// src/components/ui/textarea.tsx
