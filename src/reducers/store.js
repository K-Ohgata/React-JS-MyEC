import { SETLOGINUSER, DELETELOGINUSER, FETCHCARTITEM, FETCHCOFFEE, FETCHTOPPING,ADDITEM,DELETEITEM,RESETCART } from '../actions/action'

const initialState = {
  loginUser: null,
  cart: {},
  coffee: [],
  topping: []
}

export const store = (state = initialState, action) => {
  switch (action.type) {
    case SETLOGINUSER:
      return { ...state, loginUser: action.loginUser }

    case DELETELOGINUSER:
      return { ...state, loginUser: null, cart: [] }

    case FETCHCARTITEM:
      let cartItem = Object.assign({},state.cart)
      cartItem=action.Cart
      return { ...state, cart: cartItem }

    case FETCHCOFFEE:
      let coffeeItem = state.coffee.slice()
      coffeeItem = action.Coffee
      return { ...state, coffee: coffeeItem }

    case FETCHTOPPING:
      let toppingItem = state.topping.slice()
      toppingItem = action.Topping
      return { ...state, topping: toppingItem }

    case ADDITEM:
      let cartInfo = Object.assign({},state.cart)
      cartInfo.cartItemList.push(action.cartItemList)
      return{...state,cart:cartInfo}

    case DELETEITEM:
      let newCart = Object.assign({},state.cart)
      newCart.cartItemList=action.cartItemList
      return{...state,cart:newCart}

    case RESETCART:
      let copyCart = Object.assign({},state.cart)
      copyCart.cartItemList=[]
      return {...state,cart:copyCart}

    default:
      return state
  }
}