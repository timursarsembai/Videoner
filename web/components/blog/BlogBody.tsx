import { Block, parseInline } from "@/lib/blog/markdown";

// Тело статьи блога (lib/blog/markdown.ts). Серверный компонент.

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((part, i) =>
        part.kind === "bold" ? (
          <strong key={i} className="font-semibold text-foreground">
            {part.text}
          </strong>
        ) : part.kind === "code" ? (
          <code key={i} className="rounded bg-foreground/5 px-1.5 py-0.5 text-[0.9em] text-foreground">
            {part.text}
          </code>
        ) : part.kind === "link" ? (
          <a
            key={i}
            href={part.href}
            target={part.href.startsWith("https://videoner.download") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            {part.text}
          </a>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

export function BlogBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mt-8 space-y-4 leading-relaxed text-foreground/80">
      {blocks.map((b, i) => {
        if (b.type === "h")
          return (
            <h2 key={i} className="pt-4 text-xl font-semibold text-foreground">
              <Inline text={b.text} />
            </h2>
          );
        if (b.type === "ul")
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5">
              {b.items.map((item, j) => (
                <li key={j}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        if (b.type === "ol")
          return (
            <ol key={i} className="list-decimal space-y-1.5 pl-5">
              {b.items.map((item, j) => (
                <li key={j}>
                  <Inline text={item} />
                </li>
              ))}
            </ol>
          );
        return (
          <p key={i}>
            <Inline text={b.text} />
          </p>
        );
      })}
    </div>
  );
}
