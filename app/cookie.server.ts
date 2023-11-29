import { createCookie } from '@remix-run/node'

export const shoppingCartCookie = createCookie('shopping_cart', {
  maxAge: 604_800, // one week
})

export const clearShoppingCartCookie = () => {
  return shoppingCartCookie.serialize([])
}
