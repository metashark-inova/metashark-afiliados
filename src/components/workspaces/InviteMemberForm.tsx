// src/components/workspaces/InviteMemberForm.tsx
/**
 * @file src/components/workspaces/InviteMemberForm.tsx
 * @description Formulario para invitar a un nuevo miembro a un workspace. Este
 *              componente de presentación inteligente gestiona su propio estado de
 *              formulario con `react-hook-form` y `zodResolver`, y delega la
 *              mutación de datos a la Server Action `sendWorkspaceInvitationAction`.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invitations as invitationActions } from "@/lib/actions";
import { logger } from "@/lib/logging";
import { InvitationClientSchema } from "@/lib/validators";

type FormData = z.infer<typeof InvitationClientSchema>;

export function InviteMemberForm({
  workspaceId,
  onSuccess,
}: {
  workspaceId: string;
  onSuccess: () => void;
}) {
  const t = useTranslations("WorkspaceSwitcher");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(InvitationClientSchema),
    defaultValues: {
      workspaceId,
      role: "member",
      email: "",
    },
  });

  const processSubmit = (data: FormData) => {
    logger.trace("[InviteMemberForm] Enviando invitación.", {
      workspaceId,
      email: data.email,
      role: data.role,
    });
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("role", data.role);
      formData.append("workspaceId", data.workspaceId);

      const result =
        await invitationActions.sendWorkspaceInvitationAction(formData);

      if (result.success) {
        toast.success(result.data.message);
        logger.info("[InviteMemberForm] Invitación enviada con éxito.", {
          workspaceId,
          email: data.email,
        });
        reset(); // Limpia el formulario tras el envío exitoso
        onSuccess();
      } else {
        toast.error(result.error);
        logger.error("[InviteMemberForm] Fallo al enviar invitación.", {
          workspaceId,
          email: data.email,
          error: result.error,
        });
      }
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 relative">
      <input type="hidden" {...register("workspaceId")} />

      <div className="space-y-2">
        <Label htmlFor="email">{t("invite_form.email_label")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("invite_form.email_placeholder")}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email?.message && (
          <p className="text-sm text-destructive" role="alert">
            {String(errors.email.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">{t("invite_form.role_label")}</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="role" aria-invalid={!!errors.role}>
                <SelectValue placeholder={t("invite_form.role_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">
                  {t("invite_form.role_member")}
                </SelectItem>
                <SelectItem value="admin">
                  {t("invite_form.role_admin")}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role?.message && (
          <p className="text-sm text-destructive" role="alert">
            {String(errors.role.message)}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading
          ? t("invite_form.sending_button")
          : t("invite_form.send_button")}
      </Button>
    </form>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Autocompletado de Usuarios**: ((Vigente)) Para workspaces grandes, en lugar de un input de texto, se podría usar un `Combobox` (de `cmdk`) que busque y sugiera usuarios existentes en la plataforma a medida que se escribe.
 * 2. **Invitaciones Múltiples**: ((Vigente)) Mejorar la UI para permitir al administrador pegar una lista de correos electrónicos y enviar múltiples invitaciones de una sola vez.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fluxo de Colaboração**: ((Implementada)) Este componente implementa a lógica de UI para a funcionalidade de convite, que é essencial para o trabalho em equipe na plataforma.
 * 2. **Padrão de Formulário Soberano**: ((Implementada)) Segue o padrão canônico com `react-hook-form`, `zodResolver` e `Controller` para campos complexos como o `Select`, garantindo uma UX e DX de elite.
 * 3. **Observabilidade Completa**: ((Implementada)) O fluxo de envio de convites é totalmente instrumentado com logs e feedback para o usuário através de `toast`.
 *
 * =====================================================================
 */
// src/components/workspaces/InviteMemberForm.tsx
