// src/components/ui/tooltip.tsx
/**
 * @file tooltip.tsx
 * @description Componente de Tooltip reutilizable, basado en Radix UI y estilizado
 * para coincidir con Shadcn/UI. Es fundamental para proporcionar información
 * contextual "on-hover" de manera accesible y consistente.
 *
 * @author Metashark (adaptado de Shadcn/UI)
 * @version 1.0.0
 */
"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Melhoria da UX**: ((Implementada)) Este componente adiciona uma camada essencial de experiência do usuário, permitindo fornecer ajuda contextual e informações adicionais de forma não intrusiva.
 *
 * @subsection Melhorias Futuras
 * 1. **Atraso Configurável**: ((Vigente)) O `TooltipProvider` do Radix UI aceita uma prop `delayDuration`. Expor essa prop através do nosso `TooltipProvider` permitiria configurar globalmente o tempo que o cursor deve permanecer sobre um elemento antes que a dica de ferramenta apareça.
 *
 * =====================================================================
 */
// src/components/ui/tooltip.tsx
