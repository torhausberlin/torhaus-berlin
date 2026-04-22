type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/** Emits a single or multiple JSON-LD graph entries (server-safe). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
