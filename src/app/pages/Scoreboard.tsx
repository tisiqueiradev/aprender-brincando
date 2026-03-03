import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { clearScoreboard, getScoreboard } from "../../lib/scoreboard";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export default function Scoreboard() {
  const [version, setVersion] = useState(0);

  const records = useMemo(() => getScoreboard(), [version]);

  return (
    <main className="min-h-[100dvh] bg-background px-4 py-6 sm:px-6">
      <section className="max-w-4xl mx-auto rounded-2xl bg-card shadow-md border border-border p-4 sm:p-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-foreground">Placar</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Aprender Brincando</p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/home"
              className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm sm:text-base font-semibold"
            >
              Início
            </Link>
            <button
              type="button"
              onClick={() => {
                clearScoreboard();
                setVersion((prev) => prev + 1);
              }}
              className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm sm:text-base font-semibold"
            >
              Limpar
            </button>
          </div>
        </header>

        {records.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
            Nenhuma pontuação registrada ainda.
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <article
                key={record.id}
                className="rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <p className="font-display text-lg text-foreground">{record.subject}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(record.completedAt)}</p>
                </div>

                <div className="text-sm sm:text-base text-foreground font-semibold">
                  {record.points} ponto(s) - {record.correctAnswers}/{record.totalExercises} acertos
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
