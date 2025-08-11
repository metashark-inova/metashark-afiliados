// src/lib/hooks/use-realtime-invitations.ts
/**
 * @file src/lib/hooks/use-realtime-invitations.ts
 * @description Hook de React para gestionar y suscribirse a las invitaciones
 *              pendientes de un usuario en tiempo real. Utiliza las capacidades
 *              de "Realtime" de Supabase para escuchar cambios en la base de
 *              datos y actualizar la UI sin necesidad de recargar la página.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

/**
 * @public
 * @typedef {object} InvitationPayload
 * @description Define la estructura esperada de una invitación, tanto la que se
 *              recibe del servidor como la que se actualiza en tiempo real.
 */
type InvitationPayload = {
  id: string;
  status: string;
  workspaces: {
    name: string;
    icon: string | null;
  } | null;
};

/**
 * @public
 * @exports useRealtimeInvitations
 * @description Un hook que gestiona las invitaciones pendientes, actualizándose en tiempo real.
 *              Se suscribe al canal de Supabase Realtime para el usuario actual y escucha
 *              nuevas inserciones en la tabla `invitations`.
 * @param {User} user - El objeto del usuario autenticado.
 * @param {InvitationPayload[]} serverInvitations - La lista inicial de invitaciones cargadas desde el servidor.
 * @returns {InvitationPayload[]} La lista de invitaciones actualizada.
 */
export const useRealtimeInvitations = (
  user: User,
  serverInvitations: InvitationPayload[]
) => {
  const [invitations, setInvitations] =
    useState<InvitationPayload[]>(serverInvitations);
  const router = useRouter();

  useEffect(() => {
    // Asegurarse de que el hook solo se ejecute si hay un usuario.
    if (!user) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`realtime-invitations:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "invitations",
          filter: `invitee_email=eq.${user.email}`,
        },
        (payload) => {
          toast.success(`¡Tienes una nueva invitación!`);
          // La estrategia más robusta es forzar una recarga de los datos
          // del servidor. Esto asegura que la UI se sincronice con la
          // fuente de verdad (la base de datos) y obtenga todos los datos
          // relacionados (como el nombre del workspace).
          router.refresh();
        }
      )
      .subscribe();

    // Función de limpieza para desuscribirse del canal cuando el componente se desmonte.
    // Esto es CRÍTICO para prevenir fugas de memoria y conexiones de websocket innecesarias.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, router]);

  // Sincroniza el estado local si las props del servidor cambian
  // (por ejemplo, después de un `router.refresh()`).
  useEffect(() => {
    setInvitations(serverInvitations);
  }, [serverInvitations]);

  return invitations;
};

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Actualizaciones y Eliminaciones**: ((Vigente)) O hook atualmente só escuta por eventos de `INSERT`. Poderia ser expandido para também escutar eventos de `UPDATE` (ex: uma
 *    invitação foi revogada) e `DELETE`, atualizando a UI de acordo.
 * 2. **Feedback Mais Detalhado**: ((Vigente)) O payload do evento de tempo real contém os dados da nova linha (`payload.new`). O toast de notificação poderia ser enriquecido para incluir o nome do workspace da nova
 *    invitação (`payload.new.workspace_id` necessitaria de uma consulta adicional ou join).
 *
 * @subsection Melhorias Adicionadas
 * 1. **Experiência em Tempo Real**: ((Implementada)) Este hook fornece a base para uma das características de UX mais avançadas da plataforma: as notificações de convite em tempo real, melhorando drasticamente a colaboração.
 * 2. **Gerenciamento de Ciclo de Vida**: ((Implementada)) O hook gerencia corretamente a subscrição e a limpeza do canal do Supabase Realtime, garantindo um comportamento eficiente e livre de vazamentos de memória.
 * 3. **Estratégia de Sincronização Robusta**: ((Implementada)) Utiliza `router.refresh()` como estratégia de sincronização, que é a abordagem mais robusta e recomendada para garantir a consistência dos dados entre o cliente e o servidor.
 *
 * =====================================================================
 */
// src/lib/hooks/use-realtime-invitations.ts
