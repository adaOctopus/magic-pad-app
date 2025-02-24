"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  LinkIcon,
  Code,
  RotateCcw,
  RotateCw,
} from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
}

export default function RichTextEditor({ content = "", onChange }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState<string>("")
  const [showLinkInput, setShowLinkInput] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg prose-stone mx-auto focus:outline-none h-full max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setShowLinkInput(false)
    }
  }

  return (
    <div className="rounded-lg border bg-background flex flex-col h-full">
      <div className="border-b">
        {/* Primary Controls */}
        <div className="flex flex-wrap gap-1 p-1 border-b">
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("underline")}
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading")}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("codeBlock")}
            onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code className="h-4 w-4" />
          </Toggle>
          <Button size="sm" variant="outline" onClick={() => setShowLinkInput(!showLinkInput)} className="h-8">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => editor.chain().focus().undo().run()} className="h-8">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => editor.chain().focus().redo().run()} className="h-8">
              <RotateCw className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Link Input */}
        {showLinkInput && (
          <div className="flex items-center gap-2 p-2 border-t">
            <input
              type="url"
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 h-8 rounded-md border border-input bg-background px-2 text-sm"
            />
            <Button size="sm" onClick={addLink} className="h-8">
              Add Link
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 p-3 overflow-auto min-h-0">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  )
}

