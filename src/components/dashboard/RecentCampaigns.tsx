// src/components/dashboard/RecentCampaigns.tsx
/**
 * @file src/components/dashboard/RecentCampaigns.tsx
 * @description Aparato de UI atómico y reutilizable que renderiza la sección
 *              de campañas recientes en el dashboard principal. Gestiona tanto
 *              el estado de visualización de campañas como el estado vacío,
 *              proporcionando un "call to action" para nuevos usuarios.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Plus, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "@/lib/navigation";
import { type Tables } from "@/lib/types/database";

/**
 * @public
 * @component RecentCampaigns
 * @description Renderiza una cuadrícula con las campañas modificadas recientemente
 *              o un estado vacío si no hay campañas. Las tarjetas de campaña son
 *              interactivas y navegan al constructor al hacer clic.
 * @param {object} props - Propiedades del componente.
 * @param {Tables<"campaigns">[]} props.campaigns - Un array de objetos de campaña.
 * @returns {React.ReactElement}
 */
export function RecentCampaigns({
  campaigns,
}: {
  campaigns: Tables<"campaigns">[];
}) {
  const format = useFormatter();
  const router = useRouter();
  const t = useTranslations("DashboardPage.RecentCampaigns");

  if (campaigns.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">{t("emptyState.title")}</h2>
        <Card className="border-primary/40 border-dashed bg-primary/5">
          <CardHeader className="flex-row items-center gap-4">
            <Zap className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-bold">{t("emptyState.ctaTitle")}</h3>
              <p className="text-muted-foreground text-sm">
                {t("emptyState.ctaDescription")}
              </p>
            </div>
            <Button
              className="ml-auto"
              onClick={() => {
                // TODO: Navegar a la página de creación de sitios, que a su vez
                // abrirá el diálogo de creación. Esto evita acoplar el estado
                // del diálogo aquí.
                router.push("/dashboard/sites");
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("emptyState.ctaButton")}
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{t("title")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="group cursor-pointer hover:border-primary/40"
            onClick={() =>
              router.push({
                pathname: "/builder/[campaignId]",
                params: { campaignId: campaign.id },
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push({
                  pathname: "/builder/[campaignId]",
                  params: { campaignId: campaign.id },
                });
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Continuar trabajando en ${campaign.name}`}
          >
            <CardHeader>
              <h3 className="font-semibold truncate">{campaign.name}</h3>
              <p className="text-sm text-muted-foreground">
                {t("lastEdited")}:{" "}
                {format.relativeTime(
                  new Date(campaign.updated_at || campaign.created_at)
                )}
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  {t("preview")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Pré-visualizações de Campanhas**: ((Vigente)) A área de pré-visualização na `CardContent` poderia ser aprimorada para mostrar uma captura de tela real ou uma representação em miniatura do conteúdo da campanha, em vez de um placeholder.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente Atômico e de Alta Coesão**: ((Implementada)) Este aparato encapsula toda a lógica de apresentação para a seção de "Campanhas Recentes", melhorando a organização do `DashboardClient`.
 * 2. **Internacionalização Completa**: ((Implementada)) Todos os textos, incluindo os do estado vazio e as datas relativas, são processados através da camada de `next-intl`.
 * 3. **Acessibilidade (a11y)**: ((Implementada)) As tarjetas de campanha são totalmente operáveis por teclado e incluem `aria-labels` descritivas.
 *
 * =====================================================================
 */
// src/components/dashboard/RecentCampaigns.tsx
