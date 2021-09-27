export const SETLOGINUSER='setLoginUser'
export const DELETELOGINUSER='setLoginUser'
export const FETCHCARTITEM='fetchCartItem'
export const FETCHCOFFEE='fetchCoffee'
export const FETCHTOPPING='fetchTopping'
export const ADDITEM='addItem'
export const DELETEITEM='deleteItem'
export const RESETCART='resetCart'

export const setLoginUser=(user)=>({
  type:SETLOGINUSER,
  loginUser:user
})

export const deleteLoginUser=()=>({
  type:DELETELOGINUSER,
})

export const fetchCartItem=(cartItem)=>({
  type:FETCHCARTITEM,
  Cart: cartItem
})

export const fetchCoffee=(coffee)=>({
  type:FETCHCOFFEE,
  Coffee: coffee
})

export const fetchTopping=(topping)=>({
  type:FETCHTOPPING,
  Topping: topping
})

export const addItem=(itemInfo)=>({
  type:ADDITEM,
  cartItemList: itemInfo
})

export const deleteItem=(cartItem)=>({
  type:DELETEITEM,
  cartItemList: cartItem
})

export const resetCart=()=>({
  type:RESETCART,
})