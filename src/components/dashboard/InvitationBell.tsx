// src/components/dashboard/InvitationBell.tsx
/**
 * @file src/components/dashboard/InvitationBell.tsx
 * @description Aparato de UI atómico y de alta cohesión. Su única responsabilidad
 *              es gestionar y mostrar la interfaz para las notificaciones de
 *              invitaciones de workspace. Es un componente de cliente que consume
 *              el contexto del dashboard y el hook de i18n tipado para ser
 *              completamente internacionalizado y observable.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React from "react";
import toast from "react-hot-toast";
import { Bell, Check, LayoutGrid } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { invitations as invitationActions } from "@/lib/actions";
import { useDashboard } from "@/lib/context/DashboardContext";
import { useRealtimeInvitations } from "@/lib/hooks/use-realtime-invitations";
import { useTypedTranslations } from "@/lib/i18n/hooks";
import { logger } from "@/lib/logging";

/**
 * @public
 * @component InvitationBell
 * @description Gestiona y muestra el icono de notificaciones y la lista desplegable
 *              de invitaciones a workspaces pendientes. Se suscribe a actualizaciones
 *              en tiempo real y maneja la lógica para aceptar invitaciones, proporcionando
 *              feedback visual al usuario a través de `toast` y `useTransition`.
 * @returns {React.ReactElement} El componente de la campana de notificaciones.
 */
export function InvitationBell(): React.ReactElement {
  const t = useTypedTranslations("InvitationBell");
  const { user, pendingInvitations } = useDashboard();
  const [isPending, startTransition] = React.useTransition();
  const invitations = useRealtimeInvitations(user, pendingInvitations);

  const handleAccept = (invitationId: string) => {
    logger.trace("[InvitationBell] Usuario aceptando invitación.", {
      userId: user.id,
      invitationId,
    });
    startTransition(async () => {
      const result =
        await invitationActions.acceptInvitationAction(invitationId);
      if (result.success) {
        toast.success(result.data.message || t("accept_invitation_success"));
      } else {
        toast.error(result.error || t("accept_invitation_error"));
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label={t("view_invitations_sr")}
        >
          <Bell className="h-5 w-5" />
          {invitations.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {invitations.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>{t("pending_invitations_label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {invitations.length > 0 ? (
          invitations.map((invitation) => (
            <DropdownMenuItem
              key={invitation.id}
              className="flex items-center justify-between gap-2"
              onSelect={(event) => event.preventDefault()}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {invitation.workspaces?.icon || (
                      <LayoutGrid className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">
                    {t.rich("invitation_text", {
                      workspaceName: invitation.workspaces?.name || "...",
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAccept(invitation.id)}
                disabled={isPending}
                className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
              >
                <Check className="h-4 w-4" />
              </Button>
            </DropdownMenuItem>
          ))
        ) : (
          <p className="p-4 text-center text-sm text-muted-foreground">
            {t("no_pending_invitations")}
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Notificaciones Genéricas**: ((Vigente)) Este componente poderia evoluir para manejar múltiplos tipos de notificações (não apenas convites) obtidas de uma tabela `notifications` genérica, tornando-se um centro de notificações completo.
 * 2. **Marcar como Lida**: ((Vigente)) Adicionar uma ação para marcar uma notificação como lida sem necessariamente aceitar o convite.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente Atômico e de Alta Coesão**: ((Implementada)) Este aparato encapsula uma única e complexa responsabilidade: a gestão da UI de convites, melhorando a coesão do `DashboardHeader`.
 * 2. **Experiência em Tempo Real**: ((Implementada)) Ao consumir o hook `useRealtimeInvitations`, este componente se atualiza em tempo real, fornecendo uma UX moderna e colaborativa.
 * 3. **Observabilidade e Feedback**: ((Implementada)) A interação do usuário é registrada (`logger.trace`), e o resultado da Server Action é comunicado de forma clara através de `toast`, seguindo os padrões de observabilidade.
 *
 * =====================================================================
 */
// src/components/dashboard/InvitationBell.tsx
