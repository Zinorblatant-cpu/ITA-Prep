import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import { Textarea } from "./Textarea";
import { MarkdownContent } from "./MarkdownContent";

interface MarkdownEditorFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditorField({ value, onChange, placeholder }: MarkdownEditorFieldProps) {
  return (
    <Tabs defaultValue="editar">
      <TabsList>
        <TabsTrigger value="editar">Editar</TabsTrigger>
        <TabsTrigger value="preview">Pré-visualizar</TabsTrigger>
      </TabsList>
      <TabsContent value="editar">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-20 rounded-md border border-border bg-surface px-3 py-2">
          {value.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            <p className="text-sm text-ink-subtle">Nada para mostrar ainda.</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
