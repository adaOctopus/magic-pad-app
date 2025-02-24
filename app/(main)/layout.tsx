import type React from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar className="hidden md:flex border-r">
          <SidebarHeader className="h-14 flex items-center px-4 border-b">
            <div className="flex items-center gap-2 font-semibold">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/feather-aqV4mrgIoaXBWSIQ2DjUADnKl9q9Dv.png"
                alt="MagicEdi Logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="text-lg">MagicEdi</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="flex flex-col gap-4 p-4">
              <MainNav />
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Fixed navbar */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 md:px-6">
              <div className="md:hidden mr-2">
                <SidebarTrigger />
              </div>
              <div className="flex-1">
                <div className="md:hidden flex items-center gap-2 font-semibold">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/feather-aqV4mrgIoaXBWSIQ2DjUADnKl9q9Dv.png"
                    alt="MagicEdi Logo"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                  <span className="text-lg">MagicEdi</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">
            <div className="container py-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

