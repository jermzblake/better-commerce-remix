import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import { json } from '@remix-run/node'
import globalStylesUrl from "./styles/global.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  {
    rel: "stylesheet",
    href: globalStylesUrl,
  }
];

export async function loader() {
  return json({
    ENV: {
      REACT_APP_API_KEY: process.env.REACT_APP_API_KEY,
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(
              data.ENV
            )}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
