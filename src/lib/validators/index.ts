// src/lib/validators/index.ts
/**
 * @file validators/index.ts
 * @description Manifiesto de Validadores. Ha sido refactorizado para separar los
 *              esquemas de cliente y servidor, resolviendo un conflicto de tipos
 *              entre `react-hook-form` y las transformaciones de Zod.
 * @author Metashark (Refactorizado por L.I.A Legacy)
 * @version 15.0.0 (Client/Server Schema Separation)
 */
import { z } from "zod";

import { keysToSnakeCase } from "@/lib/helpers/object-case-converter";

export * from "./i18n.schema";

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

const UuidSchema = z.string().uuid("ID inválido.");
const NameSchema = z
  .string({ required_error: "El nombre es requerido." })
  .trim()
  .min(3, "El nombre debe tener al menos 3 caracteres.");
const SubdomainSchema = z
  .string()
  .trim()
  .min(3, "El subdominio debe tener al menos 3 caracteres.")
  .regex(
    /^[a-z0-9-]+$/,
    "Solo se permiten letras minúsculas, números y guiones."
  )
  .transform((subdomain) => subdomain.toLowerCase());
export const EmailSchema = z
  .string()
  .trim()
  .email("Por favor, introduce un email válido.");
export const PasswordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.");
const slugify = (text: string): string => {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrssssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(p, (c) => b.charAt(a.indexOf(c)))
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/-+$/, "");
};

export const SignUpSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});
export const SignInSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "La contraseña es requerida."),
});
export type RequestPasswordResetState = { error: string | null };

export const CreateSiteClientSchema = z.object({
  name: NameSchema.optional(),
  subdomain: SubdomainSchema,
  description: z.string().optional(),
  workspaceId: UuidSchema,
});

export const CreateSiteServerSchema = CreateSiteClientSchema.transform(
  (data) => ({
    ...data,
    name: data.name || data.subdomain,
    description: data.description || null,
    icon: null,
  })
).transform(keysToSnakeCase);

export const UpdateSiteSchema = z
  .object({
    siteId: UuidSchema,
    name: NameSchema.optional(),
    subdomain: SubdomainSchema.optional(),
    description: z.string().optional(),
  })
  .transform(keysToSnakeCase);

export const DeleteSiteSchema = z.object({ siteId: UuidSchema });

export const CreateWorkspaceSchema = z
  .object({
    workspaceName: NameSchema,
    icon: z.string().trim().min(1, "El ícono es requerido."),
  })
  .transform(keysToSnakeCase);

export const InvitationClientSchema = z.object({
  email: EmailSchema,
  role: z.enum(["admin", "member", "owner"]),
  workspaceId: UuidSchema,
});

export const InvitationServerSchema = InvitationClientSchema.transform(
  (data) => ({
    invitee_email: data.email,
    role: data.role,
    workspace_id: data.workspaceId,
  })
);

export const CreateCampaignSchema = z
  .object({
    name: NameSchema,
    slug: z
      .string()
      .trim()
      .min(3, "El slug debe tener al menos 3 caracteres.")
      .regex(/^[a-z0-9-]+$/, "Solo se permiten minúsculas, números y guiones.")
      .optional(),
    siteId: UuidSchema,
  })
  .transform((data) => ({ ...data, slug: data.slug || slugify(data.name) }))
  .transform(keysToSnakeCase);

export const DeleteCampaignSchema = z.object({ campaignId: UuidSchema });

export const ClientVisitSchema = z.object({
  sessionId: UuidSchema,
  fingerprint: z.string().min(1, "Fingerprint es requerido."),
  screenWidth: z.number().int().positive().optional(),
  screenHeight: z.number().int().positive().optional(),
  userAgentClientHint: z
    .array(z.object({ brand: z.string(), version: z.string() }))
    .nullable()
    .optional(),
});

export const VisitorLogSchema = z.object({
  session_id: UuidSchema,
  fingerprint: z.string().min(1, "Fingerprint es requerido."),
  ip_address: z.string().ip("Dirección IP inválida."),
  geo_data: z.record(z.any()).nullable().optional(),
  user_agent: z.string().nullable().optional(),
  utm_params: z.record(z.any()).nullable().optional(),
  referrer: z.string().url().nullable().optional(),
  landing_page: z.string().nullable().optional(),
  browser_context: z.record(z.any()).nullable().optional(),
  is_bot: z.boolean().optional(),
  is_known_abuser: z.boolean().optional(),
});

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **SSoT de Validação**: ((Implementada)) Este arquivo centraliza toda a lógica de validação, servindo como uma SSoT para o formato dos dados em toda a aplicação.
 * 2. **Padrão Cliente/Servidor**: ((Implementada)) A separação de esquemas resolve um problema arquitetônico complexo de forma elegante, permitindo validações no cliente sem transformações e preparando os dados para o servidor.
 *
 * @subsection Melhorias Futuras
 * 1. **Helper `keysToSnakeCase` Pendente**: ((Vigente)) Este arquivo depende do helper `keysToSnakeCase` de `lib/helpers/object-case-converter.ts`, que precisará ser migrado.
 *
 * =====================================================================
 */
// src/lib/validators/index.ts
