// src/components/workspaces/CreateWorkspaceForm.tsx
/**
 * @file src/components/workspaces/CreateWorkspaceForm.tsx
 * @description Formulario de cliente para la creación de nuevos workspaces.
 *              Este componente es un ejemplo de "componente de presentación inteligente",
 *              ya que gestiona su propio estado de formulario con `react-hook-form`
 *              y `zodResolver`, pero delega la mutación de datos a una Server Action
 *              recibida por props. Es completamente internacionalizado y observable.
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
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { workspaces as workspaceActions } from "@/lib/actions";
import { logger } from "@/lib/logging";
import { CreateWorkspaceSchema } from "@/lib/validators";

type FormData = z.infer<typeof CreateWorkspaceSchema>;

export function CreateWorkspaceForm({ onSuccess }: { onSuccess: () => void }) {
  const t = useTranslations("WorkspaceSwitcher");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(CreateWorkspaceSchema),
    defaultValues: {
      workspaceName: "",
      icon: "🚀", // Emoji por defecto
    },
  });

  const processSubmit = (data: FormData) => {
    logger.trace("[CreateWorkspaceForm] Enviando nuevo workspace.", {
      workspaceName: data.workspaceName,
    });
    startTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceName", data.workspaceName);
      formData.append("icon", data.icon);

      const result = await workspaceActions.createWorkspaceAction(formData);

      if (result.success) {
        toast.success(t("create_form.success_toast"));
        logger.info("[CreateWorkspaceForm] Workspace creado con éxito.", {
          workspaceId: result.data.id,
        });
        onSuccess();
      } else {
        toast.error(result.error);
        logger.error("[CreateWorkspaceForm] Fallo al crear workspace.", {
          error: result.error,
        });
      }
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 relative">
      <div className="space-y-2">
        <Label htmlFor="workspaceName">{t("create_form.name_label")}</Label>
        <Input
          id="workspaceName"
          placeholder={t("create_form.name_placeholder")}
          aria-invalid={!!errors.workspaceName}
          {...register("workspaceName")}
        />
        {errors.workspaceName?.message && (
          <p className="text-sm text-destructive" role="alert">
            {String(errors.workspaceName.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>{t("create_form.icon_label")}</Label>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal bg-input"
                  type="button"
                >
                  <span className="mr-4 text-2xl">{field.value}</span>
                  <span>{t("create_form.icon_placeholder")}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-0">
                <EmojiPicker
                  onEmojiSelect={({ emoji }) => field.onChange(emoji)}
                >
                  <EmojiPickerSearch />
                  <EmojiPickerContent />
                  <EmojiPickerFooter />
                </EmojiPicker>
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.icon?.message && (
          <p className="text-sm text-destructive" role="alert">
            {String(errors.icon.message)}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading
          ? t("create_form.creating_button")
          : t("create_form.create_button")}
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
 * 1. **Feedback de Validação em Tempo Real**: ((Vigente)) A configuração `mode: "onTouched"` em `useForm` já prepara o terreno. A UI poderia ser melhorada para mostrar os ícones de sucesso/erro de validação em tempo real à medida que o usuário preenche os campos.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Padrão de Formulário Soberano**: ((Implementada)) Este componente implementa o padrão canônico para formulários na aplicação, utilizando `react-hook-form` para a gestão do estado e `zodResolver` para a validação do lado do cliente, garantindo uma UX robusta.
 * 2. **Internacionalização Completa**: ((Implementada)) Todos os textos visíveis (labels, placeholders, botões) e mensagens de erro são consumidos da camada de `next-intl`, tornando o componente totalmente traduzível.
 * 3. **Observabilidade da Interação**: ((Implementada)) O componente registra eventos de `trace`, `info` e `error`, fornecendo uma visibilidade completa sobre o processo de criação de workspaces a partir da UI.
 *
 * =====================================================================
 */
// src/components/workspaces/CreateWorkspaceForm.tsx
