type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/** Emits a single or multiple JSON-LD graph entries (server-safe). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
