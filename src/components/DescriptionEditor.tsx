"use client";

import { FC, useEffect, useState, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Button } from "@/components/ui/button";

interface DescriptionEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const DescriptionEditor: FC<DescriptionEditorProps> = ({ initialContent = "", onChange }) => {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Client-only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize editor
  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: {} }),
      Underline,
      Highlight,
      Color,
      Link.configure({ openOnClick: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px]",
      },
    },
    immediatelyRender: false,
  });

  if (!isClient || !editor) return null;

  return (
    <div ref={containerRef} className="border rounded-md w-full max-w-full flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap overflow-x-auto gap-1 mb-2 sticky top-0 bg-white z-20 border-b p-1">
        <Button onClick={() => editor.chain().focus().toggleBold().run()} variant={editor.isActive("bold") ? "default" : "outline"}>B</Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()} variant={editor.isActive("italic") ? "default" : "outline"}>I</Button>
        <Button onClick={() => editor.chain().focus().toggleUnderline().run()} variant={editor.isActive("underline") ? "default" : "outline"}>U</Button>
        <Button onClick={() => editor.chain().focus().toggleStrike().run()} variant={editor.isActive("strike") ? "default" : "outline"}>S</Button>

        {[1, 2, 3, 4, 5, 6].map(level => (
          <Button key={level} onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()} variant={editor.isActive("heading", { level: level as 1 | 2 | 3 | 4 | 5 | 6 }) ? "default" : "outline"}>H{level}</Button>
        ))}

        <Button onClick={() => editor.chain().focus().toggleBulletList().run()} variant={editor.isActive("bulletList") ? "default" : "outline"}>• List</Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} variant={editor.isActive("orderedList") ? "default" : "outline"}>1. List</Button>

        <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} variant={editor.isActive("blockquote") ? "default" : "outline"}>❝ ❞</Button>
        <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()} variant={editor.isActive("codeBlock") ? "default" : "outline"}>{"<>"}</Button>

        {["left", "center", "right", "justify"].map(align => (
          <Button key={align} onClick={() => editor.chain().focus().setTextAlign(align as any).run()} variant={editor.isActive({ textAlign: align }) ? "default" : "outline"}>
            {align[0].toUpperCase()}
          </Button>
        ))}

        <Button onClick={() => editor.chain().focus().undo().run()}>↺</Button>
        <Button onClick={() => editor.chain().focus().redo().run()}>↻</Button>
      </div>

      {/* Scrollable Editor */}
      <div className="overflow-y-auto max-h-[300px] p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default DescriptionEditor;
