// src/lib/validators/i18n.schema.ts
/**
 * @file i18n.schema.ts
 * @description Manifiesto de Tipos y Única Fuente de Verdad (SSoT) para el contrato de
 *              internacionalización (i18n). Este aparato define la estructura
 *              completa y canónica de los archivos de mensajes (`messages/*.json`) utilizando
 *              Zod. Ha sido actualizado para incluir todos los namespaces del proyecto,
 *              consolidando su rol como el guardián de calidad automatizado.
 * @author L.I.A Legacy
 * @version 6.0.0 (Consolidated & Fully Synchronized)
 */
import { z } from "zod";

const AboutPageSchema = z.object({ title: z.string() });
const AdminDashboardSchema = z.object({
  headerTitle: z.string(),
  headerDescription: z.string(),
  welcomeMessage: z.string(),
  signOutButton: z.string(),
  created: z.string(),
  visitSubdomain: z.string(),
  deleteButton: z.string(),
  deleteSiteAriaLabel: z.string(),
  deleteDialog: z.object({
    title: z.string(),
    description: z.string(),
    confirmButton: z.string(),
  }),
  noSubdomains: z.object({ title: z.string(), description: z.string() }),
});
const AuthLayoutSchema = z.object({ go_back_home_aria: z.string() });
const AuthNoticePageSchema = z.object({
  confirmation: z.object({ title: z.string(), description: z.string() }),
  reset: z.object({ title: z.string(), description: z.string() }),
  default: z.object({ title: z.string(), description: z.string() }),
});
const BlogPageSchema = z.object({ title: z.string() });
const BreadcrumbsSchema = z.object({
  dashboard: z.string(),
  sites: z.string(),
  settings: z.string(),
  campaigns: z.string(),
  "dev-console": z.string(),
  users: z.string(),
  logs: z.string(),
});
const BridgepagesGalleryPageSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});
const BuilderPageSchema = z.object({
  Header: z.object({
    back_to_dashboard: z.string(),
    back_to_dashboard_aria: z.string(),
    preview_button: z.string(),
    preview_aria: z.string(),
    History: z.object({
      undo_tooltip: z.string(),
      undo_aria: z.string(),
      redo_tooltip: z.string(),
      redo_aria: z.string(),
    }),
    DevicePreview: z.object({
      desktop_tooltip: z.string(),
      tablet_tooltip: z.string(),
      mobile_tooltip: z.string(),
    }),
    SaveButton: z.object({
      save_changes: z.string(),
      save_aria: z.string(),
      saving: z.string(),
      saved: z.string(),
      save_success: z.string(),
      save_error_no_config: z.string(),
      save_error_default: z.string(),
    }),
  }),
  Palette: z.object({
    title: z.string(),
    unknown_block_preview: z.string(),
    block_name_Header1: z.string(),
    block_name_Hero1: z.string(),
  }),
  SettingsPanel: z.object({
    editing_block_title: z.string(),
    empty_panel: z.object({ title: z.string(), description: z.string() }),
    no_settings_for_block: z.object({
      title: z.string(),
      description: z.string(),
    }),
    unsupported_property_type: z.string(),
    tabs: z.object({ content: z.string(), style: z.string() }),
    properties: z.object({
      logoText: z.string(),
      ctaText: z.string(),
      title: z.string(),
      subtitle: z.string(),
      backgroundColor: z.string(),
      textColor: z.string(),
      paddingTop: z.string(),
      paddingBottom: z.string(),
      marginTop: z.string(),
      marginBottom: z.string(),
    }),
  }),
  Canvas: z.object({
    loading_config: z.string(),
    empty_canvas: z.object({ title: z.string(), description: z.string() }),
    unknown_block_error: z.string(),
  }),
  BlockActions: z.object({
    block_aria_label: z.string(),
    drag_handle_aria: z.string(),
    options_menu_aria: z.string(),
    move_up: z.string(),
    move_down: z.string(),
    duplicate: z.string(),
    delete: z.string(),
  }),
});
const CampaignsPageSchema = z.object({
  entityName: z.string(),
  pageTitle: z.string(),
  pageDescription: z.string(),
  backToSitesButton: z.string(),
  createCampaignButton: z.string(),
  createDialog: z.object({ title: z.string() }),
  deleteDialog: z.object({
    title: z.string(),
    description: z.string(),
    confirmButton: z.string(),
  }),
  search: z.object({ placeholder: z.string(), clear_aria: z.string() }),
  table: z.object({
    header_name: z.string(),
    header_slug: z.string(),
    header_lastUpdated: z.string(),
    header_actions: z.string(),
    action_edit: z.string(),
    action_delete_aria: z.string(),
    empty_state: z.string(),
  }),
  pagination: z.object({
    previous: z.string(),
    next: z.string(),
    page: z.string(),
  }),
  form_name_label: z.string(),
  form_name_placeholder: z.string(),
  form_creating_button: z.string(),
  form_create_button: z.string(),
  errorState: z.object({
    title: z.string(),
    description: z.string(),
  }),
});
const ChooseLanguagePageSchema = z.object({
  title: z.string(),
  selectFromListText: z.string(),
  redirectText: z.string(),
});
const ContactPageSchema = z.object({ title: z.string() });
const CookiePolicyPageSchema = z.object({ title: z.string() });
const DashboardHeaderSchema = z.object({
  mobile_openMenu_sr: z.string(),
  search_placeholder: z.string(),
  search_command: z.string(),
});
const DashboardPageSchema = z.object({
  error_title: z.string(),
  error_description: z.string(),
  tooltip: z.string(),
  welcomeMessage: z.string(),
  subtitle: z.string(),
  layoutSaveError: z.string(),
  RecentCampaigns: z.object({
    title: z.string(),
    emptyState: z.object({
      title: z.string(),
      ctaTitle: z.string(),
      ctaDescription: z.string(),
      ctaButton: z.string(),
    }),
    lastEdited: z.string(),
    preview: z.string(),
  }),
});
const DashboardSidebarSchema = z.object({
  dashboard: z.string(),
  mySites: z.string(),
  liaChat: z.string(),
  settings: z.string(),
  devConsole: z.string(),
  userMenu_accountSettings: z.string(),
  userMenu_support: z.string(),
  userMenu_signOut: z.string(),
});
const DevConsoleSchema = z.object({
  UserManagementTable: z.object({
    table_header: z.object({
      email: z.string(),
      full_name: z.string(),
      role: z.string(),
      actions: z.string(),
    }),
    search_placeholder: z.string(),
    clear_search_aria: z.string(),
    table_empty_state: z.string(),
    pagination: z.object({
      previousPageLabel: z.string(),
      nextPageLabel: z.string(),
      pageLabelTemplate: z.string(),
    }),
    role_update_success_toast: z.string(),
    role_update_error_toast: z.string(),
    impersonate_dialog: z.object({
      aria_label: z.string(),
      title: z.string(),
      description: z.string(),
      cancel_button: z.string(),
      confirm_button: z.string(),
      success_toast: z.string(),
      default_error_toast: z.string(),
    }),
  }),
  CampaignsTable: z.object({
    title: z.string(),
    description: z.string(),
    error_title: z.string(),
    error_description: z.string(),
    header_name: z.string(),
    header_site: z.string(),
    header_created: z.string(),
    header_updated: z.string(),
    header_actions: z.string(),
    action_view_json: z.string(),
    dialog_title: z.string(),
  }),
  TelemetryTable: z.object({
    title: z.string(),
    description: z.string(),
    error_title: z.string(),
    error_description: z.string(),
    header_timestamp: z.string(),
    header_user_session: z.string(),
    header_ip_country: z.string(),
    header_fingerprint: z.string(),
    header_actions: z.string(),
    action_view_geo: z.string(),
    action_view_utms: z.string(),
    empty_state: z.string(),
    dialog_title_geo: z.string(),
    dialog_title_utms: z.string(),
  }),
});
const DevConsoleSidebarSchema = z.object({
  overview: z.string(),
  userManagement: z.string(),
  campaignViewer: z.string(),
  telemetry: z.string(),
  auditLogs: z.string(),
  routeViewer: z.string(),
  loadingRoutes: z.string(),
  signOut: z.string(),
});
const DialogsSchema = z.object({
  generic_cancelButton: z.string(),
});
const DisclaimerPageSchema = z.object({ title: z.string() });
const DocsPageSchema = z.object({ title: z.string() });
const FeaturesSectionSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  features: z.object({
    builder: z.object({ title: z.string(), description: z.string() }),
    copywriter: z.object({ title: z.string(), description: z.string() }),
    analytics: z.object({ title: z.string(), description: z.string() }),
    assistant: z.object({ title: z.string(), description: z.string() }),
  }),
});
const ForgotPasswordPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  emailLabel: z.string(),
  submitButton: z.string(),
  sendingButton: z.string(),
});
const HeroSectionSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  ctaPrimary: z.string(),
  ctaSecondary: z.string(),
});
const InvitationBellSchema = z.object({
  view_invitations_sr: z.string(),
  pending_invitations_label: z.string(),
  invitation_text: z.string(),
  no_pending_invitations: z.string(),
  accept_invitation_success: z.string(),
  accept_invitation_error: z.string(),
});
const LandingFooterSchema = z.object({
  slogan: z.string(),
  product: z.string(),
  company: z.string(),
  contact: z.string(),
  stayUpdated: z.string(),
  newsletterPrompt: z.string(),
  subscribe: z.string(),
  allRightsReserved: z.string(),
});
const LandingHeaderSchema = z.object({
  features: z.string(),
  pricing: z.string(),
  signIn: z.string(),
  signUp: z.string(),
  openMenu: z.string(),
});
const LandingsGalleryPageSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});
const LanguageSwitcherSchema = z.object({
  selectLanguage_sr: z.string(),
  language_en_US: z.string(),
  flag_en_US: z.string(),
  language_es_ES: z.string(),
  flag_es_ES: z.string(),
  language_pt_BR: z.string(),
  flag_pt_BR: z.string(),
});
const LegalNoticePageSchema = z.object({ title: z.string() });
const LoginPageSchema = z.object({
  metadataTitle: z.string(),
  title: z.string(),
  subtitle: z.string(),
  emailLabel: z.string(),
  passwordLabel: z.string(),
  signInButton: z.string(),
  signInButton_pending: z.string(),
  signInWith: z.string(),
  dontHaveAccount: z.string(),
  alreadyHaveAccount: z.string(),
});
const PrivacyPolicyPageSchema = z.object({ title: z.string() });
const PublicSitePageSchema = z.object({
  metadata: z.object({
    notFoundTitle: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  welcomeMessage: z.string(),
  customPageDescription: z.string(),
});
const ResetPasswordPageSchema = z.object({
  title: z.string(),
  newPasswordLabel: z.string(),
  confirmPasswordLabel: z.string(),
  submitButton: z.string(),
});
const SignUpPageSchema = z.object({
  metadataTitle: z.string(),
  title: z.string(),
  subtitle: z.string(),
  signUpButton: z.string(),
  signUpButton_pending: z.string(),
  signUpWith: z.string(),
});
const SitesPageSchema = z.object({
  entityName: z.string(),
  header_title: z.string(),
  header_description: z.string(),
  search_placeholder: z.string(),
  clear_search_aria: z.string(),
  createSite_button: z.string(),
  createSiteDialog_title: z.string(),
  form_name_label: z.string(),
  form_name_placeholder: z.string(),
  form_subdomain_label: z.string(),
  subdomain_in_use_error: z.string(),
  form_description_label: z.string(),
  form_description_placeholder: z.string(),
  form_creating_button: z.string(),
  form_create_button: z.string(),
  emptyState_title: z.string(),
  emptyState_description: z.string(),
  campaignCount: z.string(),
  manageCampaigns_button: z.string(),
  delete_site_aria_label: z.string(),
  open_site_aria_label: z.string(),
  popover_title: z.string(),
  popover_description: z.string(),
  deleteDialog_title: z.string(),
  deleteDialog_description: z.string(),
  deleteDialog_confirmButton: z.string(),
  errorState: z.object({ title: z.string(), description: z.string() }),
  pagination: z.object({
    previous: z.string(),
    next: z.string(),
    page: z.string(),
  }),
});
const SmartLinkSchema = z.object({});
const SupportPageSchema = z.object({ title: z.string() });
const TermsOfServicePageSchema = z.object({ title: z.string() });
const UnauthorizedPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  back_to_dashboard_button: z.string(),
});
const WikiPageSchema = z.object({ title: z.string() });
const WorkspaceSwitcherSchema = z.object({
  selectWorkspace_label: z.string(),
  search_placeholder: z.string(),
  empty_results: z.string(),
  createWorkspace_button: z.string(),
  inviteMember_button: z.string(),
  inviteMember_description: z.string(),
  workspaceSettings_button: z.string(),
  changing_status: z.string(),
  onboarding_title: z.string(),
  onboarding_welcome_title: z.string(),
  onboarding_welcome_description: z.string(),
  create_form: z.object({
    name_label: z.string(),
    name_placeholder: z.string(),
    icon_label: z.string(),
    icon_placeholder: z.string(),
    creating_button: z.string(),
    create_button: z.string(),
    success_toast: z.string(),
  }),
  invite_form: z.object({
    email_label: z.string(),
    email_placeholder: z.string(),
    role_label: z.string(),
    role_placeholder: z.string(),
    role_member: z.string(),
    role_admin: z.string(),
    sending_button: z.string(),
    send_button: z.string(),
  }),
});

/**
 * @const i18nSchema
 * @description Ensambla el schema global a partir de los schemas atómicos de namespace.
 *              Es la única fuente de verdad para la estructura de todos los archivos de mensajes.
 */
export const i18nSchema = z.object({
  AboutPage: AboutPageSchema,
  AdminDashboard: AdminDashboardSchema,
  AuthLayout: AuthLayoutSchema,
  AuthNoticePage: AuthNoticePageSchema,
  BlogPage: BlogPageSchema,
  Breadcrumbs: BreadcrumbsSchema,
  BridgepagesGalleryPage: BridgepagesGalleryPageSchema,
  BuilderPage: BuilderPageSchema,
  CampaignsPage: CampaignsPageSchema,
  ChooseLanguagePage: ChooseLanguagePageSchema,
  ContactPage: ContactPageSchema,
  CookiePolicyPage: CookiePolicyPageSchema,
  DashboardHeader: DashboardHeaderSchema,
  DashboardPage: DashboardPageSchema,
  DashboardSidebar: DashboardSidebarSchema,
  DevConsole: DevConsoleSchema,
  DevConsoleSidebar: DevConsoleSidebarSchema,
  Dialogs: DialogsSchema,
  DisclaimerPage: DisclaimerPageSchema,
  DocsPage: DocsPageSchema,
  FeaturesSection: FeaturesSectionSchema,
  ForgotPasswordPage: ForgotPasswordPageSchema,
  HeroSection: HeroSectionSchema,
  InvitationBell: InvitationBellSchema,
  LandingFooter: LandingFooterSchema,
  LandingHeader: LandingHeaderSchema,
  LandingsGalleryPage: LandingsGalleryPageSchema,
  LanguageSwitcher: LanguageSwitcherSchema,
  LegalNoticePage: LegalNoticePageSchema,
  LoginPage: LoginPageSchema,
  PrivacyPolicyPage: PrivacyPolicyPageSchema,
  PublicSitePage: PublicSitePageSchema,
  ResetPasswordPage: ResetPasswordPageSchema,
  SignUpPage: SignUpPageSchema,
  SitesPage: SitesPageSchema,
  SmartLink: SmartLinkSchema,
  SupportPage: SupportPageSchema,
  TermsOfServicePage: TermsOfServicePageSchema,
  UnauthorizedPage: UnauthorizedPageSchema,
  WikiPage: WikiPageSchema,
  WorkspaceSwitcher: WorkspaceSwitcherSchema,
});

export type MessagesType = z.infer<typeof i18nSchema>;

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Guardião de Qualidade de i18n**: ((Implementada)) Este esquema Zod atua como um guardião automatizado que pode ser usado em testes de integração para validar todos os arquivos de mensagens, prevenindo regressões e inconsistências.
 *
 * @subsection Melhorias Futuras
 * 1. **Script de Validação de Contrato**: ((Vigente)) Criar um teste de integração (`tests/integration/i18n/contract.test.ts`) que importe este esquema e todos os arquivos `.json` de `messages/` e valide que eles cumprem o contrato. Este teste deve ser executado no pipeline de CI.
 *
 * =====================================================================
 */
// src/lib/validators/i18n.schema.ts
