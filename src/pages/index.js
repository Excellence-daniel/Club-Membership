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

    componentDidMount(){
        var status = localStorage.getItem("LOGIN")
        this.setState({status})
        var club = localStorage.getItem("ClubJoined")
        console.log(club)
        if (club){
            var user = fire.auth().currentUser
            console.log("USER", user)
            if (user){
            const gUser = db.collection('Users').where("Email", "==", user.email)
            let userID, Clubssjoined;
            if (gUser !== null){
                gUser.forEach((snapshot)=>{
                userID = snapshot.id
                Clubssjoined = snapshot.ClubsJoined
                })
            }
            Clubssjoined.push(club)
            db.collection('Users').doc(userID).update({
                ClubsJoined : Clubssjoined 
            })
        }
            
        }
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