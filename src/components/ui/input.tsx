// src/components/ui/input.tsx
/**
 * @file components/ui/input.tsx
 * @description Componente de Input, ahora con reenvío de ref para compatibilidad con `asChild`.
 * @author Metashark (Refactorizado por L.I.A Legacy)
 * @version 2.0.0 (Ref Forwarding)
 */
import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Primitivo de Formulário**: ((Implementada)) A migração deste componente fornece o primitivo essencial para a construção de todos os formulários da aplicação.
 *
 * @subsection Melhorias Futuras
 * 1. **Input com Ícones**: ((Vigente)) Criar um componente de nível superior, como `<InputWithIcon>`, que componha este `<Input>` e permita adicionar facilmente um ícone à esquerda ou à direita, um padrão de UI comum para campos de busca ou senha.
 * 2. **Variantes de Estilo (CVA)**: ((Vigente)) Integrar `cva` para adicionar props como `size` ('sm', 'md', 'lg'), permitindo maior flexibilidade de design.
 *
 * =====================================================================
 */
// src/components/ui/input.tsx
