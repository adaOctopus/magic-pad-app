"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Copy } from "lucide-react"
import { toast } from "sonner"

interface MessageCardProps {
  content: string
}

export function MessageCard({ content }: MessageCardProps) {
  const handleShare = async () => {
    try {
      const plainText = content.replace(/<[^>]*>/g, "")
      await navigator.share({
        text: plainText,
      })
    } catch (error) {
      // If Web Share API is not supported, copy to clipboard instead
      await navigator.clipboard.writeText(content.replace(/<[^>]*>/g, ""))
      toast.success("Copied to clipboard!")
    }
  }

  return (
    <Card className="bg-card border-border shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="pt-6">
        <div
          className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
      <CardFooter className="px-6 py-4 bg-muted/50 flex justify-end items-center border-t">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleShare} className="hover:bg-background">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(content)
              toast.success("Copied to clipboard!")
            }}
            className="hover:bg-background"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

