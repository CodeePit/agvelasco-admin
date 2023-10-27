'use client';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Strikethrough,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  WrapText,
  RemoveFormatting,
  Redo,
  Undo,
} from 'lucide-react';
import { Toggle } from './toggle';
import { Separator } from './separator';
import { Skeleton } from './skeleton';
import { cn } from 'utils/cn';

export const RichTextEditor = ({
  onChangeHTML,
  defaultValue,
  className,
}: {
  onChangeHTML?: (v: string) => void;
  defaultValue?: string;
  className?: string;
}) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn(
          className,
          'min-h-[180px] max-h-[180px] w-full rounded-md rounded-tr-none rounded-tl-none border border-input bg-transparent px-3 py-2 border-t-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto',
        ),
      },
    },
    extensions: [
      StarterKit.configure({
        orderedList: { HTMLAttributes: { class: 'list-decimal pl-4' } },
        bulletList: { HTMLAttributes: { class: 'list-disc pl-4' } },
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content: defaultValue || '',
    onUpdate: ({ editor }) => (onChangeHTML ? onChangeHTML(editor.getHTML()) : {}),
  });

  return (
    <div>
      {!editor && (
        <div className="flex flex-col items-center rounded-md">
          <Skeleton className="h-10 w-full p-1 flex bg-primary-foreground border border-input flex-row items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-md" />
            <Skeleton className="w-8 h-8 rounded-md" />
            <Separator orientation="vertical" className="w-[1px] h-8" />
            <Skeleton className="w-8 h-8 rounded-md" />
            <Skeleton className="w-8 h-8 rounded-md" />
            <Skeleton className="w-8 h-8 rounded-md" />
          </Skeleton>
          <Skeleton className="h-[180px] w-full bg-primary-foreground/60 px-3 py-2">
            <Skeleton className="w-[80px] h-4 rounded-md" />
          </Skeleton>
        </div>
      )}
      {editor ? <RichTextEditorToolbar editor={editor} /> : null}
      <EditorContent editor={editor} />
    </div>
  );
};

const RichTextEditorToolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div className="border border-input bg-transparent rounded-br-md rounded-bl-md p-1 flex flex-row items-center gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="w-[1px] h-8" />
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('paragraph')}
        onPressedChange={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="w-[1px] h-8" />
      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={() => editor.chain().focus().setHardBreak().run()}
      >
        <WrapText className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
      >
        <RemoveFormatting className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="w-[1px] h-8" />
      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={() => editor.chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={() => editor.chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </Toggle>
    </div>
  );
};
