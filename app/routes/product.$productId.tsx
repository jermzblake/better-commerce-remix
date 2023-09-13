import { useLoaderData, useParams, useCatch } from '@remix-run/react'
import type { LoaderFunction, ActionFunction, V2_MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import type { Product } from '../common/types'
import { NavBar } from '~/components/navbar/navBar'

export const meta: V2_MetaFunction = ({
  data,
}: {
  data: Product | undefined;
}) => {
  if (!data) {
    return [
      {title: "No product"},
      {description: "No product found"},
    ];
  }
  return [
    {title: `"${data.name}" product`},
    {description: `Enjoy the "${data.name}" product and much more`},
  ];
};

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
    throw new Response("Might have better luck finding Carmen Sandiego.. This product not found", {
      status: 404
    })
    
  }
  return json(await productData.json())

}

const ProductRoute = () => {
  const product = useLoaderData<Product>()
  return (
    <div className="page-container">
      <NavBar />
    {/* render product display */}
    <div><img src={product.media.thumbnail} alt="product" /></div>
    <div>{product.name}</div>
    <div>{product.description}</div>
    <div>{product.price}</div>
    <div><button>add to cart</button></div>
    {/* TODO render some other product related things after product display */}
    </div>
  )
}

export default ProductRoute

export const CatchBoundary = () => {
  const caught = useCatch();
  const params = useParams();
  switch (caught.status) {
    case 400: {
      return (
        <div className="error-container">
          What you're trying to do is not allowed.
        </div>
      );
    }
    case 404: {
      return (
        <div className="error-container">
          Hmmm. Not sure about this product "{params.productId}"?
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
  
    }
  }

}

export const ErrorBoundary = () => {
  const { productId } = useParams();
  return (
    <div className="error-container">{`There was an error loading product by the id ${productId}. Sorry.`}</div>
  );
}