"use client"

import type React from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ScrollText } from "lucide-react"
import { ThemeProvider } from "@/components/providers"
import { Toaster } from "sonner"
import { Inter } from "next/font/google"
import "./globals.css"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Toaster />
          {isLoginPage ? (
            children
          ) : (
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar>
                  <SidebarHeader className="border-b p-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <ScrollText className="h-6 w-6" />
                      <span className="text-lg">Editor App</span>
                    </div>
                  </SidebarHeader>
                  <SidebarContent>
                    <div className="flex flex-col gap-4 p-4">
                      <MainNav />
                    </div>
                  </SidebarContent>
                </Sidebar>

                <div className="flex flex-1 flex-col">
                  <header className="sticky top-0 z-50 w-full border-b bg-background">
                    <div className="flex h-14 items-center justify-between px-6">
                      <SidebarTrigger />
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <UserNav />
                      </div>
                    </div>
                  </header>
                  <main className="flex-1">{children}</main>
                </div>
              </div>
            </SidebarProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}

