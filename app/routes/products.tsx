import { Outlet, Link, useLoaderData, useCatch } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { NavBar } from "~/components/navbar/navBar"
import type { LinksFunction } from '@remix-run/node'
import stylesUrl from '~/styles/products.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export const loader: LoaderFunction = async () => {
  return null
}

const ProductsRoute = () => {
  const products = useLoaderData()
  return (
    <div className="page-container">
      <NavBar />
      <div>
        <h1>This is the product page</h1>
        <Outlet />
      </div>
    </div>
  )
}

export default ProductsRoute

export const CatchBoundary = () => {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        There are no products to display.
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