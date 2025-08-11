// src/components/ui/LanguageSwitcher.tsx
/**
 * @file src/components/ui/LanguageSwitcher.tsx
 * @description Componente de cliente atómico y reutilizable para cambiar el idioma
 *              de la aplicación. Este aparato es la Única Fuente de Verdad para
 *              la interacción del usuario con la configuración de i18n.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import React, { useTransition } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logger } from "@/lib/logging";
import {
  type AppLocale,
  locales,
  usePathname,
  useRouter,
} from "@/lib/navigation";

const COOKIE_NAME = "NEXT_LOCALE_CHOSEN";

/**
 * @public
 * @component LanguageSwitcher
 * @description Renderiza un botón que muestra el idioma actual y, al hacer clic,
 *              despliega un menú con todos los idiomas soportados. Al seleccionar
 *              un nuevo idioma, actualiza la cookie de preferencia del usuario y
 *              refresca la ruta actual con el nuevo prefijo de locale.
 * @returns {React.ReactElement}
 */
export function LanguageSwitcher(): React.ReactElement {
  const t = useTranslations("LanguageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const currentLocale = params.locale as AppLocale;

  const localeDetails: Record<AppLocale, { name: string; flag: string }> = {
    "en-US": { name: t("language_en_US"), flag: t("flag_en_US") },
    "es-ES": { name: t("language_es_ES"), flag: t("flag_es_ES") },
    "pt-BR": { name: t("language_pt_BR"), flag: t("flag_pt_BR") },
  };

  const handleLocaleChange = (newLocale: AppLocale): void => {
    logger.trace("[LanguageSwitcher] Inicio de cambio de idioma.", {
      from: currentLocale,
      to: newLocale,
      currentPath: pathname,
    });

    startTransition(() => {
      Cookies.set(COOKIE_NAME, newLocale, { expires: 365, path: "/" });
      router.replace(pathname, { locale: newLocale });
    });
  };

  const currentDetails = currentLocale ? localeDetails[currentLocale] : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          aria-label={t("selectLanguage_sr")}
        >
          <Globe className="h-4 w-4 mr-2" />
          {currentDetails ? (
            <>
              <span
                className="mr-2"
                role="img"
                aria-label={currentDetails.name}
              >
                {currentDetails.flag}
              </span>
              <span className="hidden sm:inline">{currentDetails.name}</span>
            </>
          ) : (
            "..."
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale: AppLocale) => (
          <DropdownMenuItem
            key={locale}
            onSelect={() => handleLocaleChange(locale)}
            disabled={locale === currentLocale || isPending}
          >
            <span
              className="mr-2"
              role="img"
              aria-label={localeDetails[locale].name}
            >
              {localeDetails[locale].flag}
            </span>
            {localeDetails[locale].name}
          </DropdownMenuItem>
        ))}
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
 * 1. **Sincronização com Perfil de Usuário**: ((Vigente)) Para usuários autenticados, a preferência de idioma poderia ser guardada na tabela `profiles`, sincronizando a experiência através de diferentes dispositivos.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolução de Dependência Crítica**: ((Implementada)) A reconstrução deste componente resolve a dependência de `LandingHeader`, permitindo que o cabeçalho da landing page seja renderizado corretamente.
 * 2. **Lógica de i18n Interativa**: ((Implementada)) Encapsula toda a lógica de cliente para a mudança de idioma, incluindo a atualização de cookies e a navegação, seguindo as melhores práticas de `next-intl`.
 * 3. **Feedback de Transição**: ((Implementada)) Utiliza `useTransition` para desabilitar o botão durante a transição de rota, fornecendo feedback visual ao usuário.
 *
 * =====================================================================
 */
// src/components/ui/LanguageSwitcher.tsx
