import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import firebase from 'firebase/compat/app'
import '../service/firebase'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { setLoginUser, deleteLoginUser,fetchCartItem,fetchCoffee,fetchTopping } from '../actions/action';
import { Header } from './Header'
import { Footer } from './Footer'
import { Home } from './Home'
import { Detail } from './Detail'
import { Cart } from './Cart'
import { Check } from './Check'
import { Done } from './Done'
import { History } from './History'

const App = () => {
  const dispatch = useDispatch()

  const setUser = (user) => {
    dispatch(setLoginUser(user))
  }

  const deleteUser = () => {
    dispatch(deleteLoginUser())
  }

 const fetchCart = (user) => {
    let cartItem = {};
    firebase
      .firestore()
      .collection(`users/${user.uid}/carts`)
      .get().then(snapshot => {
        if (snapshot.empty) {
          firebase
            .firestore()
            .collection(`users/${user.uid}/carts`)
            .add({
              orderDate: "",
              userName: "",
              mailAddress: "",
              addressNumber: "",
              address: "",
              phoneNumber: "",
              deliveryDate: "",
              deliveryTime: "",
              status: 0,
              cartItemList: [],
            }).then(doc => {
              cartItem={
                id: doc.id,
                orderDate: "",
                userName: "",
                mailAddress: "",
                addressNumber: "",
                address: "",
                phoneNumber: "",
                deliveryDate: "",
                deliveryTime: "",
                status: 0,
                cartItemList: [],
              }
            })
        }
        snapshot.forEach(doc=>{
          if(doc.data().status===0){
            cartItem={ ...doc.data(), id: doc.id }
          }
        })
        dispatch(fetchCartItem(cartItem))
      })
  }

  const setCart=()=>{
    let cartItem={}
    cartItem={
      orderDate: "",
      userName: "",
      mailAddress: "",
      addressNumber: "",
      address: "",
      phoneNumber: "",
      deliveryDate: "",
      deliveryTime: "",
      status: 0,
      cartItemList: [],
    }
    dispatch(fetchCartItem(cartItem))
  }

  const setCoffee=()=>{
    let coffee=[] 
    firebase
    .firestore()
    .collection(`product`)
    .get().then(snapshot=>{
      snapshot.forEach(doc=>{
        coffee.push(doc.data())
      })
      dispatch(fetchCoffee(coffee))
    })
  }

  const setTopping=()=>{
    let topping=[] 
    firebase
    .firestore()
    .collection(`topping`)
    .get().then(snapshot=>{
      snapshot.forEach(doc=>{
        topping.push(doc.data())
      })
      dispatch(fetchTopping(topping))
    })
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user)
        fetchCart(user)
      } else {
        deleteUser()
        setCart()
      }
      setCoffee()
      setTopping()
    })
  }, [])

  return (
    <React.Fragment>
      <Router>
        <Header />
        <Switch>
          <Route path='/' exact component={Home}></Route>
          <Route path='/detail/:id' component={Detail}></Route>
          <Route path='/cart' component={Cart}></Route>
          <Route path='/check' component={Check}></Route>
          <Route path='/done' component={Done}></Route>
          <Route path='/history' component={History}></Route>
        </Switch>
        <Footer/>
      </Router>
    </React.Fragment>
  );
}

export default App;