import { motion } from "framer-motion";
import { useMemo } from "react";
import { ReviewList } from "../components/reviews/ReviewList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { useReviews } from "../hooks/useReviews";

export function ReviewsPage() {
  const { data: reviews, isLoading } = useReviews();

  const grouped = useMemo(() => {
    const pendente = reviews?.filter((r) => r.status === "pendente") ?? [];
    const atrasada = reviews?.filter((r) => r.status === "atrasada") ?? [];
    const concluida = reviews?.filter((r) => r.status === "concluida") ?? [];
    const pulada = reviews?.filter((r) => r.status === "pulada") ?? [];
    return { pendente, atrasada, concluida, pulada };
  }, [reviews]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Revisões</h1>
        <p className="text-sm text-ink-subtle">Ciclo de repetição espaçada: 1, 7, 30, 90 e 180 dias após concluir um conteúdo.</p>
      </div>

      <Tabs defaultValue="pendente">
        <TabsList>
          <TabsTrigger value="pendente">Pendentes ({grouped.pendente.length})</TabsTrigger>
          <TabsTrigger value="atrasada">Atrasadas ({grouped.atrasada.length})</TabsTrigger>
          <TabsTrigger value="concluida">Concluídas ({grouped.concluida.length})</TabsTrigger>
          <TabsTrigger value="pulada">Puladas ({grouped.pulada.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pendente">
          <ReviewList reviews={grouped.pendente} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="atrasada">
          <ReviewList reviews={grouped.atrasada} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="concluida">
          <ReviewList reviews={grouped.concluida} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="pulada">
          <ReviewList reviews={grouped.pulada} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
