import firebase from 'firebase/compat/app'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsrfKbvaklnMgMZjWQ7iNH4zLAmYddFeg",
  authDomain: "my-react-ec.firebaseapp.com",
  projectId: "my-react-ec",
  storageBucket: "my-react-ec.appspot.com",
  messagingSenderId: "556825504138",
  appId: "1:556825504138:web:f0a819d1752e9521030073",
  measurementId: "G-EQSBHH86RE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);