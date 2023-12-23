import { Link, useLocation } from "@remix-run/react"
import type { LinksFunction } from "@remix-run/node"
import { NavBar } from "~/components/navbar/navBar"
import type { Order } from '~/common/types'
import stylesUrl from '~/styles/confirmation.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

const ConfirmationRoute = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const encryptedOrderData = searchParams.get("orderData") || ""
  const orderData: Order = JSON.parse(atob(encryptedOrderData) || "{}")

  return (
    <div className="page-container">
      <NavBar />
      <div>
        <h1>This is the Confirmation page</h1>
      </div>
      <div>
        <p>Thank you for your order</p>
        <p>Your order number is: {orderData.id}</p>
      </div>
      <div>Don't stop now. <Link to="/products">Continue Shopping</Link></div>
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