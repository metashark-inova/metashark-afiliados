// src/components/ui/separator.tsx
/**
 * @file separator.tsx
 * @description Componente de Separador visual, basado en Radix UI y estilizado
 * para coincidir con Shadcn/UI. Se utiliza para separar visualmente grupos de contenido.
 *
 * @author Metashark (adaptado de Shadcn/UI)
 * @version 1.0.0
 */
"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Primitivo de Layout**: ((Implementada)) Este componente adiciona uma ferramenta essencial para criar layouts visualmente organizados e limpos.
 *
 * @subsection Melhorias Futuras
 * 1. **Variantes de Estilo (CVA)**: ((Vigente)) O componente poderia ser aprimorado com `cva` para suportar variantes como `dashed` ou `dotted`, ou diferentes espessuras, sem a necessidade de classes de override.
 *
 * =====================================================================
 */
// src/components/ui/separator.tsx
