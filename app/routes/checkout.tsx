import { Link, useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { NavBar } from "~/components/navbar/navBar"
import type { LinksFunction } from '@remix-run/node'
import stylesUrl from '~/styles/checkout.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export const loader: LoaderFunction = async () => {
  return null
}

const CheckoutRoute = () => {
  const items = useLoaderData()
  return (
    <div className="page-container">
      <NavBar />
      <div>
        <h1>This is the Checkout page</h1>
      </div>
    </div>
  )
}

export default CheckoutRoute

export const ErrorBoundary = () => {
  return (
    <div className="error-container">
      Uh oh! Something went wrong.
    </div>
  );
}