import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyDD0C4cg4dWTTUzq-wnJaaln5UsNjXAyIc",
    authDomain: "tottile-1.firebaseapp.com",
    databaseURL: "https://tottile-1.firebaseio.com",
    projectId: "tottile-1",
    storageBucket: "tottile-1.appspot.com",
    messagingSenderId: "684520270866"
  };
var fire = firebase.initializeApp(config);
export default fire;
