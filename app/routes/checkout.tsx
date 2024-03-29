import { Form, useActionData, useNavigation, useLoaderData } from '@remix-run/react'
import type { LoaderFunction, ActionFunction, V2_MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { NavBar } from '~/components/navbar/navBar'
import type { LinksFunction } from '@remix-run/node'
import stylesUrl from '~/styles/checkout.css'
import { shoppingCartCookie, clearShoppingCartCookie } from '~/cookie.server'
import type { CartProduct } from '~/common/types'
import { useState } from 'react'
import validator from 'validator'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Checkout | Better Commerce' }, { description: 'Checkout for Better Commerce' }]
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await shoppingCartCookie.parse(cookieHeader)) || []
  return json(cookie)
}

export const action: ActionFunction = async ({ request, params }) => {
  const apiKey = process.env.REACT_APP_API_KEY!
  const apiUrl = process.env.REACT_APP_API_URL!
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await shoppingCartCookie.parse(cookieHeader)) || []
  const formData = await request.formData()
  const id = formData.get('id')
  const action = formData.get('action')

  const orderRequest = {
    customerFirstName: formData.get('firstName'),
    customerLastName: formData.get('lastName'),
    customerEmail: formData.get('email'),
    customerPhoneNumber: formData.get('phone'),
    shippingAddress: {
      address: formData.get('shippingAddress'),
      country: formData.get('shippingCountry'),
      province: formData.get('shippingProvince'),
      city: formData.get('shippingCity'),
      postalCode: formData.get('shippingPostalCode'),
    },
    orderItems: cookie.map((item: CartProduct) => {
      return {
        productId: item.id,
        quantity: item.quantity,
      }
    }),
    totalAmount: formData.get('totalAmount'),
  }

  const validateCheckoutFormData = (orderRequest: any) => {
    const errors: any = {}
    if (orderRequest.customerEmail && !validator.isEmail(orderRequest.customerEmail)) {
      errors.email = 'Invalid email'
    }

    if (orderRequest.customerPhoneNumber && !validator.isMobilePhone(orderRequest.customerPhoneNumber)) {
      errors.phoneNumber = 'Invalid phone number'
    }

    if (Object.keys(errors).length > 0) {
      return errors
    }
  }

  const errors = await validateCheckoutFormData(orderRequest)

  if (errors) {
    return json({ errors }, { status: 400 })
  }

  try {
    const response = await fetch(`${apiUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify(orderRequest),
    })
      const clearedCartCookie = await clearShoppingCartCookie() // Clear the cookie
      const data = await response.json()
      const dataString = JSON.stringify(data)
      const encryptedData = Buffer.from(dataString).toString('base64')
      const redirectUrlWithData = "/confirmation?orderData=" + encodeURIComponent(encryptedData)
      return redirect(redirectUrlWithData, {
        headers: {
          'Set-Cookie': clearedCartCookie,
        },
      })
  } catch (error) {
    // TODO: show/handle error
    return redirect('/checkout')
  }
}

const CheckoutRoute = () => {
  const items: CartProduct[] = useLoaderData()
  const actionData = useActionData<typeof action>()
  const errors = actionData?.errors
  const navigation = useNavigation()
  const isSubmitting = navigation.formAction === '/checkout' 
  const [isSameAddress, setIsSameAddress] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState({
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    address: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
    customerPhoneNumber: '',
    note: '',
    shippingAddress: '',
    shippingProvince: '',
    shippingCity: '',
    shippingCountry: '',
    shippingPostalCode: '',
    shippingPhoneNumber: '',
    coupon: '',
    shipping: '',
    shippingPrice: 0,
  })

  let subTotal: number | string = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  subTotal = subTotal.toFixed(2)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setCheckoutForm({ ...checkoutForm, [name]: value })
  }

  return (
    <div className="page-container">
      <NavBar />
      <div>
        <h1>Checkout</h1>
        <Form method="post">
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              required
              // value={checkoutForm.customerFirstName}
              // onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              required
              // value={checkoutForm.customerLastName}
              // onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              // value={checkoutForm.customerEmail}
              // onChange={handleChange}
            />
            {errors?.email ? <span className='form-error'>{errors.email}</span> : null}
          </div>
          <div>
            <label htmlFor="shipping">Shipping Address</label>
            <input
              type="text"
              id="shipping"
              name="shipping"
              placeholder="Shipping Address"
              // value={checkoutForm.shippingAddress}
              // onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="shippingCountry">Shipping Country</label>
            <input
              type="text"
              id="shippingCountry"
              name="shippingCountry"
              placeholder="Shipping Country"
              // value={checkoutForm.shippingCountry}
              // onChange={handleChange}
            ></input>
          </div>
          <div>
            <label htmlFor="shippingProvince">Shipping Province/State</label>
            <input
              type="text"
              id="shippingProvince"
              name="shippingProvince"
              placeholder="Shipping Province/State"
              // value={checkoutForm.shippingProvince}
              // onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="shippingCity">Shipping City</label>
            <input
              type="text"
              id="shippingCity"
              name="shippingCity"
              placeholder="Shipping City"
              // value={checkoutForm.shippingCity}
              // onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="shippingPostalCode">Shipping Postal Code</label>
            <input
              type="text"
              id="shippingPostalCode"
              name="shippingPostalCode"
              placeholder="Shipping Postal Code"
              // value={checkoutForm.shippingPostalCode}
              // onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Phone"
              // value={checkoutForm.customerPhoneNumber}
              // onChange={handleChange}
            />
            {errors?.phoneNumber ? <span className='form-error'>{errors.phoneNumber}</span> : null}
          </div>
          <div>
            <label htmlFor="note">Note</label>
            <textarea
              id="note"
              name="note"
              placeholder="Note"
              rows={3}
              maxLength={200}
              // value={checkoutForm.note}
              // onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="isSameAddress">Same as shipping address</label>
            <input
              type="checkbox"
              id="isSameAddress"
              name="isSameAddress"
              onChange={() => setIsSameAddress(!isSameAddress)}
            />
          </div>
          {!isSameAddress && (
            <>
              <div>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Address"
                  // value={checkoutForm.address}
                  // onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Country"
                  // value={checkoutForm.country}
                  // onChange={handleChange}
                ></input>
              </div>
              <div>
                <label htmlFor="province">Province/State</label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  placeholder="Province/State"
                  // value={checkoutForm.province}
                  // onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  // value={checkoutForm.city}
                  // onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  placeholder="Postal Code"
                  // value={checkoutForm.postalCode}
                  // onChange={handleChange}
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="coupon">Coupon</label>
            <input
              type="text"
              id="coupon"
              name="coupon"
              placeholder="Coupon"
              // value={checkoutForm.coupon}
              // onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="shipping">Shipping</label>
            <input
              type="select"
              id="shipping"
              name="shipping"
              placeholder="Shipping"
              // value={checkoutForm.shipping}
              // onChange={handleChange}
            />
          </div>
          <div>
            <input hidden name="totalAmount" value={subTotal} readOnly />
          </div>
          <div>
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
          </div>
        </Form>
      </div>
      <div style={{ textAlign: 'right' }}>Subtotal: {subTotal}</div>
      <div style={{ textAlign: 'right' }}>Shipping: {0}</div>
      <div style={{ textAlign: 'right' }}>Tax: {0}</div>
      <div style={{ textAlign: 'right' }}>Total: {subTotal}</div>
    </div>
  )
}

export default CheckoutRoute

export const ErrorBoundary = () => {
  return <div className="error-container">Uh oh! Something went wrong.</div>
}
