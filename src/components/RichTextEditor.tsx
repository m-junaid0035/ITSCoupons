"use client";

import React, { useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

type Props = {
  value: string;
  onChange: (value: string) => void;
  height?: string; // optional height prop
};

export default function RichTextEditor({
  value,
  onChange,
  height = "400px",
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full">
      <CKEditor
        editor={ClassicEditor as any}
        data={value}
        onReady={(editor: any) => {
          // Set the editable area height & padding
          editor.editing.view.change((writer: any) => {
            writer.setStyle(
              "min-height",
              height,
              editor.editing.view.document.getRoot()
            );
            writer.setStyle(
              "padding",
              "12px",
              editor.editing.view.document.getRoot()
            );
          });
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={
          {
            toolbar: {
              items: [
                "heading",
                "|",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "subscript",
                "superscript",
                "removeFormat",
                "|",
                "fontColor",
                "fontBackgroundColor",
                "fontSize",
                "fontFamily",
                "|",
                "alignment",
                "outdent",
                "indent",
                "bulletedList",
                "numberedList",
                "|",
                "blockQuote",
                "link",
                "insertTable",
                "imageUpload",
                "mediaEmbed",
                "horizontalLine",
                "code",
                "codeBlock",
                "|",
                "undo",
                "redo",
              ],
            },
            // extra configs (TS doesn't know them, so we cast as any)
            alignment: {
              options: ["left", "center", "right", "justify"],
            },
            list: {
              properties: {
                styles: true,
                startIndex: true,
                reversed: true,
              },
            },
            table: {
              contentToolbar: [
                "tableColumn",
                "tableRow",
                "mergeTableCells",
                "tableProperties",
                "tableCellProperties",
              ],
            },
            image: {
              toolbar: [
                "imageStyle:full",
                "imageStyle:side",
                "|",
                "imageTextAlternative",
              ],
            },
          } as any // ✅ fixes TS error
        }
      />

      {/* Custom styling */}
      <style jsx global>{`
        .ck-editor__editable_inline {
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background: white;
          padding: 12px;
          line-height: 1.6;
        }
        .ck-content ul,
        .ck-content ol {
          margin-left: 1.5rem !important; /* Proper indent for bullets/numbers */
          padding-left: 1rem !important;
        }
      `}</style>
    </div>
  );
}
