declare namespace NodeJS {
  interface ProcessEnv {
   MAILCHIMP_API_KEY: string;
   MAILCHIMP_SERVER_PREFIX: string;
   MAILCHIMP_LIST_ID: string;
   NODE_ENV: "development" | "production";
  }
}