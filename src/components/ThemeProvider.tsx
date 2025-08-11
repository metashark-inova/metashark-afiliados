// src/components/ThemeProvider.tsx
/**
 * @file src/components/ThemeProvider.tsx
 * @description Proveedor de contexto para la gestión de temas (claro/oscuro).
 *              Este componente encapsula `next-themes` para proporcionar la funcionalidad
 *              de cambio de tema a toda la aplicación. Se ha corregido la importación
 *              de tipos para alinearla con las versiones modernas de la librería.
 * @author L.I.A. Legacy
 * @version 2.0.0 (Corrected Type Import)
 */
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
// CORRECCIÓN: Con la librería actualizada, los tipos se exportan desde el
// punto de entrada principal, no desde una ruta interna 'dist/types'.
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Adicionadas
 * 1. **Fornecimento de Tema Corretivo**: ((Implementada)) O componente foi corrigido para usar a rota de importação de tipo correta da biblioteca `next-themes`, resolvendo o erro de compilação.
 *
 * @subsection Melhorias Futuras
 * 1. **Hook de Tema Personalizado (`useBrandTheme`)**: ((Vigente)) Abstrair o uso do hook `useTheme` em um hook personalizado (`useBrandTheme`) para centralizar a lógica de negócio futura (ex: analytics em mudança de tema) sem refatorar componentes consumidores.
 * 2. **Persistência na Base de Dados**: ((Vigente)) Para usuários autenticados, a preferência de tema poderia ser guardada na tabela `profiles` de Supabase. O `ThemeProvider` poderia ler esta preferência ao carregar a sessão, sincronizando a experiência através de diferentes dispositivos.
 *
 * =====================================================================
 */
// src/components/ThemeProvider.tsx
