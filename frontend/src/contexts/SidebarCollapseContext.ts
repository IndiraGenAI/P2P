import { createContext } from "react";

export const SidebarCollapseContext = createContext({
    sidebarCollapsed: false, setSidebarCollapsed: (value: boolean)=>{}
});