import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import { fetchCartItem } from '../actions/action'
import { makeStyles, createStyles } from '@material-ui/styles';

const loginSelector = state => state.store.loginUser
const coffeeSelector = state => state.store.coffee
const cartSelector = state => state.store.cart

export const Check = () => {
  const classes = useStyle()

  const dispatch = useDispatch()

  const history = useHistory()
  const handleLink = path => history.push(path)

  const login = useSelector(loginSelector)
  const coffee = useSelector(coffeeSelector)
  const cart = useSelector(cartSelector)

  const [myCart, setMyCart] = useState([])
  const [cartItem, setCartItem] = useState([])
  const [choiceCoffee, setChoiceCoffee] = useState([])
  const [cartInfo, setCartInfo] = useState({})
  const [orderday, setOrderDay] = useState('')

  useEffect(() => {
    let info = []
    let carts = []
    let coffees = []
    const orderdate = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
    if (cart) {
      for (let i = 0; i < coffee.length; i++) {
        for (let j = 0; j < cart.cartItemList.length; j++) {
          if (coffee[i].id === cart.cartItemList[j].id) {
            info.push({
              coffee: coffee[i],
              cart: cart.cartItemList[j]
            })
            coffees.push(coffee[i])
            carts.push(cart.cartItemList[j])
          }
        }
      }
      setMyCart(info)
      setChoiceCoffee(coffees)
      setCartItem(carts)
      setCartInfo(cart)
      setOrderDay(orderdate)
    }
  }, [])

  const culcTax = () => {
    let totalTax = 0
    cartItem.forEach((item) => {
      totalTax += item.total
    })
    totalTax = totalTax * 0.1
    return totalTax
  }

  const culcPrice = () => {
    let totalPrice = 0
    cartItem.forEach((item) => {
      totalPrice += item.total
    })
    totalPrice = totalPrice + totalPrice * 0.1
    return totalPrice
  }

  const [errorText, setErrorText] = useState({
    name: "",
    email: "",
    addressnum: "",
    address: "",
    tel: "",
    date: "",
    time: "",
    status: "",
  })

  const updateCart = () => {

    firebase.firestore()
      .collection(`users/${login.uid}/carts`)
      .doc(cartInfo.id)
      .update(cartInfo)
  }

  const addCart = () => {
    let cartItem = {};
    firebase
      .firestore()
      .collection(`users/${login.uid}/carts`)
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
        cartItemList: []
      }).then(doc => {
        cartItem = {
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
        dispatch(fetchCartItem(cartItem))
      })
  }

  const setDate = (e) => {
    setCartInfo({ ...cartInfo, orderDate: orderday, deliveryDate: e.target.value })
  }

  const validation = () => {
    let errors = Object.assign({}, errorText)
    const mail = (/^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9_-]+[a-zA-Z0-9._-]+$/)
    const addressnum = (/^[0-9]{3}-[0-9]{4}$/)
    const tel = (/^[0-9]{3}-[0-9]{4}-[0-9]{4}$/)

    const today = Number(`${new Date().getFullYear()}` + `${new Date().getMonth() + 1}` + `${new Date().getDate()}`)
    const selectDay = Number(`${new Date(cartInfo.deliveryDate).getFullYear()}` + `${new Date(cartInfo.deliveryDate).getMonth() + 1}` + `${new Date(cartInfo.deliveryDate).getDate()}`)
    const hour = new Date().getHours()


    if (cartInfo.userName === '') {
      errors.name = 'お名前を入力してください'
    } else {
      delete errors.name
    }

    if (cartInfo.mailAddress === '') {
      errors.email = 'メールアドレスを入力してください'
    } else {
      if (mail.test(cartInfo.mailAddress)) {
        delete errors.email
      } else {
        setCartInfo({ ...cartInfo, mailAddress: '' })
        errors.email = 'メールアドレスの形式が不正です'
      }
    }

    if (cartInfo.addressNumber === '') {
      errors.addressnum = '郵便番号を入力してください'
    } else {
      if (addressnum.test(cartInfo.addressNumber)) {
        delete errors.addressnum
      } else {
        setCartInfo({ ...cartInfo, addressNumber: '' })
        errors.addressnum = '郵便番号はxxx-xxxxの形式で入力してください'
      }
    }

    if (cartInfo.address === '') {
      errors.address = '住所を入力してください'
    } else {
      delete errors.address
    }

    if (cartInfo.phoneNumber === '') {
      errors.tel = '電話番号を入力してください'
    } else {
      if (tel.test(cartInfo.phoneNumber)) {
        delete errors.tel
      } else {
        setCartInfo({ ...cartInfo, phoneNumber: '' })
        errors.tel = '電話番号はxxx-xxxx-xxxxの形式で入力してください'
      }
    }

    if (cartInfo.deliveryDate === '') {
      errors.date = '配達日時を指定してください'
    } else if (cartInfo.deliveryDate && selectDay < today) {
      errors.date = "今日以降の日付を入力してください"
    } else if (cartInfo.deliveryDate && selectDay === today) {
      if (cartInfo.deliveryTime === '') {
        errors.time = '配達時間を指定してください'
      } else if (hour > 18) {
        errors.time = "明日以降の日付を選択してください";
      } else if (cartInfo.deliveryTime && (Number(cartInfo.deliveryTime) < hour || Number(cartInfo.deliveryTime) < hour + 3)) {
        errors.time = "現在から3時間以降を指定してください";
        radioDeselectionTime()
      }
    } else {
      delete errors.date
      delete errors.time;
    }

    if (cartInfo.status === 0) {
      errors.status = 'どちらか一方をお選びください'
    } else {
      delete errors.status
    }
    setErrorText(errors)

    if (Object.keys(errors).length === 0) {
      updateCart()
      addCart()
      handleLink('/done')
    }
  }

  const radioDeselectionTime = () => {
    for (const element of document.getElementsByName('time')) {
      element.checked = false;
    }
  }

  return (
    <div className={classes.body}>
      <h1><u className={classes.underline}>商品確認画面</u></h1>
      <table className={classes.table}>
        <tr className={classes.title}>
          <th>商品名</th>
          <th>商品イメージ</th>
          <th>サイズ</th>
          <th>数量</th>
          <th>トッピング</th>
          <th>小計(税抜)</th>
        </tr>
        {
          myCart.map((item) => {
            return (
              <tr className={classes.cartItem}>
                <td>{item.coffee.name}</td>
                <td><img src={item.coffee.pic} alt="product" witdh="150px" height="150px" className={classes.pic} /></td>
                <td>{item.cart.size}</td>
                <td>{item.cart.quantity}</td>
                <td>{item.cart.topping.map((topping) => {
                  return <div>{topping}</div>
                })}</td>
                <td>{item.cart.total}</td>
              </tr>
            )
          })
        }
      </table>
      <div className={classes.price}>
        <div>消費税：{culcTax()} 円</div>
        <div><u className={classes.underline}>合計金額：{culcPrice()} 円 (税込)</u></div>
      </div>

      <h2 className={classes.subtitle}>お届け先情報</h2>
      <div className={classes.form}>
        <table className={classes.formTable}>
          <tr className={classes.odd}>
            <td>名前</td>
            <td>
              <div className={classes.error}>{errorText.name}</div>
              <input type="text" value={cartInfo.userName} onChange={(e) => { setCartInfo({ ...cartInfo, userName: e.target.value }) }} placeholder="山田太郎" />
            </td>
          </tr>
          <tr className={classes.even}>
            <td>メールアドレス</td>
            <td>
              <div className={classes.error}>{errorText.email}</div>
              <input type="text" value={cartInfo.mailAddress} onChange={(e) => { setCartInfo({ ...cartInfo, mailAddress: e.target.value }) }} placeholder="coffee@xxxx.com" />
            </td>
          </tr>
          <tr className={classes.odd}>
            <td>郵便番号</td>
            <td>
              <div className={classes.error}>{errorText.addressnum}</div>
              <input type="text" value={cartInfo.addressNumber} onChange={(e) => { setCartInfo({ ...cartInfo, addressNumber: e.target.value }) }} placeholder="xxx-xxxx" />
            </td>
          </tr>
          <tr className={classes.even}>
            <td>住所</td>
            <td>
              <div className={classes.error}>{errorText.address}</div>
              <input type="text" value={cartInfo.address} onChange={(e) => { setCartInfo({ ...cartInfo, address: e.target.value }) }} placeholder="東京都新宿区" />
            </td>
          </tr>
          <tr className={classes.odd}>
            <td>電話番号</td>
            <td>
              <div className={classes.error}>{errorText.tel}</div>
              <input type="text" value={cartInfo.phoneNumber} onChange={(e) => { setCartInfo({ ...cartInfo, phoneNumber: e.target.value }) }} placeholder="xxx-xxxx-xxxx" />
            </td>
          </tr>
          <tr className={classes.even}>
            <td>配達日時</td>
            <td>
              <div className={classes.error}>{errorText.date}</div>
              <input type="date" value={cartInfo.deliveryDate} onChange={(e) => { setDate(e) }} />
              <div className="spacer"></div>
              <div className={classes.error}>{errorText.time}</div>
              <input type="radio" name="time" value="10" id="10" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="10">&nbsp;10時</label>
              <input type="radio" name="time" value="11" id="11" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="11">&nbsp;11時</label>
              <input type="radio" name="time" value="12" id="12" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="12">&nbsp;12時</label>
              <div className="spacer"></div>
              <input type="radio" name="time" value="13" id="13" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="13">&nbsp;13時</label>
              <input type="radio" name="time" value="14" id="14" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="14">&nbsp;14時</label>
              <input type="radio" name="time" value="15" id="15" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="15">&nbsp;15時</label>
              <div className="spacer"></div>
              <input type="radio" name="time" value="16" id="16" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="16">&nbsp;16時</label>
              <input type="radio" name="time" value="17" id="17" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="17">&nbsp;17時</label>
              <input type="radio" name="time" value="18" id="18" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="18">&nbsp;18時</label>
            </td>
          </tr>
        </table>
      </div>

      <h2 className={classes.subtitle}>お支払い方法</h2>
      <div className={classes.form}>
          {errorText.status &&
            <div className={classes.error}>{errorText.status}</div>
          }
        <table className={classes.formTable}>
          <tr>
            <td className={classes.odd}><input type="radio" name="pay" value="1" id="1" onChange={(e) => { setCartInfo({ ...cartInfo, status: e.target.value }) }} /><label htmlFor="1">&nbsp;代金引換</label></td>
          </tr>
          <tr>
            <td className={classes.even}><input type="radio" name="pay" value="2" id="2" onChange={(e) => { setCartInfo({ ...cartInfo, status: e.target.value }) }} /><label htmlFor="2">&nbsp;クレジットカード</label></td>
          </tr>
        </table>
      </div>

      <div><button onClick={() => validation()} className={classes.button}>注文</button></div>
    </div>
  )
}

const useStyle = makeStyles(() =>
  createStyles({
    "body": {
      paddingTop: "100px", // ヘッダーの後ろに要素が隠れないようにするため
      minHeight: "81vh", //コンテナ要素が少ない時にfooterを画面下部に表示する用(100vhでビューポート100%)
      backgroundColor: "#eece9a15",
      textAlign: "center",
    },
    "table": {
      textAlign: "center",
      width: "80%",
      margin: "3px auto",
      paddingTop: "10px",
      borderBottom: "solid 5px #c4872d",
    },
    "title": {
      fontSize: "15px",
      fontWeight: 700,
      background: "#c4872d",
      color: "#fff",
    },
    "cartItem": {
      fontWeight: 600,
    },
    "pic": {
      width: "200px",
      height: "200px"
    },
    "button": {
      borderColor: "#c4872d",
      color: "#c4872d",
      fontWeight: 600,
      margin: "20px auto",
      backgroundColor: "#fff",
      padding: "10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#c4872d",
        color: "#fff"
      }
    },
    "price": {
      fontSize: "18px",
      fontWeight: 700,
      textAlign: "right",
      marginRight: "115px"
    },
    "underline": {
      textDecoration: "none",
      borderBottom: "double 5px #c4872d",
    },
    "form": {
      margin: "auto",
      width: "50.3%",
      fontWeight: 700,
      color: "#42231a",
    },
    "formTable": {
      textAlign: "center",
      width: "100%",
      margin: "auto",
    },
    "odd": {
      backgroundColor: "#c3a780",
    },
    "even": {
      backgroundColor: "#c4872d60",
    },
    "subtitle": {
      margin: "40px auto 0px",
      color: "#fff",
      width: "50%",
      backgroundColor: "#c4872d",
    },
    "error": {
      color: "red",
      fontWeight: 500
    },
  })
)



// //react-hook-formの使い方
// import React from "react";
// import { useForm } from "react-hook-form";

// export function Check() {
//   const { register, watch, formState: { errors }, handleSubmit } = useForm();
//   const onSubmit = data => console.log(data);
//   const num=1
//   const check=()=>{
//     if(num===1){
//       return '1です'
//     }else{
//       return '1ではありません'
//     }
//   }
//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div>
//         <input {...register("name", { required: true })} />
//         {errors.name && <div>お名前を入力してください</div>}
//       </div>

//       <div>
//         <input {...register("mail",
//           {
//             required: 'メールアドレスを入力してください',
//             pattern: {
//               value: /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9_-]+[a-zA-Z0-9._-]+$/,
//               message: 'メールアドレスの形式が不正です'
//             },
//           })} />
//         {errors.mail && <div className="error-message">{errors.mail.message}</div>}
//       </div>

//       <div>
//         <input {...register("addressNumber",
//           {
//             required: '郵便番号を入力してください',
//             pattern: {
//               value: /^\d{3}-\d{4}$/,
//               message: '郵便番号の形式が不正です'
//             },
//           })} />
//         {errors.addressNumber && <div className="error-message">{errors.addressNumber.message}</div>}
//         <input {...register("number",
//           {
//             required: '数字を入力してください',
//             pattern: {
//               value: /^\d{3}-\d{4}$/,
//               message: check()
//             },
//           })} />
//         {errors.number && <div className="error-message">{errors.number.message}</div>}
//       </div>
//       <button>送信</button>
//     </form>
//   );
// }

// // 参考  https://www.webopixel.net/javascript/1606.html