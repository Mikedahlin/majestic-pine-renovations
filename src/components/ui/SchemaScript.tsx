type SchemaScriptProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function SchemaScript({ data }: SchemaScriptProps) {
  const json = Array.isArray(data) ? data : [data];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json.length === 1 ? json[0] : json) }}
    />
  );
}
