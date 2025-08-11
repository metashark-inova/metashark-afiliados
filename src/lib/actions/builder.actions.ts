// src/lib/actions/builder.actions.ts
/**
 * @file src/lib/actions/builder.actions.ts
 * @description Contiene las Server Actions específicas del constructor de campañas.
 *              Este aparato es responsable de la persistencia del contenido de las
 *              campañas, implementando una lógica de autorización robusta para
 *              garantizar que solo los usuarios con permisos puedan modificar los datos.
 *              También implementa la revalidación de caché bajo demanda para la
 *              estrategia de renderizado ISR de las páginas públicas.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use server";
import "server-only";

import { revalidatePath } from "next/cache";

import { type CampaignConfig } from "@/lib/builder/types.d";
import { campaigns as campaignsData } from "@/lib/data";
import { logger } from "@/lib/logging";
import { createClient } from "@/lib/supabase/server";
import { type Json } from "@/lib/types/database";
import { type ActionResult } from "@/lib/validators";

import { createAuditLog } from "./_helpers";

/**
 * @public
 * @async
 * @function updateCampaignContentAction
 * @description Actualiza el contenido JSON (`content`) de una campaña específica en la base de datos.
 *              Antes de realizar la mutación, valida rigurosamente que el usuario autenticado
 *              tenga permisos para editar la campaña solicitada. Si la actualización es exitosa,
 *              invalida la caché de la página pública correspondiente para que los cambios
 *              se reflejen (estrategia On-Demand ISR).
 * @param {string} campaignId - El ID de la campaña a actualizar.
 * @param {CampaignConfig} content - El nuevo objeto de configuración de la campaña, que se
 *                                   almacenará en la columna `content` de tipo `jsonb`.
 * @returns {Promise<ActionResult<void>>} El resultado de la operación.
 */
export async function updateCampaignContentAction(
  campaignId: string,
  content: CampaignConfig
): Promise<ActionResult<void>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "No autenticado." };
  }

  // Se delega la lógica de autorización a la capa de datos, que ya contiene
  // la verificación de permisos.
  const campaignData = await campaignsData.getCampaignContentById(
    campaignId,
    user.id
  );

  if (!campaignData) {
    logger.warn(
      `[SEGURIDAD] VIOLACIÓN DE ACCESO: Usuario ${user.id} intentó guardar la campaña ${campaignId} sin permisos.`
    );
    return {
      success: false,
      error: "Acceso denegado. No tienes permiso para editar esta campaña.",
    };
  }

  logger.trace(
    `[BuilderActions] Usuario ${user.id} autorizado para guardar la campaña ${campaignId}.`
  );

  const { error } = await supabase
    .from("campaigns")
    .update({
      content: content as unknown as Json,
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId);

  if (error) {
    logger.error(
      `[BuilderActions] Error al guardar campaña ${campaignId}:`,
      error
    );
    return { success: false, error: "No se pudo guardar la campaña." };
  }

  await createAuditLog("campaign_content_updated", {
    userId: user.id,
    targetEntityId: campaignId,
    targetEntityType: "campaign",
    metadata: { campaignName: content.name },
  });

  // Revalidación de ISR Bajo Demanda
  const { slug } = campaignData;
  const subdomain = campaignData.sites?.subdomain;

  if (subdomain && slug) {
    const path = `/s/${subdomain}/${slug}`;
    revalidatePath(path);
    logger.info(`[BuilderActions] Revalidated path for ISR: ${path}`);
  } else {
    logger.warn(
      `[BuilderActions] No se pudo revalidar la ruta. Faltan datos para la campaña ${campaignId}.`,
      { subdomain, slug }
    );
  }

  return { success: true, data: undefined };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Validação de Conteúdo com Zod**: ((Vigente)) Antes de guardar, o objeto `content` deve ser validado contra um `CampaignConfigSchema` de Zod para assegurar a integridade da estrutura JSON, prevenindo a persistência de dados malformados.
 * 2. **Versionamento de Campanhas**: ((Vigente)) Em vez de sobrescrever o campo `content`, poderia-se guardar um histórico de versões em uma tabela `campaign_versions`, permitindo ao usuário reverter a estados anteriores.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Persistência do Construtor**: ((Implementada)) Esta ação fornece a funcionalidade de backend essencial para o construtor de campanhas, permitindo aos usuários salvar seu trabalho.
 * 2. **Revalidação Sob Demanda (ISR)**: ((Implementada)) A ação invoca `revalidatePath` após um salvamento bem-sucedido, purgando a cache da página pública do usuário na rede Edge da Vercel. Esta é a peça chave para a estratégia de renderização de elite.
 * 3. **Segurança por Delegação**: ((Implementada)) A lógica de autorização é delegada à camada de dados (`campaignsData.getCampaignContentById`), que já contém a verificação de permissões, aderindo ao princípio DRY.
 *
 * =====================================================================
 */
// src/lib/actions/builder.actions.ts
