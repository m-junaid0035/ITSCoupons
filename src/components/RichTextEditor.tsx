"use client";
import React, { useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

type Props = {
  value: string;
  onChange: (value: string) => void;
  height?: string; // optional height prop
};

export default function RichTextEditor({ value, onChange, height = "300px" }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full">
      <CKEditor
        editor={ClassicEditor as any}
        data={value}
        onReady={(editor: any) => {
          // Set the editable area height
          editor.editing.view.change((writer: any) => {
            writer.setStyle("height", height, editor.editing.view.document.getRoot());
          });
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "insertTable",
            "undo",
            "redo",
          ],
        }}
      />
    </div>
  );
}
