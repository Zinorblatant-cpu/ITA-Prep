import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";
import { Button } from "./Button";
import { useToast } from "./Toast";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

interface ImageUploadFieldProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  label?: string;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageUploadField({ value, onChange, label = "Foto" }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({ title: "Imagem muito grande (máx. 8MB)", variant: "error" });
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    onChange(dataUrl);
  }

  if (value) {
    return (
      <div className="relative w-fit">
        <img src={value} alt={label} className="max-h-56 rounded-md border border-border object-contain" />
        <button
          type="button"
          onClick={() => {
            onChange(undefined);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-subtle hover:bg-red-700"
          aria-label={`Remover ${label.toLowerCase()}`}
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
        <ImagePlus size={14} /> {label}
      </Button>
    </div>
  );
}
