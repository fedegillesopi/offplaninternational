"use client"

import { useRef, useState } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import {
  Bold,
  Heading3,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Quote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/storage"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  defaultValue: string
  onChange: (html: string) => void
  userId: string
  placeholder?: string
  bucket?: string
}

interface ToolbarButtonProps {
  active: boolean
  onClick: () => void
  title: string
  disabled?: boolean
  children: React.ReactNode
}

function ToolbarButton({ active, onClick, title, children, disabled }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      disabled={disabled}
      className={cn("h-8 w-8 p-0", active && "bg-primary-light text-[--text-primary]")}
    >
      {children}
    </Button>
  )
}

export function RichTextEditor({
  defaultValue,
  onChange,
  userId,
  placeholder,
  bucket,
}: RichTextEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: false }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const insertImage = async (file: File) => {
    if (!editor) return
    setError(null)
    setUploading(true)
    try {
      const src = await uploadImage(file, userId, "description", bucket)
      editor.chain().focus().setImage({ src, alt: file.name }).run()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-1 rounded-md border border-input p-1">
        <ToolbarButton
          active={editor?.isActive("bold") ?? false}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("italic") ?? false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("heading", { level: 3 }) ?? false}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("bulletList") ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("orderedList") ?? false}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          title="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("blockquote") ?? false}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={false}
          onClick={() => fileRef.current?.click()}
          title="Insert image"
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[140px] rounded-md border border-input focus-within:ring-1 focus-within:ring-ring"
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) insertImage(file)
          e.target.value = ""
        }}
      />

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}
