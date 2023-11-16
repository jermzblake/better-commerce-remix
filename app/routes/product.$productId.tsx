import { useLoaderData, useParams, useCatch, useFetcher, useLocation } from '@remix-run/react'
import type { LoaderFunction, ActionFunction, V2_MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import type { Product } from '../common/types'
import { NavBar } from '~/components/navbar/navBar'
import { shoppingCartCookie } from '~/cookie.server'
import { APP_NAME } from '~/common/globalConstants'

export const meta: V2_MetaFunction = ({ data }: { data: Product | undefined }) => {
  if (!data) {
    return [{ title: 'No product' }, { description: 'No product found' }]
  }
  return [{ title: `${data.name} | ${APP_NAME}` }, { description: `Enjoy the "${data.name}" product and much more` }]
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const apiKey = process.env.REACT_APP_API_KEY!
  const apiUrl = process.env.REACT_APP_API_URL!
  const productData = await fetch(`${apiUrl}/products/${params.productId}`, {
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
  })
  if (!productData) {
    throw new Response('Might have better luck finding Carmen Sandiego.. This product not found', {
      status: 404,
    })
  }
  return json(await productData.json())
}

export const action: ActionFunction = async ({ request, params }) => {
  const apiKey = process.env.REACT_APP_API_KEY!
  const apiUrl = process.env.REACT_APP_API_URL!
  const res = await fetch(`${apiUrl}/products/${params.productId}`, {
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
  })
  const product: Product = await res.json()
  if (!product || product.quantity <= 0) {
    throw new Response('Product is not available', { status: 404 })
  }
  //TODO need to install axios?
  // TODO persist to db for members
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await shoppingCartCookie.parse(cookieHeader)) || []
  const formData = await request.formData()
  const quantity = Number(formData.get('quantity'))
  const existingItemIndex = cookie.findIndex((item: Product) => item.id === product.id)
  let updatedCart
  if (existingItemIndex !== -1) {
    cookie[existingItemIndex].quantity = cookie[existingItemIndex].quantity + quantity
    updatedCart = [ ...cookie]
  } else {
    updatedCart = [
      ...cookie,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity || 1,
        image: product.media.thumbnail,
      },
    ]
  }
  const updatedCookie = await shoppingCartCookie.serialize(updatedCart)
  const redirectUrl = formData.get('redirectUrl')
  return redirect(typeof redirectUrl === 'string' ? redirectUrl : '/cart', {
    headers: {
      'Set-Cookie': updatedCookie,
    },
  })
}

const ProductRoute = () => {
  //TODO add structured data
  const product = useLoaderData<Product>()
  const { pathname, search } = useLocation()
  const fetcher = useFetcher()
  return (
    <div className="page-container">
      <NavBar />
      {/* render product display */}
      <div>
        <img src={product.media.thumbnail} alt="product" />
      </div>
      <div>{product.name}</div>
      <div>{product.description}</div>
      <div>{product.price}</div>
      <div>
        <fetcher.Form method="post">
          <label htmlFor="quantity">Quantity:</label>
          <input type="number" id="quantity" name="quantity" min="1" max="100" defaultValue={1} />
          <input hidden name="redirectUrl" value={pathname + search} readOnly />
          <button type="submit" value="Submit">add to cart</button>
        </fetcher.Form>
      </div>
      {/* TODO render some other product related things after product display */}
    </div>
  )
}

export default ProductRoute

export const CatchBoundary = () => {
  const caught = useCatch()
  const params = useParams()
  switch (caught.status) {
    case 400: {
      return <div className="error-container">What you're trying to do is not allowed.</div>
    }
    case 404: {
      return <div className="error-container">Hmmm. Not sure about this product "{params.productId}"?</div>
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`)
    }
  }
}

export const ErrorBoundary = () => {
  const { productId } = useParams()
  return <div className="error-container">{`There was an error loading product by the id ${productId}. Sorry.`}</div>
}
