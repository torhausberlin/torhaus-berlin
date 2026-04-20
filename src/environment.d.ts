declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      /** Optional: serve `/api/media/...` from another origin (e.g. prod) while the app uses `NEXT_PUBLIC_SERVER_URL`. */
      NEXT_PUBLIC_MEDIA_URL?: string
      VERCEL_PROJECT_PRODUCTION_URL: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
