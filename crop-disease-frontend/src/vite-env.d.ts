/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_HUGGINGFACE_TOKEN: string // <-- ADD THIS LINE
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}