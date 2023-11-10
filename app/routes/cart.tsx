import { useFetcher, useLoaderData, useCatch, useLocation, Link } from "@remix-run/react"
import type { LoaderFunction, V2_MetaFunction, ActionFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
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

export const action: ActionFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await shoppingCartCookie.parse(cookieHeader)) || []
  const formData = await request.formData()
  const id = formData.get('id')
  const action = formData.get("action")
  let updatedCart
  if (action === "updateQuantity") {
    // Handle the quantity update action
    const quantity = Number(formData.get('quantity'))
    updatedCart = cookie.map((item: CartProduct) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: quantity || 1,
        }
      }
      return item
    })
  } else if (action === "removeItem") {
    // Handle the item removal action
    updatedCart = cookie.filter((item: CartProduct) => item.id !== id)
  }
  const updatedCookie = await shoppingCartCookie.serialize(updatedCart)
  const redirectUrl = formData.get('redirectUrl')
  return redirect(typeof redirectUrl === 'string' ? redirectUrl : '/cart', {
    headers: {
      'Set-Cookie': updatedCookie,
    },
  }) 
}

const CartRoute = () => {
  const items: CartProduct[] = useLoaderData()
  const fetcher = useFetcher()
  const { pathname, search } = useLocation()

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
            <div>Price: {item.price}</div>
            <fetcher.Form method="put">
              {/* Quantity form */}
              <input type="hidden" name="action" value="updateQuantity" />
              <label htmlFor="quantity">Quantity:</label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                min="1" 
                max="100" 
                defaultValue={item.quantity} 
                onChange={(e) => e.target.closest("form")?.submit()} 
              />
              <input hidden name="redirectUrl" value={pathname + search} readOnly />
              <input hidden name="id" value={item.id} readOnly />
              </fetcher.Form>
            <div>Total: {(item.price * item.quantity).toFixed(2)}</div>
            <div>
              {/* Remove form */}
              <fetcher.Form method="put">
              <input type="hidden" name="action" value="removeItem" />
              <input hidden name="redirectUrl" value={pathname + search} readOnly />
              <input hidden name="id" value={item.id} readOnly />
              <button type="submit" value="Submit">remove</button>
            </fetcher.Form>
      </div>
          </div>
        </div>
      ))}
      <div style={{ textAlign: "right" }}>Grand Total: {grandTotal}</div>
        <div style={{ textAlign: "right" }}>
          <Link to="/checkout"><button disabled={Number(grandTotal) <= 0}>Checkout</button></Link>
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