import type { Exercise } from "../app/pages/math.utils";

interface PrintExercisesPdfProps {
  exercises: Exercise[];
  className?: string;
}

function formatSequence(sequence: number[]) {
  return sequence.map((value) => (value === -1 ? "___" : String(value))).join(", ");
}

function formatOptions(options: number[]) {
  return options.map((value) => String(value)).join(", ");
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function PrintExercisesPdf({ exercises, className = "" }: PrintExercisesPdfProps) {
  const handlePrint = () => {
    const questionsHtml = exercises
      .map((exercise, index) => {
        const sequence = escapeHtml(formatSequence(exercise.sequence));
        const options = escapeHtml(formatOptions(exercise.options));

        return `
          <section class="question-card">
            <h2>Questao ${index + 1}</h2>
            <div class="question-box">
              <p class="title">Complete a sequencia!</p>
              <p class="subtitle">Arraste o numero correto para o espaco vazio</p>
              <p class="sequence">${sequence}</p>
              <p class="options"><strong>Opcoes:</strong> ${options}</p>
            </div>
          </section>
        `;
      })
      .join("");

    const html = `
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Aprender Brincando - PDF</title>
          <style>
            @page {
              size: A4;
              margin: 12mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #1f2937;
            }

            .sheet {
              width: 100%;
            }

            .header {
              text-align: center;
              margin-bottom: 10mm;
            }

            .header h1 {
              margin: 0;
              font-size: 24px;
            }

            .header p {
              margin: 4px 0 0;
              font-size: 13px;
            }

            .question-card {
              page-break-inside: avoid;
              margin-bottom: 6mm;
            }

            .question-card h2 {
              margin: 0 0 2mm;
              font-size: 14px;
            }

            .question-box {
              border: 2px solid #bfdbfe;
              border-radius: 10px;
              padding: 4mm;
            }

            .title {
              font-size: 16px;
              font-weight: 700;
              margin: 0 0 1.5mm;
            }

            .subtitle {
              margin: 0 0 3mm;
              color: #475569;
              font-size: 12px;
            }

            .sequence {
              margin: 0 0 3mm;
              font-size: 18px;
              font-weight: 700;
              letter-spacing: 0.5px;
            }

            .options {
              margin: 0;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <main class="sheet">
            <header class="header">
              <h1>Aprender Brincando</h1>
              <p>Lista de questoes - Sequencia Numerica</p>
            </header>
            ${questionsHtml}
          </main>
        </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.setAttribute("aria-hidden", "true");
    document.body.appendChild(iframe);

    let hasPrinted = false;
    const runPrint = () => {
      if (hasPrinted) return;
      hasPrinted = true;
      const iframeWin = iframe.contentWindow;
      if (!iframeWin) return;
      iframeWin.focus();
      iframeWin.print();
    };

    iframe.onload = () => {
      setTimeout(runPrint, 200);
    };

    iframe.srcdoc = html;

    setTimeout(runPrint, 400);

    const attachAfterPrint = () => {
      const iframeWin = iframe.contentWindow;
      if (!iframeWin) return;
      iframeWin.onafterprint = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
    };

    setTimeout(attachAfterPrint, 50);
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handlePrint}
        className="px-4 py-2 rounded-lg bg-math text-math-foreground font-display font-semibold text-sm sm:text-base shadow-md hover:bg-math/90"
      >
        Imprimir PDF
      </button>
    </div>
  );
}
