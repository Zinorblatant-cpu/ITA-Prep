import { ExternalLink, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import type { YoutubeChannelDTO } from "@ita/shared-types";
import { useCreateYoutubeChannel, useDeleteYoutubeChannel, useYoutubeChannels } from "../../hooks/useSettings";
import { useToast } from "../ui/Toast";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { MissingTopicsSearchModal } from "./MissingTopicsSearchModal";

export function YoutubeChannelManager() {
  const { data: channels } = useYoutubeChannels();
  const createChannel = useCreateYoutubeChannel();
  const deleteChannel = useDeleteYoutubeChannel();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [searchingChannel, setSearchingChannel] = useState<YoutubeChannelDTO | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createChannel.mutateAsync({ name: name.trim(), url: url.trim() || null, subjectId: null });
      setName("");
      setUrl("");
    } catch {
      toast({ title: "Não foi possível salvar o canal", variant: "error" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Canais do YouTube</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAdd} className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do canal" />
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link do canal (https://youtube.com/@...)" />
          <Button type="submit" disabled={createChannel.isPending}>
            <Plus size={14} /> Adicionar
          </Button>
        </form>

        {channels && channels.length === 0 && <p className="text-sm text-ink-subtle">Nenhum canal cadastrado.</p>}
        {channels && channels.length > 0 && (
          <ul className="divide-y divide-border">
            {channels.map((channel) => (
              <li key={channel.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-ink">{channel.name}</p>
                  {channel.url && (
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 truncate text-xs text-accent hover:underline"
                    >
                      {channel.url} <ExternalLink size={11} />
                    </a>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSearchingChannel(channel)}
                    disabled={!channel.url}
                    title={channel.url ? "Buscar vídeos das matérias pendentes" : "Cadastre um link para poder buscar"}
                  >
                    <Search size={14} /> Buscar pendentes
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteChannel.mutate(channel.id)} aria-label="Remover">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <MissingTopicsSearchModal channel={searchingChannel} onClose={() => setSearchingChannel(null)} />
    </Card>
  );
}
