// src/app/[locale]/layout.tsx
/**
 * @file src/app/[locale]/layout.tsx
 * @description Layout Canónico de Contexto y Estilo. Ha sido refactorizado
 *              para utilizar rutas de importación absolutas y alinearse con la
 *              estructura de proyecto canónica.
 * @author L.I.A. Legacy
 * @version 10.0.0 (Canonical Project Structure)
 */
import React from "react";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { ThemeProvider } from "@/components/ThemeProvider";
import { locales } from "@/lib/navigation";
import "@/app/globals.css";
import "@/app/theme-variables.css";

export const metadata: Metadata = {
  title: "Metashark - Plataforma de Marketing de Afiliados",
  description:
    "Crea, gestiona y optimiza tus campañas de marketing de afiliados en minutos.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

/**
 * Genera los parámetros estáticos para los locales.
 * @returns {Array<{ locale: string }>} Un array de objetos con los locales soportados.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Layout principal de la aplicación que envuelve las páginas localizadas.
 * Configura los proveedores de contexto globales como `NextIntlClientProvider` y `ThemeProvider`.
 * @param props - Las props del layout.
 * @returns El elemento JSX del layout.
 */
export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Habilitar renderizado estático
  unstable_setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="bottom-right" />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Alinhamento Estrutural**: ((Implementada)) As importações de CSS foram atualizadas para caminhos absolutos e a importação de mensagens foi ajustada para o caminho relativo correto a partir de `src/app/[locale]`, garantindo a funcionalidade na nova estrutura.
 * 2. **Supressão de Hydration Warning**: ((Implementada)) Foi adicionado `suppressHydrationWarning` à tag `<html>` como uma melhor prática recomendada pelo Next.js ao usar `next-themes`.
 *
 * @subsection Melhorias Futuras
 * 1. **Componente `ThemeProvider` Pendente**: ((Vigente)) Este layout depende do componente `ThemeProvider`, que ainda não foi migrado. Será o próximo passo lógico.
 * 2. **Configuração `navigation` Pendente**: ((Vigente)) A constante `locales` é importada de `lib/navigation`, que precisa ser migrada.
 *
 * =====================================================================
 */
// src/app/[locale]/layout.tsx
