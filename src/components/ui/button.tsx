// src/components/ui/button.tsx
/**
 * @file components/ui/button.tsx
 * @description Componente de Botón de élite, polimórfico y reutilizable.
 *              Utiliza cva para variantes de estilo y Radix Slot para composición.
 *              Ha sido refactorizado para incluir documentación TSDoc completa.
 * @author Metashark & Validator (Refactorizado por L.I.A Legacy)
 * @version 3.0.0 (TSDoc Documentation)
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * @interface ButtonProps
 * @description Contrato de props para el componente Button. Extiende las propiedades
 *              nativas de un botón HTML y las variantes de estilo de CVA.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * @property {boolean} [asChild=false]
   * @description Si es `true`, el botón no renderizará su propio elemento `button`, sino que
   *              fusionará sus propiedades con el primer elemento hijo, permitiendo la
   *              creación de botones polimórficos (ej. un `<a>` que se comporta y luce
   *              como un botón).
   */
  asChild?: boolean;
}

/**
 * Renderiza un componente de botón con variantes de estilo y soporte polimórfico.
 * @public
 * @component
 * @param {ButtonProps} props - Las propiedades del componente.
 * @param {React.Ref<HTMLButtonElement>} ref - La ref reenviada al elemento botón subyacente.
 * @returns {React.ReactElement} El componente de botón renderizado.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fundação da UI**: ((Implementada)) A migração deste componente atômico é um passo fundamental. Ele será a base para a maioria dos elementos interativos da aplicação.
 *
 * @subsection Melhorias Futuras
 * 1. **Estado de Carga**: ((Vigente)) Adicionar uma prop `isLoading: boolean` para desabilitar o botão e mostrar um spinner, padronizando o feedback visual para ações assíncronas.
 *
 * =====================================================================
 */
// src/components/ui/button.tsx
