import React from "react";

interface BlogContentRendererProps {
  content: string;
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  if (!content) return null;

  // Découpage par paragraphes et sections markdown
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-2 text-slate-700 my-4 text-sm sm:text-base leading-relaxed">
          {currentList.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-[#0F172A]'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
      .replace(/`([^`]+)`/g, "<code class='px-1.5 py-0.5 rounded-md bg-slate-100 text-purple-700 font-mono text-xs font-semibold'>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' target='_blank' rel='noopener noreferrer' class='text-[#2563EB] underline hover:text-blue-700 font-medium'>$1</a>");
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Début ou fin de bloc de code ```
    if (trimmed.startsWith("```")) {
      flushList();
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${index}`} className="my-5 rounded-2xl overflow-hidden bg-[#0F172A] border border-slate-800 shadow-md">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Code Snippet</span>
              <span>Copier</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-100 overflow-x-auto leading-relaxed">
              <code>{codeBlockLines.join("\n")}</code>
            </pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    // Listes à puces (- ou *)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentList.push(trimmed.substring(2));
      return;
    } else {
      flushList();
    }

    // Titres H2 (##)
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${index}`}
          className="font-bebas text-2xl sm:text-3xl text-[#0F172A] tracking-wide mt-10 mb-4 pt-4 border-t border-slate-100"
        >
          {trimmed.substring(3)}
        </h2>
      );
      return;
    }

    // Titres H3 (###)
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${index}`}
          className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight mt-6 mb-2"
        >
          {trimmed.substring(4)}
        </h3>
      );
      return;
    }

    // Citations / Callouts (> )
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className="my-5 p-4 sm:p-5 rounded-2xl bg-blue-50/70 border-l-4 border-[#2563EB] text-slate-700 italic text-sm sm:text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed.substring(2)) }}
        />
      );
      return;
    }

    // Ligne vide
    if (trimmed === "") {
      return;
    }

    // Paragraphe standard
    elements.push(
      <p
        key={`p-${index}`}
        className="text-sm sm:text-base text-slate-700 leading-relaxed my-3 font-sans"
        dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
      />
    );
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
}
