import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 border-b bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          Italic
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          List
        </button>

        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div className="p-4 min-h-[150px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
