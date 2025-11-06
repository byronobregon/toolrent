import * as React from "react"

import { VersionSwitcher } from "@/components/version-switcher"
import { Tag, Wrench, User, Handshake, ClipboardList, BarChart3 } from "lucide-react"
import { Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: [],
  navMain: [
    {
      title: "Inventario",
      url: "#",
      items: [
        {
          title: "Kardex",
          url: "/kardex",
          icon: ClipboardList,
        },
        {
          title: "Préstamos",
          url: "/loans",
          icon: Handshake,
        },
        {
          title: "Herramientas",
          url: "/tools",
          icon: Wrench,
        },
      ],
    },
    {
      title: "Administración",
      url: "#",
      items: [
        {
          title: "Categorías",
          url: "/categories",
          icon: Tag,
        },
        {
          title: "Clientes",
          url: "/clients",
          icon: User,
        },
      ],
    },
    {
      title: "Reportes",
      url: "#",
      items: [
        {
          title: "Reportes",
          url: "/reports",
          icon: BarChart3,
        },
      ],
    },
  ],
}

export default function AppSidebar({
  ...props
}) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
