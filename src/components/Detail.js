import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../actions/action';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import { makeStyles, createStyles } from '@material-ui/styles';

const loginSelector = state => state.store.loginUser
const cartSelector = state => state.store.cart
const coffeeSelector = state => state.store.coffee
const toppingSelector = state => state.store.topping

export const Detail = () => {
  const classes = useStyle()

  const history = useHistory()
  const handleLink = path => history.push(path)

  const dispatch = useDispatch()

  const login = useSelector(loginSelector)
  const cart = useSelector(cartSelector)
  const coffee = useSelector(coffeeSelector)
  const topping = useSelector(toppingSelector)

  const [flag, setFlag] = useState(false)
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [toppings, setToppings] = useState([])
  const [error, setError] = useState('')

  const { id } = useParams()
  let select = coffee.find((cafe) => cafe.id === Number(id))

  const displayCoffee = () => {
    return (
      <React.Fragment>
        <img src={select.pic} alt='coffee' className={classes.pic} />
        <div className={classes.name}>{select.name}</div>
        <div className={classes.size}>
        <div><label htmlFor='M'><input type='radio' id='M' name='size' value='M' onClick={(e) => setSize(e.target.value)} />Mサイズ:{select.msizePrice} 円</label></div>
        <div><label htmlFor='L'><input type='radio' id='L' name='size' value='L' onClick={(e) => setSize(e.target.value)} />Lサイズ:{select.lsizePrice} 円</label></div>
        </div>
        {!size&&<div className={classes.error}>{error}</div>}
      </React.Fragment>
    )
  }

  const setToppingList = (e) => {
    if (toppings.includes(e.target.value)) {
      setToppings(toppings.filter(item => item !== e.target.value))
    } else {
      setToppings([...toppings, e.target.value])
    }
  }

  const displayTopping = () => {
    return (
      topping.map((item) => {
        return (
          <div className={classes.toppingList}>
            <label htmlFor={item.name}><input type='checkbox' name="topping" value={item.name} id={item.name} onClick={(e) => setToppingList(e)} /> {item.name}</label>
          </div>
        )
      })
    )
  }

  const totalPrice = () => {
    if (size === "M") {
      return select.msizePrice * quantity + toppings.length * 200 * quantity
    } else if (size === "L") {
      return select.lsizePrice * quantity + toppings.length * 300 * quantity
    } else {
      return 0
    }
  }

  const setCartItem = () => {
    if (login) {
      firebase.firestore()
        .collection(`users/${login.uid}/carts`)
        .doc(cart.id) // curryCart[0].id
        .update({ cartItemList: cart.cartItemList })
    }
  }


  const trueFlag = () => {
    if (size === '') {
      setError('サイズを選択して下さい')
    } else {
      const itemInfo = {
        id: Number(id),
        size: size,
        quantity: Number(quantity),//quantityは文字列。totalpriceはなぜかこれで計算できる
        topping: toppings,
        total: totalPrice()
      }
      dispatch(addItem(itemInfo))
      setCartItem()
      alert('商品をカートに追加しました')
      setFlag(true)
    }
  }

  return (
    <div className={classes.body}>
      <h1><u className={classes.underline}>商品詳細</u></h1>
      <div>{displayCoffee()}</div>
      <div className={classes.count}>数量:
        <select name="number" onChange={(e) => setQuantity(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
      </div>
      <div>トッピング：１つにつき M 200円(税抜) L 300円(税抜)</div>
      <div className={classes.topping}>{displayTopping()}</div>
      <div className={classes.price}>
        {totalPrice() === 0
          ? <div><u className={classes.underline}>合計金額：0 円 (税抜)</u></div>
          : <div><u className={classes.underline}>合計金額：{totalPrice()} 円 (税抜)</u></div>
        }
      </div>
      <div>
        {!flag ?
          <button onClick={() => trueFlag()} className={classes.button}>カートに入れる</button>
          :
          <React.Fragment>
            <button onClick={() => handleLink('/')} className={classes.button}>商品一覧へ戻る</button>
            <button onClick={() => handleLink('/cart')} className={classes.button}>カートへ</button>
          </React.Fragment>
        }
      </div>
    </div>
  )
}

const useStyle = makeStyles(() =>
  createStyles({
    "body": {
      textAlign: "center",
      paddingTop: "100px", // ヘッダーの後ろに要素が隠れないようにするため
      minHeight: "81vh", //コンテナ要素が少ない時にfooterを画面下部に表示する用(100vhでビューポート100%)
      backgroundColor: "#eece9a15",
    },
    "pic": {
      width: "400px",
      height: "350px",
      boxShadow: "5px 5px 5px #ccc",
    },
    "size": {
      fontSize: "18px",
      fontWeight: 400,
      marginBottom:"5px"
    },
    "name": {
      fontSize: "25px",
      fontWeight: 700,
    },
    "error": {
      color: "red",
      fontWeight: 700
    },
    "count": {
      fontSize: "18px",
      marginBottom: "10px"
    },
    "topping": {
      padding: "10px",
      margin: "7px",
      color: "#232323",
      backgroundColor: "#c3a78080",
      borderLeft: "solid 10px #42231a90",
      width: "60%",
      display: "inline-block"
    },
    "toppingList":{
      display:"inline-block",
    },
    "price": {
      fontSize: "18px",
      margin: "10px auto",
      fontWeight: 700
    },
    "button": {
      borderColor: "#c4872d",
      color: "#c4872d",
      fontWeight: 600,
      marginRight: "2px",
      marginBottom: "8px",
      backgroundColor: "#fff",
      padding: "10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#c4872d",
        color: "#fff"
      }
    },
    "underline":{
      textDecoration:"none",
      borderBottom:"double 5px #c4872d",
  }
  })
)