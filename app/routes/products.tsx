import { Outlet, Link, useLoaderData, useCatch } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { NavBar } from '~/components/navbar/navBar'
import type { LinksFunction } from '@remix-run/node'
import stylesUrl from '~/styles/products.css'
import type { Product, PagingParams } from '../common/types'
import { useState } from 'react'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export const loader: LoaderFunction = async () => {
  const page = 1
  const pageSize = 2
  const apiKey = process.env.REACT_APP_API_KEY!
  const apiUrl = process.env.REACT_APP_API_URL!
  const res = await fetch(`${apiUrl}/products?page=${page}&pageSize=${pageSize}&dir=desc&sort=created_at`, {
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
  })
  return json(await res.json())
}

const PaginatedData = ({ params }: { params: PagingParams<Product> }) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [allData, setAllData] = useState<Product[]>(params.data)
  const [totalCount, setTotalCount] = useState<number>(params.totalCount ?? 0)

  const handleLoadMore = async () => {
    setIsLoading(true)
    //@ts-ignore
    const apiKey = window.ENV.REACT_APP_API_KEY
    //@ts-ignore
    const apiUrl = window.ENV.REACT_APP_API_URL
    try {
      const nextPage = currentPage + 1
      const pageSize = 2
      const response = await fetch(
        `${apiUrl}/products?page=${nextPage}&pageSize=${pageSize}&dir=desc&sort=created_at`,
        {
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
          },
        }
      )
      const newData: PagingParams<Product> = await response.json()
      setAllData((prevData) => [...prevData, ...newData?.data])
      setCurrentPage(nextPage)
      setTotalCount(newData.totalCount)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setIsLoading(false)
  }

  return (
    <div>
      {allData.map((item) => (
        <div key={item.id}>
          {/* Render your data here */}
          {item.name} {item.price} {}
        </div>
      ))}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <button onClick={handleLoadMore} disabled={allData.length >= totalCount}>
          Load More
        </button>
      )}
    </div>
  )
}

const ProductsRoute = () => {
  const products = useLoaderData()
  return (
    <div className="page-container">
      <NavBar />
      <div>
        <h1>This is the products page</h1>
        {/* {products?.data?.map((product: Product) => (
        <div key={product.id}>{product.name} {product.price}</div>
      ))} */}
        <PaginatedData params={products} />
        {/* <Outlet /> */}
      </div>
    </div>
  )
}

export default ProductsRoute

export const CatchBoundary = () => {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div className="error-container">There are no products to display.</div>
  } else if (caught.status === 401) {
    return <div className="error-container">You are not authorized to view this page.</div>
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}

export const ErrorBoundary = () => {
  return <div className="error-container">Uh oh! Something went wrong.</div>
}
