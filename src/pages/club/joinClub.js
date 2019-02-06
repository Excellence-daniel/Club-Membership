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
        var newClub = {"Club":this.state.clubname, "Type":this.state.clubtype}
        const getUserData = await db.collection('Users').where('Email', "==", this.state.email).get() //get user details using emails as ref 
        let user, userId, clubId;
        let clubMembers = []
        let clubInvites = []
        getUserData.forEach((snapshot)=>{
            console.log("DTATA",snapshot.data())
            user = snapshot.data()  //object data of the user
            userId = snapshot.id    //id of the user in firebase
        })

        // if a user is gotten 
        if(user){
            const joinedClubs = user.ClubsJoined    //get all the clubs the user has joined
            joinedClubs.push(newClub)   //push the new club into that array
            console.log(userId)
            await db.collection('Users').doc(userId)
            .update({
                ClubsJoined : joinedClubs    //update the clubs joined array in the 'Users' collection of the user 
            })
            .then(async()=>{
                //update the members array in collection 'Clubs'
                const getClub = await db.collection('Clubs').where("ClubName", "==", this.state.clubname).get()
                getClub.forEach((snapshot) => {
                    console.log("SNAPSNAP", snapshot.data())
                    clubMembers = snapshot.data().Members       //get members of the club
                    clubInvites = snapshot.data().Invites       //get invites array in club
                    clubId = snapshot.id                        //get Id of club
                })

                console.log(clubInvites)
                clubMembers.push(this.state.email)      //add the new email to the list of member emails
                let memberindex = clubInvites.findIndex(invitee => invitee.email === this.state.email)  //get index of object with email as ref
                if(memberindex >= 0){
                    console.log(memberindex)
                    clubInvites[memberindex].accepted = true    //set invite accepted option to true
                }

                await db.collection('Clubs').doc(clubId).update({       //update 
                    Members : clubMembers,
                    Invites : clubInvites
                }).then(()=>{
                    alert("You have joined the club!")
                    this.setState({redirect : true})
                })
            })
        } else {
            localStorage.setItem("ClubJoined", JSON.stringify(newClub))
            var signUp = window.confirm("You have to sign up before you can join this club. Would you like to sign up?")
            fire.auth().signOut() 
            if (signUp === true){
                this.setState({redirectSignUp : true})
            } else{
                alert("Thank you")
                window.close()
            }
        }
    }

    declineInvite = () =>{        
        var check = window.confirm("You just declined this invite. Would you like to join our club membership app?")
        if (check === true){
            this.setState({redirect : true})
        } else {
            //close the window tab
            window.close()
        }
    }

    render(){
        if (this.state.redirect === true){
            return <Redirect to = "/"/>
        } else if (this.state.redirectSignUp) {
            return <Redirect to = "/signup"/>
        }
        const {email, clubname, adminEmail} = this.state
        return (
        <div className = "container">
            <div className = "row">
                <div class = "col-md-12">
                    <h3> Hey {email}, 
                            <br/>
                            You have been sent an invite by {adminEmail} to join {clubname} on our app. Click on the either of the buttons below to respond.
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