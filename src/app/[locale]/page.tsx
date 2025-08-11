// src/app/[locale]/page.tsx
/**
 * @file src/app/[locale]/page.tsx
 * @description Página de Inicio Pública (Landing Page). Este Server Component
 *              actúa como el punto de entrada principal para usuarios no autenticados.
 *              En su estado inicial de reconstrucción, contiene la lógica de sesión
 *              esencial y un contenido mínimo para permitir el primer renderizado
 *              de la aplicación.
 * @author L.I.A. Legacy
 * @version 1.0.0 (Minimum Viable Render)
 */
import { redirect } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { createClient } from "@/lib/supabase/server";

/**
 * @public
 * @async
 * @component HomePage
 * @description Renderiza la página de inicio. Verifica si existe una sesión de
 *              usuario activa y, en caso afirmativo, redirige inmediatamente al
 *              dashboard. De lo contrario, renderiza el contenido de la landing page.
 * @param {object} props
 * @param {{ locale: string }} props.params - Parámetros de la ruta, incluyendo el locale.
 * @returns {Promise<JSX.Element>}
 */
export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<JSX.Element> {
  // Habilita el renderizado estático para esta ruta, crucial para el rendimiento.
  unstable_setRequestLocale(locale);

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si el usuario ya está autenticado, no se muestra la landing page.
  if (session) {
    redirect("/dashboard");
  }

  const t = await getTranslations("HeroSection");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="flex-1 text-center p-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-6 max-w-[700px] text-muted-foreground md:text-xl">
          {t("subtitle")}
        </p>
        <p className="mt-8 text-sm text-primary animate-pulse">
          [Renderizado Mínimo: Componentes de UI pendientes de reconstrucción]
        </p>
      </main>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Composição Completa da UI**: ((Vigente)) O conteúdo principal deste componente será a orquestração dos componentes `LandingHeader`, `Hero`, `Features` e `LandingFooter`. Sua implementação completa depende da reconstrução desses aparatos.
 * 2. **Carga de Conteúdo de um CMS**: ((Vigente)) Para máxima flexibilidade, os textos e dados para os componentes da landing page poderiam ser carregados de um CMS headless em vez de estarem nos arquivos de mensagens.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Ponto de Entrada da Aplicação**: ((Implementada)) A reconstrução deste aparato estabelece o ponto de entrada principal para os usuários, completando o fluxo mínimo necessário para que a aplicação seja executável.
 * 2. **Lógica de Sessão Essencial**: ((Implementada)) Contém a lógica crítica de redirecionamento para usuários já autenticados, garantindo a UX correta desde o início.
 * 3. **Pronto para Renderização Estática**: ((Implementada)) A inclusão de `unstable_setRequestLocale` prepara a página para uma otimização de desempenho de elite via Geração de Site Estático (SSG).
 *
 * =====================================================================
 */
// src/app/[locale]/page.tsx
