import "../styles/globals.css"

import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://119ec84d123e4b32a5b29014dc58ef2d@o4504170566320128.ingest.sentry.io/4504170576084992",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      {" "}
      <style jsx global>{`
        /* Other global styles such as 'html, body' etc... */

        #__next {
          height: 100%;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
