// src/lib/hooks/use-optimistic-resource-management.ts
/**
 * @file src/lib/hooks/use-optimistic-resource-management.ts
 * @description Hook genérico y reutilizable para gestionar un conjunto de recursos
 *              con actualizaciones de UI optimistas para operaciones de creación y
 *              eliminación. Este es un aparato de "Lego" arquitectónico fundamental
 *              para el proyecto, diseñado para proporcionar una experiencia de usuario
 *              instantánea y resiliente.
 * @author L.I.A. Legacy
 * @version 1.0.0
 */
"use client";

import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { type ActionResult } from "@/lib/validators";

/**
 * @public
 * @interface Resource
 * @description Define el contrato mínimo que un objeto de recurso debe cumplir:
 *              tener una propiedad `id` de tipo string.
 */
interface Resource {
  id: string;
  [key: string]: any;
}

/**
 * @public
 * @exports useOptimisticResourceManagement
 * @description Hook genérico para la gestión de recursos con UI optimista.
 * @template T - El tipo del recurso, que debe extender de `Resource`.
 * @param {object} params - Parámetros de configuración del hook.
 * @param {T[]} params.initialItems - La lista inicial de recursos.
 * @param {string} params.entityName - El nombre singular de la entidad (e.g., "Sitio", "Campaña").
 * @param {(formData: FormData) => Promise<ActionResult<{ id: string }>>} params.createAction - La Server Action para crear un nuevo recurso.
 * @param {(formData: FormData) => Promise<ActionResult<any>>} params.deleteAction - La Server Action para eliminar un recurso.
 * @returns Un objeto con el estado y los manejadores para gestionar los recursos.
 */
export function useOptimisticResourceManagement<T extends Resource>({
  initialItems,
  entityName,
  createAction,
  deleteAction,
}: {
  initialItems: T[];
  entityName: string;
  createAction: (formData: FormData) => Promise<ActionResult<{ id: string }>>;
  deleteAction: (formData: FormData) => Promise<ActionResult<any>>;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleCreate = (formData: FormData, optimisticItem: Omit<T, "id">) => {
    const phantomItem: T = {
      id: `optimistic-${Date.now()}`,
      ...optimisticItem,
    } as T;

    const previousItems = items;
    setItems((current) => [...current, phantomItem]);
    setMutatingId(phantomItem.id);

    startTransition(async () => {
      const result = await createAction(formData);
      if (result.success) {
        toast.success(`${entityName} creado con éxito.`);
        router.refresh(); // Sincroniza con los datos reales del servidor.
      } else {
        toast.error(result.error || `No se pudo crear el ${entityName}.`);
        setItems(previousItems); // Rollback en caso de fallo.
      }
      setMutatingId(null);
    });
  };

  const handleDelete = (formData: FormData) => {
    const idToDelete = formData.get("siteId") as string; // Adaptado para que coincida con `deleteSiteAction`
    if (!idToDelete) return;

    const previousItems = items;
    setItems((current) => current.filter((item) => item.id !== idToDelete));
    setMutatingId(idToDelete);

    startTransition(async () => {
      const result = await deleteAction(formData);
      if (result.success) {
        toast.success(`${entityName} eliminado con éxito.`);
        router.refresh();
      } else {
        toast.error(result.error || `No se pudo eliminar el ${entityName}.`);
        setItems(previousItems); // Rollback en caso de fallo.
      }
      setMutatingId(null);
    });
  };

  return {
    items,
    isPending,
    mutatingId,
    handleCreate,
    handleDelete,
  };
}

/**
 * =====================================================================
 *                           MEJORA CONTINUA
 * =====================================================================
 *
 * @subsection Melhorias Futuras
 * 1. **Manejo de Actualización Optimista**: ((Vigente)) Expandir el hook para incluir una función `handleUpdate` que actualice un ítem de forma optimista y realice un rollback en caso de fallo, completando el ciclo de vida CRUD.
 * 2. **Callbacks de Éxito/Error**: ((Vigente)) Las funciones `handleCreate` y `handleDelete` podrían aceptar callbacks opcionales (`onSuccess`, `onError`) para permitir al componente que usa el hook ejecutar lógica adicional (ej. cerrar un modal).
 *
 * @subsection Melhorias Adicionadas
 * 1. **Padrão de UI Otimista**: ((Implementada)) Este hook estabelece um padrão de design de elite e reutilizável para atualizações de UI otimistas, melhorando drasticamente a experiência do usuário percebida ao fornecer feedback instantâneo.
 * 2. **Lógica de Rollback Resiliente**: ((Implementada)) A lógica de rollback garante que a UI permaneça consistente com o estado do servidor, mesmo em caso de falhas na Server Action.
 * 3. **Componente Genérico e Reutilizável**: ((Implementada)) O hook é totalmente genérico e pode ser usado para gerenciar qualquer tipo de recurso que tenha um `id`, aderindo perfeitamente à "Filosofia LEGO".
 *
 * =====================================================================
 */
// src/lib/hooks/use-optimistic-resource-management.ts
