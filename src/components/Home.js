import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/styles';

const coffeeSelector = state => state.store.coffee

export const Home = () => {
  const classes = useStyle()

  const fetchcoffee = useSelector(coffeeSelector)

  const history = useHistory()
  const handleLink = path => history.push(path)

  const [keyword, setKeyword] = useState('')
  const [coffee, setCoffee] = useState()

  const searchCoffee = () => {
    let search = []
    fetchcoffee.forEach((item) => {
      if (item.name.indexOf(keyword) > -1) {
        search.push(item)
      }
    })
    if (search.length === 0) {
      alert('該当する商品はありません')
      setCoffee(fetchcoffee)
    } else {
      setCoffee(search)
    }
  }

  const clear = () => {
    setKeyword('')
    setCoffee(fetchcoffee)
  }


  const displayCoffee = () => {
    return (
      <React.Fragment>
        <h1><u className={classes.underline}>商品検索</u></h1>
        <div>
          <input type='text' placeholder='商品を検索' value={keyword} onChange={(e) => { setKeyword(e.target.value) }} className={classes.text} />
          <button onClick={() => { searchCoffee() }} className={classes.button}>検索</button>
          <button onClick={() => { clear() }} className={classes.button}>クリア</button>
        </div>
        <div className={classes.list}>
        {!coffee && fetchcoffee.map((item) => {
          return (
            <div className={classes.card}>
              <img src={item.pic} alt='coffee' onClick={() => handleLink(`detail/${item.id}`)} className={classes.pic} />
              <div onClick={() => handleLink(`detail/${item.id}`)} className={classes.name}>{item.name}</div>
              <div className={classes.cardContent}>
                <div>Mサイズ:{item.msizePrice} 円</div>
                <div>Lサイズ:{item.lsizePrice} 円</div>
              </div>
                <button onClick={() => handleLink(`detail/${item.id}`)} className={classes.button}>商品詳細へ</button>
            </div>
          )
        })}
        {coffee && coffee.map((item) => {
          return (
            <div className={classes.card}>
              <img src={item.pic} alt='coffee' onClick={() => handleLink(`detail/${item.id}`)} className={classes.pic} />
              <div onClick={() => handleLink(`detail/${item.id}`)} className={classes.name}>{item.name}</div>
              <div className={classes.cardContent}>
                <div>Mサイズ:{item.msizePrice} 円</div>
                <div>Lサイズ:{item.lsizePrice} 円</div>
              </div>
                <button onClick={() => handleLink(`detail/${item.id}`)} className={classes.button}>商品詳細へ</button>
            </div>
          )
        })}
        </div>
      </React.Fragment>
    )
  }

  return (
    <div className={classes.body}>
      {displayCoffee()}
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
    "card": {
      width: "350px",
      background: "#FFF",
      borderRadius: "10px",
      boxShadow: "5px 5px 5px #ccc",
      marginBottom: "40px",
    },
    "pic": {
      width: "350px",
      height: "350px",
      cursor:"pointer"
    },
    "name": {
      fontSize: "20px",
      fontWeight: 700,
      marginTop: "10px",
      textAlign: "center"
    },
    "cardContent": {
      padding: "5px",
      textAlign: "center",
      fontWeight: 700,
      marginBottom: "5px",
    },
    "button": {
      borderColor: "#c4872d",
      color: "#c4872d",
      fontWeight: 600,
      marginRight: "2px",
      marginBottom: "8px",
      backgroundColor: "#fff",
      padding: "10px",
      cursor:"pointer",
      "&:hover": {
        backgroundColor: "#c4872d",
        color: "#fff"
      }
    },
    "text": {
      width: "250px",
      height: "38px",
      marginRight: "15px"
    },
    "list": {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
      height: "auto",
      width: "auto",
      padding: "5%",
    },
    "underline":{
      textDecoration:"none",
      borderBottom:"double 5px #c4872d",
  }
    
  })
)