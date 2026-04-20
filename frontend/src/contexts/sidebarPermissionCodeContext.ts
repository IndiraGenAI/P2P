import { createContext } from "react";

export const SidebarPermissionCodeContext = createContext({
    isCode:[] as string[], setIsCode: (value: string[])=> {}
});