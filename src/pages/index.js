import React, {Component} from 'react'

import Header from './header'
import {fire, db} from './config/fire'

class LandingPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            //loginStatus : false
            status : false
        }
    }

    componentDidMount (){
        var status = localStorage.getItem("LOGIN")
        let Clubssjoined = [];
        let userID, emailVerified;
        this.setState({status})
        var club = localStorage.getItem("ClubJoined")
        console.log("CLUBBB", club)
    }

    render(){
        return (
            <div>
                <Header isloggedIn ={this.state.status}/>
            </div>
        )
    }
}

export default LandingPage;