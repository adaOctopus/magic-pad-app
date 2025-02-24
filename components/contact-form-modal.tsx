"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
  type: "linkedin" | "producthunt"
}

export function ContactFormModal({ isOpen, onClose, type }: ContactFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [link, setLink] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientSupabaseClient()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["text/csv", "text/plain", "application/pdf"]

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a CSV, TXT, or PDF file")
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB")
      return
    }

    setSelectedFile(file)
    toast.success("File selected successfully!")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile && !link) {
      toast.error("Please provide either a file or a link")
      return
    }

    setIsLoading(true)

    try {
      // Get the current user's session (might be null for anonymous users)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Handle file upload if present
      if (selectedFile) {
        try {
          // Create a unique filename
          const timestamp = Date.now()
          const sanitizedFileName = selectedFile.name.replace(/[^a-zA-Z0-9.]/g, "_")
          const filePath = `${type}/${timestamp}_${sanitizedFileName}`

          console.log("Starting file upload process...", {
            fileName: sanitizedFileName,
            filePath,
            fileType: selectedFile.type,
            fileSize: selectedFile.size,
          })

          // First upload the file
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from("uploads")
            .upload(filePath, selectedFile, {
              cacheControl: "3600",
              upsert: true,
            })

          if (uploadError) {
            console.error("Storage upload error:", uploadError)
            throw new Error(`Upload failed: ${uploadError.message}`)
          }

          console.log("File uploaded successfully:", uploadData)

          // Get the public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("uploads").getPublicUrl(filePath)

          console.log("Inserting record into database...")

          // Then insert the database record
          const { error: dbError, data: dbData } = await supabase
            .from("file_uploads")
            .insert([
              {
                file_name: sanitizedFileName,
                file_type: selectedFile.type,
                file_size: selectedFile.size,
                file_path: publicUrl,
                upload_type: type,
                user_id: session?.user?.id || null,
              },
            ])
            .select()
            .single()

          if (dbError) {
            console.error("Database insertion error:", dbError)
            // If database insert fails, try to delete the uploaded file
            await supabase.storage.from("uploads").remove([filePath])
            throw new Error(`Database error: ${dbError.message}`)
          }

          console.log("Database record created:", dbData)
        } catch (error) {
          console.error("File handling error:", error)
          throw error
        }
      }

      // Handle link if present
      if (link) {
        try {
          console.log("Inserting link into database...")

          const { error: linkError, data: linkData } = await supabase
            .from("file_uploads")
            .insert([
              {
                file_name: "External Link",
                file_type: "url",
                file_size: 0,
                file_path: link,
                upload_type: type,
                user_id: session?.user?.id || null,
              },
            ])
            .select()
            .single()

          if (linkError) {
            console.error("Link insertion error:", linkError)
            throw new Error(`Failed to save link: ${linkError.message}`)
          }

          console.log("Link record created:", linkData)
        } catch (error) {
          console.error("Link handling error:", error)
          throw error
        }
      }

      toast.success("Submitted successfully!")
      setSelectedFile(null)
      setLink("")
      onClose()
    } catch (error) {
      console.error("Submission error:", error)
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const title = type === "linkedin" ? "Upload LinkedIn Data" : "Upload Product Hunt Data"
  const description =
    type === "linkedin"
      ? "Share your LinkedIn connections through a file upload or profile link"
      : "Share your Product Hunt submissions through a file upload or product link"
  const buttonClass = type === "linkedin" ? "linkedin-button" : "producthunt-button"
  const placeholderText =
    type === "linkedin" ? "https://linkedin.com/in/your-profile" : "https://producthunt.com/posts/your-product"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".csv,.txt,.pdf"
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full border-dashed border-2 h-24 flex flex-col items-center justify-center gap-2"
              >
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedFile ? selectedFile.name : "Click to upload file"}
                </span>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Supported formats: CSV, TXT, PDF (max 5MB)</p>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">External Link</Label>
            <div className="relative">
              <Input
                id="link"
                type="url"
                placeholder={placeholderText}
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="pr-10"
              />
              <LinkIcon className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full text-white ${buttonClass}`}
            disabled={isLoading || (!selectedFile && !link)}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

