import { Link, useLoaderData, useCatch } from "@remix-run/react"
import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { NavBar } from "~/components/navbar/navBar"
import type { LinksFunction } from '@remix-run/node'
import stylesUrl from '~/styles/cart.css'
import { shoppingCartCookie } from '~/cookie.server'
import { APP_NAME } from '~/common/globalConstants'
import type { CartProduct } from '~/common/types'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export const meta: V2_MetaFunction = () => {

  return [{ title: `My Cart | ${APP_NAME}` }, { description: `Shop the latest and greatest products and much more` }]
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await shoppingCartCookie.parse(cookieHeader)) || []
  return json(cookie)
}

const CartRoute = () => {
  const items: CartProduct[] = useLoaderData()
  let grandTotal: number | string = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  grandTotal = grandTotal.toFixed(2)
  
  return (
    <div className="page-container">
      <NavBar />
      <div>
        <h1>Your Cart</h1>
      </div>
      {(!items || items.length < 1) && (
        <>
          Cart empty
        </>
      )}
      {items.map((item: CartProduct) => (
        <div key={item.id} className="cart-item-grid">
          <div className="cart-item-left-column">
            <img src={item.image} alt="item" />
          </div>
          <div className="cart-item-right-column">
            <div>{item.name}</div>
            <div>Quantity: {item.quantity}</div>
            <div>Price: {item.price}</div>
            <div>Total: {item.price * item.quantity}</div>
          </div>
        </div>
      ))}
      <div style={{ textAlign: "right" }}>Grand Total: {grandTotal}</div>
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