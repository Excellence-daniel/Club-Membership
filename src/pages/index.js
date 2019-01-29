import React, {Component} from 'react'

import Header from './header'
// import {fire} from './config/fire'

class LandingPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            loginStatus : false
        }
    }

    // logOut = (e) => {
    //       e.preventDefault()
    //       fire.auth().signOut()
    //       .then(function(){
    //           alert("Signed Out")
    //           localStorage.setItem("LOGIN STATUS", false")
    //       })
    //         this.setState({loginStatus : false, redirect :true})
    //         console.log("Signed Out")

    //     console.log("HEY")
    //   }

    render(){
        return (
            <div>
                <Header/>
            </div>
        )
    }
}

export default LandingPage;