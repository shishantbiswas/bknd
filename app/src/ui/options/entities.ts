import type { DB, Field } from "userbase";
import type { ReactNode } from "react";
import type { Entity } from "data/entities";
import { useUserbase } from "ui/client/UserbaseProvider";
import type { DropdownProps } from "ui/components/overlay/Dropdown";
import type { ButtonProps } from "ui/components/buttons/Button";

export type UserbaseAdminEntityContext = "list" | "create" | "update";

export type UserbaseAdminEntitiesOptions = {
   [E in keyof DB]?: UserbaseAdminEntityOptions<E>;
};

export type UserbaseAdminEntityOptions<E extends keyof DB | string> = {
   /**
    * Header to be rendered depending on the context
    */
   header?: (
      context: UserbaseAdminEntityContext,
      entity: Entity,
      data?: DB[E],
   ) => ReactNode | void | undefined;
   /**
    * Footer to be rendered depending on the context
    */
   footer?: (
      context: UserbaseAdminEntityContext,
      entity: Entity,
      data?: DB[E],
   ) => ReactNode | void | undefined;
   /**
    * Actions to be rendered depending on the context
    */
   actions?: (
      context: UserbaseAdminEntityContext,
      entity: Entity,
      data?: DB[E],
   ) => {
      /**
       * Primary actions are always visible
       */
      primary?: (ButtonProps | undefined | null | false)[];
      /**
       * Context actions are rendered in a dropdown
       */
      context?: DropdownProps["items"];
   };
   /**
    * Field UI overrides
    */
   fields?: {
      [F in keyof DB[E]]?: UserbaseAdminEntityFieldOptions<E>;
   };
};

export type UserbaseAdminEntityFieldOptions<E extends keyof DB | string> = {
   /**
    * Override the rendering of a certain field
    */
   render?: (
      context: UserbaseAdminEntityContext,
      entity: Entity,
      field: Field,
      ctx: {
         data?: DB[E];
         value?: DB[E][keyof DB[E]];
         handleChange: (value: any) => void;
      },
   ) => ReactNode | void | undefined;
};

export function useEntityAdminOptions(entity: Entity, context: UserbaseAdminEntityContext, data?: any) {
   const b = useUserbase();
   const opts = b.options?.entities?.[entity.name];
   const footer = opts?.footer?.(context, entity, data) ?? null;
   const header = opts?.header?.(context, entity, data) ?? null;
   const actions = opts?.actions?.(context, entity, data);

   return {
      footer,
      header,
      field: (name: string) => opts?.fields?.[name],
      actions,
   };
}
