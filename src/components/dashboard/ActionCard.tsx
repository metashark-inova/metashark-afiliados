// src/components/dashboard/ActionCard.tsx
/**
 * @file src/components/dashboard/ActionCard.tsx
 * @description Aparato de UI atómico y reutilizable que representa una tarjeta de acción
 *              interactiva en el dashboard. Es un componente de presentación puro que
 *              recibe todo su contenido y estado a través de props. Se ha enriquecido
 *              con accesibilidad (a11y) y observabilidad.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardHeader } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { type FeatureModule } from "@/lib/data/modules";
import { logger } from "@/lib/logging";
import { useRouter } from "@/lib/navigation";

/**
 * @public
 * @component ActionCard
 * @description Renderiza una tarjeta arrastrable y clickeable que representa un módulo
 *              de funcionalidad. Al hacer clic, navega a la ruta especificada en el módulo.
 * @param {object} props - Propiedades del componente.
 * @param {FeatureModule} props.module - El objeto de datos del módulo a renderizar.
 * @param {boolean} [props.isPrimary=false] - Si es `true`, aplica un estilo destacado a la tarjeta.
 * @returns {React.ReactElement}
 */
export function ActionCard({
  module,
  isPrimary = false,
}: {
  module: FeatureModule;
  isPrimary?: boolean;
}) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  const handleCardClick = () => {
    if (module.href) {
      logger.trace(`[ActionCard] Navegando para o módulo '${module.title}'`, {
        href: module.href,
      });
      router.push(module.href as any);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Acessar ${module.title}`}
    >
      <Card
        className={`group h-full cursor-grab active:cursor-grabbing transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
          isPrimary
            ? "bg-primary/10 border-primary/40 hover:border-primary/80 hover:shadow-primary/20"
            : "bg-card hover:border-primary/40 hover:shadow-primary/10"
        }`}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                isPrimary ? "bg-primary/20" : "bg-muted"
              }`}
            >
              <DynamicIcon
                name={module.icon}
                className={`h-5 w-5 ${
                  isPrimary ? "text-primary" : "text-foreground"
                }`}
              />
            </div>
            <h3 className="text-md font-semibold">{module.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            {module.description}
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Tooltips Informativos**: ((Vigente)) Envolver a `Card` em um componente `<Tooltip>` que mostre o conteúdo da propriedade `module.tooltip` ao passar o cursor, fornecendo mais contexto ao usuário.
 * 2. **Indicador de Status**: ((Vigente)) Adicionar um pequeno indicador visual (ex: um ponto de cor) no canto da `Card` para refletir o `module.status` ('active', 'soon', 'locked'), comunicando visualmente a disponibilidade da funcionalidade.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Componente de Bloco de Construção**: ((Implementada)) A transcrição deste aparato fornece um bloco de construção fundamental para a UI do dashboard principal, permitindo a exibição de módulos de funcionalidades.
 * 2. **Acessibilidade (a11y)**: ((Implementada)) O componente foi aprimorado com `role="button"`, `tabIndex={0}`, `onKeyDown` e `aria-label` para garantir que seja totalmente operável via teclado e acessível para leitores de tela.
 * 3. **Observabilidade da Interação**: ((Implementada)) A função `handleCardClick` agora registra um log de `trace`, fornecendo visibilidade sobre as interações do usuário com os módulos do dashboard.
 *
 * =====================================================================
 */
// src/components/dashboard/ActionCard.tsx
