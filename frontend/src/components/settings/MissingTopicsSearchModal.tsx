import { ExternalLink, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { MissingTopicSearchResultDTO, YoutubeChannelDTO } from "@ita/shared-types";
import { settingsApi } from "../../services/settings.service";
import { useToast } from "../ui/Toast";
import { EmptyState } from "../ui/EmptyState";
import { Modal } from "../ui/Modal";
import { Skeleton } from "../ui/Skeleton";

export function MissingTopicsSearchModal({ channel, onClose }: { channel: YoutubeChannelDTO | null; onClose: () => void }) {
  const [results, setResults] = useState<MissingTopicSearchResultDTO[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!channel) {
      setResults(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    settingsApi
      .searchMissingTopicsOnChannel(channel.id)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch(() => {
        if (!cancelled) {
          toast({ title: "Não foi possível buscar os conteúdos pendentes", variant: "error" });
          onClose();
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel?.id]);

  return (
    <Modal open={!!channel} onClose={onClose} title={`Vídeos pendentes em "${channel?.name}"`}>
      <p className="mb-3 text-sm text-ink-subtle">
        Abre a busca interna do canal para cada conteúdo ainda não concluído — clique para conferir se o canal já tem aula sobre o assunto.
      </p>
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}
      {!isLoading && results?.length === 0 && (
        <EmptyState icon={Search} title="Nenhum conteúdo pendente" description="Todos os conteúdos vinculados a este canal já foram concluídos." />
      )}
      {!isLoading && results && results.length > 0 && (
        <ul className="max-h-96 divide-y divide-border overflow-y-auto">
          {results.map((item) => (
            <li key={item.topicId} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm text-ink">{item.topicName}</p>
                <p className="text-xs text-ink-subtle">{item.subjectName}</p>
              </div>
              <a
                href={item.searchUrl}
                target="_blank"
                rel="noreferrer"
                className="flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                Buscar <ExternalLink size={12} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
