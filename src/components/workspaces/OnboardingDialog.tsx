// src/components/workspaces/OnboardingDialog.tsx
/**
 * @file src/components/workspaces/OnboardingDialog.tsx
 * @description Aparato de UI atómico y de alta cohesión. Su única responsabilidad
 *              es gestionar y mostrar el diálogo de bienvenida y onboarding para
 *              nuevos usuarios, guiándolos para crear su primer workspace. Este
 *              componente es modal y no se puede cerrar, forzando la acción.
 *              Ha sido corregido para eliminar una prop inválida.
 * @author L.I.A. Legacy
 * @version 1.1.0
 */
"use client";

import { useRouter } from "next/navigation";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTypedTranslations } from "@/lib/i18n/hooks";

import { CreateWorkspaceForm } from "./CreateWorkspaceForm";

/**
 * @public
 * @component OnboardingDialog
 * @description Muestra un diálogo modal forzado para usuarios sin workspaces.
 *              Contiene el `CreateWorkspaceForm` para guiar al usuario en su
 *              primera acción crítica. Tras una creación exitosa, fuerza una
 *              recarga completa de los datos del servidor (`router.refresh()`)
 *              para reinicializar el contexto del dashboard con el nuevo workspace.
 * @returns {React.ReactElement} El componente de diálogo de onboarding.
 */
export function OnboardingDialog(): React.ReactElement {
  const t = useTypedTranslations("WorkspaceSwitcher");
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <Dialog open={true}>
      {/*
        CORRECCIÓN: Se ha eliminado la prop `showCloseButton={false}`.
        La librería Radix/Shadcn UI gestiona el botón de cierre internamente.
        Para prevenir el cierre, simplemente evitamos pasar `onOpenChange` al `Dialog`
        y mantenemos `open={true}`. El `DialogContent` ya incluye un `DialogPrimitive.Close`
        por defecto, pero el usuario no puede cerrar el diálogo si el estado `open` está forzado.
      */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("onboarding_welcome_title")}</DialogTitle>
          <DialogDescription>
            {t("onboarding_welcome_description")}
          </DialogDescription>
        </DialogHeader>
        <CreateWorkspaceForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Tour Guiado**: ((Vigente)) O callback `onSuccess` poderia iniciar um tour guiado (ex: com `react-joyride`) em vez de apenas atualizar a página.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Correção de Contrato de API**: ((Implementada)) A prop inválida `showCloseButton` foi removida do componente `DialogContent`, resolvendo o erro de compilação `TS2322` e alinhando o componente com a API canônica da biblioteca de UI.
 *
 * =====================================================================
 */
// src/components/workspaces/OnboardingDialog.tsx
