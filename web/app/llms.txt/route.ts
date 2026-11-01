import { llmsTxt } from "@/lib/llms";

// /llms.txt — справка о сайте для LLM-поиска (lib/llms.ts). Обновляется раз
// в час, как блог: статья, выложенная заранее, попадёт сюда в свой день.
// middleware сюда не заходит (*.txt исключены в его matcher).
export const revalidate = 3600;

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
