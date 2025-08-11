// src/components/workspaces/WorkspaceSwitcher.tsx
/**
 * @file src/components/workspaces/WorkspaceSwitcher.tsx
 * @description Orquestador de alto nivel para la selección y gestión de workspaces.
 *              Este componente consume el `DashboardContext` para obtener los datos
 *              y delega la renderización de la UI a sus componentes hijos atómicos
 *              (`OnboardingDialog`, `WorkspaceActions`), actuando como un ensamblador
 *              inteligente que gestiona el estado de los diálogos y las interacciones.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import { Check, ChevronsUpDown, LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { workspaces as workspaceActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { logger } from "@/lib/logging";
import { useRouter } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { CreateWorkspaceForm } from "./CreateWorkspaceForm";
import { InviteMemberForm } from "./InviteMemberForm";
import { OnboardingDialog } from "./OnboardingDialog";
import { WorkspaceActions } from "./WorkspaceActions";

type Workspace = { id: string; name: string; icon: string | null };

const WorkspaceItem = ({
  workspace,
  onSelect,
  isSelected,
}: {
  workspace: Workspace;
  onSelect: (workspace: Workspace) => void;
  isSelected: boolean;
}) => (
  <CommandItem
    key={workspace.id}
    onSelect={() => onSelect(workspace)}
    className="text-sm cursor-pointer"
    aria-label={workspace.name}
  >
    <span className="mr-2 text-lg">
      {workspace.icon || (
        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
      )}
    </span>
    <span className="truncate">{workspace.name}</span>
    <Check
      className={cn(
        "ml-auto h-4 w-4",
        isSelected ? "opacity-100" : "opacity-0"
      )}
    />
  </CommandItem>
);

/**
 * @public
 * @component WorkspaceSwitcher
 * @description Orquesta la interfaz completa para cambiar y gestionar workspaces.
 *              Renderiza condicionalmente el `OnboardingDialog` para nuevos usuarios
 *              o el `Popover` con la lista de workspaces y acciones para usuarios existentes.
 * @param {object} props - Propiedades del componente.
 * @param {string} [props.className] - Clases CSS adicionales para el botón disparador.
 * @returns {React.ReactElement}
 */
export function WorkspaceSwitcher({
  className,
}: {
  className?: string;
}): React.ReactElement {
  const t = useTypedTranslations("WorkspaceSwitcher");
  const { user, workspaces, activeWorkspace } = useDashboard();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const onWorkspaceSelect = (workspace: Workspace) => {
    logger.trace("[WorkspaceSwitcher] Usuario cambiando de workspace.", {
      userId: user.id,
      from: activeWorkspace?.id,
      to: workspace.id,
    });
    startTransition(() => {
      workspaceActions.setActiveWorkspaceAction(workspace.id);
    });
    setPopoverOpen(false);
  };

  if (workspaces.length === 0) {
    return <OnboardingDialog />;
  }

  const handleSelectCreate = () => {
    setPopoverOpen(false);
    setCreateDialogOpen(true);
  };

  const handleSelectInvite = () => {
    setPopoverOpen(false);
    setInviteDialogOpen(true);
  };

  const handleSelectSettings = () => {
    router.push("/dashboard/settings");
    setPopoverOpen(false);
  };

  return (
    <div className="relative">
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createWorkspace_button")}</DialogTitle>
            <DialogDescription>
              {t("onboarding_welcome_description")}
            </DialogDescription>
          </DialogHeader>
          <CreateWorkspaceForm onSuccess={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("inviteMember_button")}</DialogTitle>
            <DialogDescription>
              {t.rich("inviteMember_description", {
                workspaceName: activeWorkspace?.name,
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </DialogDescription>
          </DialogHeader>
          {activeWorkspace && (
            <InviteMemberForm
              workspaceId={activeWorkspace.id}
              onSuccess={() => setInviteDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popoverOpen}
            aria-label={t("selectWorkspace_label")}
            className={cn("w-[220px] justify-between", className)}
            disabled={isPending}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-lg">
                {activeWorkspace?.icon || <LayoutGrid className="h-4 w-4" />}
              </span>
              <span className="truncate">
                {isPending
                  ? t("changing_status")
                  : activeWorkspace
                    ? activeWorkspace.name
                    : t("selectWorkspace_label")}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder={t("search_placeholder")} />
              <CommandEmpty>{t("empty_results")}</CommandEmpty>
              <CommandGroup>
                {workspaces.map((workspace) => (
                  <WorkspaceItem
                    key={workspace.id}
                    workspace={workspace}
                    onSelect={onWorkspaceSelect}
                    isSelected={activeWorkspace?.id === workspace.id}
                  />
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <WorkspaceActions
              onSelectCreate={handleSelectCreate}
              onSelectInvite={handleSelectInvite}
              onSelectSettings={handleSelectSettings}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Componentes de Diálogo Atômicos**: ((Vigente)) A lógica para os diálogos de "Criar Workspace" e "Convidar Membro" poderia ser extraída para seus próprios componentes atômicos (`CreateWorkspaceDialog`, `InviteMemberDialog`) para simplificar ainda mais o `WorkspaceSwitcher`.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Orquestração de Alto Nível**: ((Implementada)) Este componente finaliza o módulo, orquestrando todos os aparatos de `workspaces` em uma única funcionalidade coesa e completa.
 * 2. **Gestão de Estado de UI**: ((Implementada)) Gerencia de forma eficaz o estado de visibilidade dos diálogos e do popover, mantendo a UI sincronizada com as interações do usuário.
 * 3. **Consumo de Contexto**: ((Implementada)) Atua como um consumidor do `DashboardContext`, demonstrando o padrão de propagação de dados de servidor para cliente através de contexto.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspaceSwitcher.tsx
