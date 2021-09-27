import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import { makeStyles, createStyles } from '@material-ui/styles';

const userSelector = state => state.store.loginUser

export const Header = () => {
  const classes = useStyle()

  const user = useSelector(userSelector)

  const history = useHistory()
  const handleLink = path => history.push(path)

  const login = () => {
    const google_auth_provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(google_auth_provider)
  }

  const logout = () => {
    firebase.auth().signOut();
  }

  return (
    <header className={classes.header}>
      <img onClick={() => { handleLink('/') }} src="../pic/header_logo.png" alt="logo" className={classes.logo}/>
      <div className={classes.right}>
        <button onClick={() => { handleLink('/') }} className={classes.button}>商品一覧</button>
        <button onClick={() => { handleLink('/cart') }} className={classes.button}>カート</button>
        <button onClick={() => { handleLink('/history') }} className={classes.button}>注文履歴</button>
        {
          user ?
            <button onClick={logout} className={classes.button}>ログアウト</button>
            :
            <button onClick={login} className={classes.button}>ログイン</button>
        }
      </div>
    </header>
  )
}

const useStyle = makeStyles(() =>
  createStyles({
    "header": {
      backgroundColor:"#c3a780",
      display: "flex",
      textDecoration: "none",
      borderBottom: "solid 5px #42231a",
      margin:"0 0 15px 0",
      padding:"5px 0 5px 0",
      position: "fixed",
      width:"100%"
    },
    "logo":{
      cursor: 'pointer',
    },
    "right": {
      margin: "auto 0 auto auto"
    },
    "button": {
      border: "none",  /* 枠線を消す */
      outline: "none", /* クリックしたときに表示される枠線を消す */
      background: "transparent", /* 背景の灰色を消す */
      cursor: 'pointer',
      margin:"0 10px 0 0",
      fontWeight:700,

      //hoverすると下線が中央始点でアニメーションする設定
      position: "relative",
      display: "inline-block",
      textDecoration: "none",
      "&::after": {
        position: "absolute",
        bottom: "-4px",
        left: '0',
        content: "''",
        width: "100%",
        height: "2px",
        background: "#333",
        transform: "scale(0, 1)",
        transition: "transform .3s",
      },
      "&:hover::after": {
        transform: "scale(1, 1)",
      },
    },
  })
)