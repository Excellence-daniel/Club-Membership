import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyAFWlHfRZVyQcw-lj6chPHrhmNqJks4uGo",
    authDomain: "club-membership-190d2.firebaseapp.com",
    databaseURL: "https://club-membership-190d2.firebaseio.com",
    projectId: "club-membership-190d2",
    storageBucket: "club-membership-190d2.appspot.com",
    messagingSenderId: "1089021916226"
  };

  export const fire = firebase.initializeApp(config)
  export const db = firebase.firestore()
  

  // export default fire;