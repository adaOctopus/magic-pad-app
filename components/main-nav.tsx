"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollText, Home, Settings, Linkedin, Rocket } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ContactFormModal } from "./contact-form-modal"

export function MainNav() {
  const pathname = usePathname()
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"linkedin" | "producthunt">("linkedin")

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/editor",
      label: "Rich Editor",
      icon: ScrollText,
      active: pathname === "/editor",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  const handleSocialClick = (type: "linkedin" | "producthunt") => (e: React.MouseEvent) => {
    e.preventDefault()
    setModalType(type)
    setShowModal(true)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Navigation */}
        <div className="flex flex-col gap-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "secondary" : "ghost"}
              className={cn("w-full justify-start", route.active && "bg-primary/10")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>

        {/* Social Links */}
        <div className="space-y-4 mt-4 pt-4 border-t">
          <Button
            className="w-full linkedin-button text-white font-medium tracking-wide"
            size="lg"
            onClick={handleSocialClick("linkedin")}
          >
            <Linkedin className="mr-2 h-5 w-5" strokeWidth={2.5} />
            LinkedIn
          </Button>

          <Button
            className="w-full producthunt-button text-white font-medium tracking-wide"
            size="lg"
            onClick={handleSocialClick("producthunt")}
          >
            <Rocket className="mr-2 h-5 w-5" strokeWidth={2.5} />
            Product Hunt
          </Button>
        </div>
      </div>

      <ContactFormModal isOpen={showModal} onClose={() => setShowModal(false)} type={modalType} />
    </>
  )
}

