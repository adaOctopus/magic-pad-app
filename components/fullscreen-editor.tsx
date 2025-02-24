"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import RichTextEditor from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Minimize2, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface FullscreenEditorProps {
  isOpen: boolean
  onClose: () => void
  content: string
  onChange: (content: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function FullscreenEditor({ isOpen, onClose, content, onChange, onSubmit, isLoading }: FullscreenEditorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-w-[90vw] h-[90vh] flex flex-col p-0",
          // Override the default close button styles to hide it
          "[&>button]:hidden",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold tracking-tight">Focused Writing Mode</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 flex flex-col p-4 min-h-0">
          <div className="flex-1 min-h-0 mb-4">
            <RichTextEditor content={content} onChange={onChange} />
          </div>
          <Button
            className="w-full ai-button transition-colors"
            size="lg"
            onClick={onSubmit}
            disabled={!content || isLoading}
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

