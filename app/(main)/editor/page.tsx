"use client"

import type React from "react"
import { useState, useEffect } from "react"
import RichTextEditor from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Send, PanelRightClose, PanelRightOpen, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChat } from "ai/react"
import { toast } from "sonner"
import { Toggle } from "@/components/ui/toggle"
import { PremiumModal } from "@/components/premium-modal"
import { checkUserSubscription } from "@/lib/subscription"

export default function EditorPage() {
  const [editorContent, setEditorContent] = useState("")
  const [showAI, setShowAI] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("showAIPanel")
      return stored === null ? false : stored === "true" // Changed default to false
    }
    return false // Changed default to false
  })
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const checkPremium = async () => {
      const { isActive } = await checkUserSubscription()
      setIsPremium(isActive)
    }
    checkPremium()
  }, [])

  const { messages, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error("Chat error:", error)
      toast.error("Failed to get AI response")
    },
  })

  useEffect(() => {
    localStorage.setItem("showAIPanel", String(showAI))
  }, [showAI])

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!editorContent.trim()) return

    try {
      const plainText = editorContent.replace(/<[^>]*>/g, "")
      const submitEvent = {
        preventDefault: () => {},
        target: {
          elements: {
            message: { value: plainText },
          },
        },
      } as any

      await handleSubmit(submitEvent)
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: editorContent }),
      })

      if (!response.ok) {
        throw new Error("Failed to store message")
      }

      setEditorContent("")
    } catch (error) {
      console.error("Error details:", error)
      toast.error("Failed to process message")
    }
  }

  return (
    <>
      <div
        className="grid h-[calc(100vh-3.5rem)] overflow-hidden transition-all duration-300"
        style={{
          gridTemplateColumns: showAI ? "1fr 1fr" : "1fr",
          gap: showAI ? "1px" : "0",
        }}
      >
        {/* Editor section */}
        <div className="flex flex-col p-4 min-w-0">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Message</h2>
              <p className="text-muted-foreground">Compose your message using the rich text editor.</p>
            </div>
            <Toggle aria-label="Toggle AI Panel" pressed={showAI} onPressedChange={setShowAI} className="ml-auto">
              {showAI ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </Toggle>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1 min-h-0">
              <RichTextEditor content={editorContent} onChange={setEditorContent} />
            </div>

            <Button
              className="w-full ai-button transition-colors"
              size="lg"
              onClick={onSubmit}
              disabled={!editorContent || isLoading}
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>

        {/* AI Responses section */}
        {showAI && (
          <div className="flex flex-col p-4 border-l min-w-0">
            <div className="mb-4">
              <h2 className="text-2xl font-bold tracking-tight">AI Responses</h2>
              <p className="text-muted-foreground">Chat with AI about your messages.</p>
            </div>

            {isPremium ? (
              <ScrollArea className="flex-1 h-[calc(100vh-12rem)]">
                <div className="space-y-6 p-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground">No messages yet. Start a conversation!</div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "assistant" && (
                          <Avatar>
                            <AvatarFallback>AI</AvatarFallback>
                            <AvatarImage src="/bot-avatar.png" />
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                        {message.role === "user" && (
                          <Avatar>
                            <AvatarFallback>ME</AvatarFallback>
                            <AvatarImage src="/user-avatar.png" />
                          </Avatar>
                        )}
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar>
                        <AvatarFallback>AI</AvatarFallback>
                        <AvatarImage src="/bot-avatar.png" />
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 bg-muted animate-pulse">Thinking...</div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-primary-foreground opacity-75 blur" />
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-lg bg-background border">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">Unlock AI Responses</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Get instant AI feedback on your messages and enhance your writing with our premium features.
                  </p>
                </div>
                <Button className="ai-button" size="lg" onClick={() => setShowPremiumModal(true)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Go Premium
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </>
  )
}

