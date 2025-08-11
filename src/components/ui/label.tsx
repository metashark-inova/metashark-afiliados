// src/components/ui/label.tsx
/**
 * @file label.tsx
 * @description Componente de Etiqueta (Label) reutilizable, basado en Radix UI.
 *              Esencial para la accesibilidad de los formularios.
 * @author Metashark (adaptado de Shadcn/UI)
 * @version 1.0.0
 */
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fundamento de Acessibilidade (a11y)**: ((Implementada)) A migração deste componente é crítica, pois fornece o meio canônico para associar texto descritivo a campos de formulário, um pilar da acessibilidade na web.
 *
 * @subsection Melhorias Futuras
 * 1. **Indicador de Campo Obrigatório**: ((Vigente)) Adicionar uma prop opcional `required: boolean` que, quando verdadeira, renderize um asterisco (`*`) ao lado do texto da etiqueta para indicar visualmente que o campo é obrigatório.
 *
 * =====================================================================
 */
// src/components/ui/label.tsx
