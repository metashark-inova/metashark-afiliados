// src/lib/context/DashboardContext.tsx
/**
 * @file src/lib/context/DashboardContext.tsx
 * @description Proveedor de contexto para compartir datos globales a través de
 *              todos los componentes del dashboard (sesión de usuario, workspaces,
 *              invitaciones, módulos de funcionalidades). Este aparato es la
 *              fuente de verdad para el estado del layout del lado del cliente.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type User } from "@supabase/supabase-js";

import { type FeatureModule } from "@/lib/data/modules";
import { type Tables } from "@/lib/types/database";

type Workspace = Tables<"workspaces">;

/**
 * @public
 * @typedef Invitation
 * @description Define el contrato de datos para una invitación pendiente,
 *              tal como se consume en el contexto de la UI.
 */
type Invitation = {
  id: string;
  status: string;
  workspaces: { name: string; icon: string | null } | null;
};

/**
 * @public
 * @interface DashboardContextProps
 * @description Define la forma de los datos globales compartidos en el contexto del dashboard.
 *              Este contrato es la SSoT para el estado del layout del lado del cliente.
 */
export interface DashboardContextProps {
  user: User;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  pendingInvitations: Invitation[];
  modules: FeatureModule[];
}

const DashboardContext = createContext<DashboardContextProps | undefined>(
  undefined
);

/**
 * @public
 * @component DashboardProvider
 * @description Proveedor de React Context que hace que los datos globales del dashboard
 *              estén disponibles para todos sus componentes hijos.
 * @param {object} props
 * @param {ReactNode} props.children - Los componentes hijos que consumirán el contexto.
 * @param {DashboardContextProps} props.value - Los datos a proveer.
 * @returns {React.ReactElement}
 */
export const DashboardProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: DashboardContextProps;
}) => {
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * @public
 * @exports useDashboard
 * @description Hook personalizado para acceder de forma segura al `DashboardContext`.
 *              Asegura que el hook se utilice dentro de un `DashboardProvider`,
 *              lanzando un error en tiempo de desarrollo si no es así.
 * @throws {Error} Si se usa fuera de un `DashboardProvider`.
 * @returns {DashboardContextProps} Los datos compartidos del dashboard.
 */
export const useDashboard = (): DashboardContextProps => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "Error de Arquitectura: useDashboard debe ser utilizado dentro de un DashboardProvider."
    );
  }
  return context;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Otimização de Re-renderização**: ((Vigente)) Para dashboards muito complexos, se certas partes do contexto (`pendingInvitations`, por exemplo) mudarem com frequência, poderíamos dividir o `DashboardContext` em múltiplos contextos mais granulares (ex: `SessionContext`, `WorkspaceContext`) para evitar re-renderizações desnecessárias em componentes que não dependem desses dados específicos.
 *
 * @subsection Melhorias Adicionadas
 * 1. **Resolução de Dependência Crítica**: ((Implementada)) A reconstrução deste aparato resolve os erros `TS2307` em `WorkspaceSwitcher.tsx` e `useSitesPage.ts`, desbloqueando a migração da UI do dashboard.
 * 2. **Fonte de Verdade do Cliente**: ((Implementada)) Este contexto estabelece a fonte de verdade canônica para o estado do lado do cliente em todo o dashboard, garantindo a consistência dos dados em toda a UI.
 * 3. **Segurança de Consumo**: ((Implementada)) O hook `useDashboard` inclui uma verificação de erro em tempo de desenvolvimento que garante que ele seja sempre consumido corretamente, prevenindo bugs e melhorando a experiência do desenvolvedor.
 *
 * =====================================================================
 */
// src/lib/context/DashboardContext.tsx
