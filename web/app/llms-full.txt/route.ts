import { llmsFullTxt } from "@/lib/llms";

// /llms-full.txt — то же, что /llms.txt, плюс полный текст английских статей
// блога (lib/llms.ts). Обновляется раз в час, как блог.
export const revalidate = 3600;

export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
