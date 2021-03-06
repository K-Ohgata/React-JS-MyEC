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
      errors.name = '????????????????????????????????????'
    } else {
      delete errors.name
    }

    if (cartInfo.mailAddress === '') {
      errors.email = '????????????????????????????????????????????????'
    } else {
      if (mail.test(cartInfo.mailAddress)) {
        delete errors.email
      } else {
        setCartInfo({ ...cartInfo, mailAddress: '' })
        errors.email = '?????????????????????????????????????????????'
      }
    }

    if (cartInfo.addressNumber === '') {
      errors.addressnum = '???????????????????????????????????????'
    } else {
      if (addressnum.test(cartInfo.addressNumber)) {
        delete errors.addressnum
      } else {
        setCartInfo({ ...cartInfo, addressNumber: '' })
        errors.addressnum = '???????????????xxx-xxxx????????????????????????????????????'
      }
    }

    if (cartInfo.address === '') {
      errors.address = '?????????????????????????????????'
    } else {
      delete errors.address
    }

    if (cartInfo.phoneNumber === '') {
      errors.tel = '???????????????????????????????????????'
    } else {
      if (tel.test(cartInfo.phoneNumber)) {
        delete errors.tel
      } else {
        setCartInfo({ ...cartInfo, phoneNumber: '' })
        errors.tel = '???????????????xxx-xxxx-xxxx????????????????????????????????????'
      }
    }

    if (cartInfo.deliveryDate === '') {
      errors.date = '???????????????????????????????????????'
    } else if (cartInfo.deliveryDate && selectDay < today) {
      errors.date = "????????????????????????????????????????????????"
    } else if (cartInfo.deliveryDate && selectDay === today) {
      if (cartInfo.deliveryTime === '') {
        errors.time = '???????????????????????????????????????'
      } else if (hour > 18) {
        errors.time = "????????????????????????????????????????????????";
      } else if (cartInfo.deliveryTime && (Number(cartInfo.deliveryTime) < hour || Number(cartInfo.deliveryTime) < hour + 3)) {
        errors.time = "????????????3???????????????????????????????????????";
        radioDeselectionTime()
      }
    } else {
      delete errors.date
      delete errors.time;
    }

    if (cartInfo.status === 0) {
      errors.status = '??????????????????????????????????????????'
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
      <h1><u className={classes.underline}>??????????????????</u></h1>
      <table className={classes.table}>
        <tr className={classes.title}>
          <th>?????????</th>
          <th>??????????????????</th>
          <th>?????????</th>
          <th>??????</th>
          <th>???????????????</th>
          <th>??????(??????)</th>
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
        <div>????????????{culcTax()} ???</div>
        <div><u className={classes.underline}>???????????????{culcPrice()} ??? (??????)</u></div>
      </div>

      <h2 className={classes.subtitle}>??????????????????</h2>
      <div className={classes.form}>
        <table className={classes.formTable}>
          <tr className={classes.odd}>
            <td>??????</td>
            <td>
              <div className={classes.error}>{errorText.name}</div>
              <input type="text" value={cartInfo.userName} onChange={(e) => { setCartInfo({ ...cartInfo, userName: e.target.value }) }} placeholder="????????????" />
            </td>
          </tr>
          <tr className={classes.even}>
            <td>?????????????????????</td>
            <td>
              <div className={classes.error}>{errorText.email}</div>
              <input type="text" value={cartInfo.mailAddress} onChange={(e) => { setCartInfo({ ...cartInfo, mailAddress: e.target.value }) }} placeholder="coffee@xxxx.com" />
            </td>
          </tr>
          <tr className={classes.odd}>
            <td>????????????</td>
            <td>
              <div className={classes.error}>{errorText.addressnum}</div>
              <input type="text" value={cartInfo.addressNumber} onChange={(e) => { setCartInfo({ ...cartInfo, addressNumber: e.target.value }) }} placeholder="xxx-xxxx" />
            </td>
          </tr>
          <tr className={classes.even}>
            <td>??????</td>
            <td>
              <div className={classes.error}>{errorText.address}</div>
              <input type="text" value={cartInfo.address} onChange={(e) => { setCartInfo({ ...cartInfo, address: e.target.value }) }} placeholder="??????????????????" />
            </td>
          </tr>
          <tr className={classes.odd}>
            <td>????????????</td>
            <td>
              <div className={classes.error}>{errorText.tel}</div>
              <input type="text" value={cartInfo.phoneNumber} onChange={(e) => { setCartInfo({ ...cartInfo, phoneNumber: e.target.value }) }} placeholder="xxx-xxxx-xxxx" />
            </td>
          </tr>
          <tr className={classes.even}>
            <td>????????????</td>
            <td>
              <div className={classes.error}>{errorText.date}</div>
              <input type="date" value={cartInfo.deliveryDate} onChange={(e) => { setDate(e) }} />
              <div className="spacer"></div>
              <div className={classes.error}>{errorText.time}</div>
              <input type="radio" name="time" value="10" id="10" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="10">&nbsp;10???</label>
              <input type="radio" name="time" value="11" id="11" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="11">&nbsp;11???</label>
              <input type="radio" name="time" value="12" id="12" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="12">&nbsp;12???</label>
              <div className="spacer"></div>
              <input type="radio" name="time" value="13" id="13" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="13">&nbsp;13???</label>
              <input type="radio" name="time" value="14" id="14" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="14">&nbsp;14???</label>
              <input type="radio" name="time" value="15" id="15" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="15">&nbsp;15???</label>
              <div className="spacer"></div>
              <input type="radio" name="time" value="16" id="16" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="16">&nbsp;16???</label>
              <input type="radio" name="time" value="17" id="17" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="17">&nbsp;17???</label>
              <input type="radio" name="time" value="18" id="18" onChange={(e) => { setCartInfo({ ...cartInfo, deliveryTime: e.target.value }) }} /><label htmlFor="18">&nbsp;18???</label>
            </td>
          </tr>
        </table>
      </div>

      <h2 className={classes.subtitle}>??????????????????</h2>
      <div className={classes.form}>
          {errorText.status &&
            <div className={classes.error}>{errorText.status}</div>
          }
        <table className={classes.formTable}>
          <tr>
            <td className={classes.odd}><input type="radio" name="pay" value="1" id="1" onChange={(e) => { setCartInfo({ ...cartInfo, status: e.target.value }) }} /><label htmlFor="1">&nbsp;????????????</label></td>
          </tr>
          <tr>
            <td className={classes.even}><input type="radio" name="pay" value="2" id="2" onChange={(e) => { setCartInfo({ ...cartInfo, status: e.target.value }) }} /><label htmlFor="2">&nbsp;????????????????????????</label></td>
          </tr>
        </table>
      </div>

      <div><button onClick={() => validation()} className={classes.button}>??????</button></div>
    </div>
  )
}

const useStyle = makeStyles(() =>
  createStyles({
    "body": {
      paddingTop: "100px", // ??????????????????????????????????????????????????????????????????
      minHeight: "81vh", //????????????????????????????????????footer?????????????????????????????????(100vh?????????????????????100%)
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



// //react-hook-form????????????
// import React from "react";
// import { useForm } from "react-hook-form";

// export function Check() {
//   const { register, watch, formState: { errors }, handleSubmit } = useForm();
//   const onSubmit = data => console.log(data);
//   const num=1
//   const check=()=>{
//     if(num===1){
//       return '1??????'
//     }else{
//       return '1?????????????????????'
//     }
//   }
//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div>
//         <input {...register("name", { required: true })} />
//         {errors.name && <div>????????????????????????????????????</div>}
//       </div>

//       <div>
//         <input {...register("mail",
//           {
//             required: '????????????????????????????????????????????????',
//             pattern: {
//               value: /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9_-]+[a-zA-Z0-9._-]+$/,
//               message: '?????????????????????????????????????????????'
//             },
//           })} />
//         {errors.mail && <div className="error-message">{errors.mail.message}</div>}
//       </div>

//       <div>
//         <input {...register("addressNumber",
//           {
//             required: '???????????????????????????????????????',
//             pattern: {
//               value: /^\d{3}-\d{4}$/,
//               message: '????????????????????????????????????'
//             },
//           })} />
//         {errors.addressNumber && <div className="error-message">{errors.addressNumber.message}</div>}
//         <input {...register("number",
//           {
//             required: '?????????????????????????????????',
//             pattern: {
//               value: /^\d{3}-\d{4}$/,
//               message: check()
//             },
//           })} />
//         {errors.number && <div className="error-message">{errors.number.message}</div>}
//       </div>
//       <button>??????</button>
//     </form>
//   );
// }

// // ??????  https://www.webopixel.net/javascript/1606.html