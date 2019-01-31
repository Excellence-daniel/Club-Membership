/* eslint-disable */
import React, { Component } from 'react';
import fire from './config/fire'
// import Home from './pages/homePage'
// import Login from './pages/login'
import Links from './links'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user : {}, 
      email : '', 
      password : ''
    }
  }

  componentDidMount(){
    this.authListener()
  }

  authListener(){
    fire.auth().onAuthStateChanged((user) => {
      if(user){
        this.setState({user})
      } else {
        this.setState({user : null})
      }
    })
  }

  login = () => {
    fire.auth().signInWithEmailAndPassword(this.setState.email, this.state.password).then((u)=> {
    }).catch((error)=>{
      console.log(error)
    })
  }
 
  render(){
    return (
        <div> 
            <Links/>
        </div>
    )
  }
}
  

export default App;
