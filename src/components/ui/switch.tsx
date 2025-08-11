// src/components/ui/switch.tsx
/**
 * @file switch.tsx
 * @description Componente de interruptor (Switch) reutilizable.
 * @author L.I.A Legacy
 * @version 1.0.0
 */
"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Controle de Formulário Booleano**: ((Implementada)) Este componente adiciona o controle de formulário padrão para todas as entradas de tipo booleano na aplicação.
 *
 * @subsection Melhorias Futuras
 * 1. **Variantes de Tamanho e Cor (CVA)**: ((Vigente)) Utilizar `class-variance-authority` (CVA) para adicionar props como `size` ('sm', 'md', 'lg') ou `color` ('primary', 'destructive') e assim permitir uma maior flexibilidade visual sem ter que sobrescrever classes manualmente.
 *
 * =====================================================================
 */
// src/components/ui/switch.tsx
