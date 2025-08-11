// src/components/ui/avatar.tsx
/**
 * @file avatar.tsx
 * @description Componente de Avatar reutilizable, basado en Radix UI.
 *              Gestiona la visualización de una imagen con un fallback automático.
 * @author Metashark (adaptado de Shadcn/UI)
 * @version 1.0.0
 */
"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Identidade Visual do Usuário**: ((Implementada)) A migração deste componente fornece o primitivo padrão para a representação visual de usuários, essencial para menus, listas de membros e logs de auditoria.
 *
 * @subsection Melhorias Futuras
 * 1. **Indicador de Status**: ((Vigente)) O componente `Avatar` poderia ser envolvido por um componente de ordem superior que adicione um indicador de status (ex: um ponto verde para "online"), que seria útil em funcionalidades de colaboração em tempo real.
 * 2. **Variantes de Tamanho (CVA)**: ((Vigente)) Utilizar `cva` para adicionar uma prop `size` ao componente `Avatar` raiz, permitindo controlar facilmente o tamanho do avatar (`sm`, `md`, `lg`) em toda a aplicação.
 *
 * =====================================================================
 */
// src/components/ui/avatar.tsx
