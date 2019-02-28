import firebase from 'firebase'
var config = {

  authDomain: "club-membership-app.firebaseapp.com",
  databaseURL: "https://club-membership-app.firebaseio.com",
  projectId: "club-membership-app",
  storageBucket: "club-membership-app.appspot.com",
  messagingSenderId: "212750426539"
};

  export const fire = firebase.initializeApp(config)
  export const db = firebase.firestore()
  

  // export default fire;
