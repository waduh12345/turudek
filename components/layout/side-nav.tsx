import * as SheetPrimitive from "@radix-ui/react-dialog";
import { TextAlignJustifyIcon } from "lucide-react";
import clsx from "clsx";

const SideNav = () => {
  return (
    <SheetPrimitive.Root data-slot="sheet">
      <SheetPrimitive.Trigger data-slot="sheet-trigger">
        <TextAlignJustifyIcon size={22} strokeWidth={2.5} />
      </SheetPrimitive.Trigger>
      <SheetPrimitive.Portal data-slot="sheet-portal">
        <SheetPrimitive.Overlay
          data-slot="sheet-overlay"
          className={clsx(
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
          )}
        />
        <SheetPrimitive.Content
          data-slot="sheet-content"
          className={clsx(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500"
          )}
        >
          <SheetPrimitive.Title>Title</SheetPrimitive.Title>
          <SheetPrimitive.Description>Desciption</SheetPrimitive.Description>
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  );
};

export default SideNav;
