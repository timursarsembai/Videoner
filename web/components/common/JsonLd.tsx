export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  // Экранируем "<" — без этого JSON, содержащий "</script>" (сейчас все
  // вызовы передают статические объекты, но это молчаливая ловушка для
  // любого будущего динамического значения, например заголовка видео),
  // преждевременно закрыл бы сам тег script и оставшийся текст ушёл бы
  // в HTML как есть, а не как JSON-LD.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
