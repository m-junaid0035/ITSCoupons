// CustomEditor.ts
import ClassicEditorBase from "@ckeditor/ckeditor5-build-classic";
import { Font } from "@ckeditor/ckeditor5-font/src/font";

class ClassicEditor extends ClassicEditorBase { }

// Fix typing by forcing `any`
(ClassicEditor as any).builtinPlugins = [
    ...(ClassicEditorBase as any).builtinPlugins,
    Font,
];

export default ClassicEditor;
