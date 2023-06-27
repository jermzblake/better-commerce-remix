import { Link, useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { NavBar } from "~/components/navbar/navBar"
import type { LinksFunction } from '@remix-run/node'
import stylesUrl from '~/styles/confirmation.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export const loader: LoaderFunction = async () => {
  return null
}

const ConfirmationRoute = () => {
  const summary = useLoaderData()
  return (
    <div className="page-container">
      <NavBar />
      <div>
        <h1>This is the Confirmation page</h1>
      </div>
    </div>
  )
}

export default ConfirmationRoute

export const ErrorBoundary = () => {
  return (
    <div className="error-container">
      Uh oh! Something went wrong.
    </div>
  );
}