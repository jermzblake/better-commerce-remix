import { Link, useLoaderData, useCatch } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { NavBar } from "~/components/navbar/navBar"
import type { LinksFunction } from '@remix-run/node'
import stylesUrl from '~/styles/cart.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export const loader: LoaderFunction = async () => {
  return null
}

const CartRoute = () => {
  const items = useLoaderData()
  return (
    <div className="page-container">
      <NavBar />
      <div>
        <h1>This is the cart page</h1>
      </div>
    </div>
  )
}

export default CartRoute

export const CatchBoundary = () => {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        There are no items in your cart.
      </div>
    );
  }
  throw new Error(
    `Unexpected caught response with status: ${caught.status}`
  );
}

export const ErrorBoundary = () => {
  return (
    <div className="error-container">
      Uh oh! Something went wrong.
    </div>
  );
}