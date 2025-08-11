// src/components/workspaces/WorkspaceActions.tsx
/**
 * @file src/components/workspaces/WorkspaceActions.tsx
 * @description Aparato de UI atómico y de presentación puro. Su única
 *              responsabilidad es renderizar la lista de acciones de gestión
 *              de un workspace (Crear, Invitar, Ajustes) dentro de un componente
 *              de `Command`. Es completamente agnóstico al estado y delega toda
 *              la lógica a través de su contrato de props.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import { PlusCircle, Settings, UserPlus } from "lucide-react";

import {
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTypedTranslations } from "@/lib/i18n/hooks";

interface WorkspaceActionsProps {
  onSelectCreate: () => void;
  onSelectInvite: () => void;
  onSelectSettings: () => void;
}

/**
 * @public
 * @component WorkspaceActions
 * @description Renderiza los `CommandItem` para las acciones de "Crear Workspace",
 *              "Invitar Miembro" y "Ajustes del Workspace". Es un componente de
 *              presentación puro que invoca los callbacks pasados a través de props
 *              cuando un usuario selecciona una acción.
 * @param {WorkspaceActionsProps} props - Los callbacks a ejecutar en la selección.
 * @returns {React.ReactElement}
 */
export function WorkspaceActions({
  onSelectCreate,
  onSelectInvite,
  onSelectSettings,
}: WorkspaceActionsProps): React.ReactElement {
  const t = useTypedTranslations("WorkspaceSwitcher");

  return (
    <CommandList>
      <CommandGroup>
        <CommandItem onSelect={onSelectCreate} className="cursor-pointer">
          <PlusCircle className="mr-2 h-5 w-5" />
          {t("createWorkspace_button")}
        </CommandItem>
        <CommandItem onSelect={onSelectInvite} className="cursor-pointer">
          <UserPlus className="mr-2 h-5 w-5" />
          {t("inviteMember_button")}
        </CommandItem>
        <CommandItem onSelect={onSelectSettings} className="cursor-pointer">
          <Settings className="mr-2 h-5 w-5" />
          {t("workspaceSettings_button")}
        </CommandItem>
      </CommandGroup>
    </CommandList>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Permissões de Ações**: ((Vigente)) O componente pai (`WorkspaceSwitcher`) poderia passar props `canInvite` ou `canChangeSettings` para desabilitar condicionalmente certos `CommandItem` com base no papel do usuário no workspace (`owner`, `admin`, `member`).
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Apresentação Atômico**: ((Implementada)) Este aparato encapsula perfeitamente a UI para as ações do workspace, aderindo ao Princípio de Responsabilidade Única e melhorando a legibilidade do componente pai.
 * 2. **Internacionalização Completa**: ((Implementada)) Todos os textos são consumidos da camada de `next-intl`, tornando o componente totalmente traduzível e reutilizável.
 *
 * =====================================================================
 */
// src/components/workspaces/WorkspaceActions.tsx
