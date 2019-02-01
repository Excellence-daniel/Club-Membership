import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {parse} from 'query-string'

import {fire,db} from '../config/fire'

class JoinClub extends Component{
    constructor(props){
        super(props);
        this.state = {
            redirect : false, 
            redirectSignUp : false,
            email : '', //email of the person invite was sent to
            clubname : '', //club the user was invited to join
            clubtype : '',
            adminEmail : ''//the creator of the club
        }
    }

    componentDidMount(){
        console.log("DSFHNJHJFSK" , parse(this.props.location.search).name)
        var getURLVal = parse(this.props.location.search)
        this.setState({email : getURLVal.email, adminEmail : getURLVal.adminEmail, clubname :getURLVal.clubname, clubtype : getURLVal.clubtype}) 
    }

    acceptInvite = async () => {
        // alert("Yay!. You have to sign up on the app.")
        var newClub = {"Club":this.state.clubname, "Type":this.state.clubtype}
        const getUserData = await db.collection('Users').where('Email', "==", this.state.email).get()
        console.log("DHJJ", getUserData)
        let user;
        let userId;
        getUserData.forEach((snapshot)=>{
            console.log("DTATA",snapshot.data())
            user = snapshot.data()
            userId = snapshot.id
            console.log("ID", snapshot.id)
        })

        if (user){

            const joinedClubs = user.ClubsJoined
            joinedClubs.push(newClub)
            await db.collection('Users').doc(userId).update({
               ClubsJoined : joinedClubs
            })

        } else {
            console.log("DDSWEEE")
        }

        this.setState({redirectSignUp : true})
    }

    declineInvite = () =>{        
        var check = window.confirm("You just declined this invite. Would you like to join our club membership app?")
        if (check === true){
            this.setState({redirect : true})
        } else {
            //close the window tab
        }
    }

    render(){
        if (this.state.redirect === true){
            return <Redirect to = "/"/>
        } else if (this.state.redirectSignUp) {
            return <Redirect to = "/signup"/>
        }
        const {email, clubname, adminName} = this.state
        return (
        <div className = "container">
            <div className = "row">
                <div class = "col-md-12">
                    <h3> Hey {email}, 
                            <br/>
                            You have been sent an invite by {adminName} to join {clubname} on our app. Click on the either of the buttons below to respond.
                    </h3>
                    <p>
                        <button className = "btn btn-success" onClick = {this.acceptInvite}> Accept Invite </button>
                            &nbsp; &nbsp;
                        <button className = "btn btn-danger" onClick = {this.declineInvite}> Decline Invite </button>
                    </p>

                </div>
            </div>
        </div>
        )
    }
}

export default JoinClub;