/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_MIXPANEL_TOKEN: string
  readonly VITE_AWS_REGION: string
  readonly VITE_AWS_ACCESS_KEY_ID: string
  readonly VITE_AWS_SECRET_ACCESS_KEY: string
  readonly VITE_AWS_SQS_QUEUE_URL: string
  readonly VITE_AWS_SES_FROM_EMAIL: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}