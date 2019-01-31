import React, {Component} from 'react';

import Header from '../header';
import {fire,db} from '../config/fire'

class AddMembers extends Component {
    constructor(props){
        super(props);
        this.state = {
            clubId : '', 
            clubs : [], 
            invitedEmail : '',
            inviteToClub : '', 
        }
    }

    componentDidMount= async()=>{
        var user = fire.auth().currentUser
        if (user){
            console.log("User ID: ", user.uid)
            console.log("USER EAIL", user.email)
            const getClubs = await db.collection('Clubs').where("Email", "==", user.email).get()
            let clubnames = []
            getClubs.forEach((snapshot)=>{
                var clubname = snapshot.data().ClubName
                clubnames.push(clubname)
            })
            this.setState({clubs: clubnames})
        } else {
            console.log("No user")
        }
        console.log("STATE CLUBS ", this.state.clubs)
    }

    emailToInvite = (e) => {
        this.setState({invitedEmail : e.target.value})
    }

    pickClub = async (e) => {
        const club = e.target.value
        const getClubId = await db.collection('Clubs').where("ClubName", "==",club).get()
        const clubIid = getClubId.docs[0].id
        console.log(club, clubIid)
        this.setState({inviteToClub:club, clubId:clubIid})
    }

    inviteMembers = async () => {
        if (this.state.invitedEmail === '' || this.state.inviteToClub === ''){
            alert("Fill in the fileds")
        } else {
            const invitee = {"name":this.state.invitedEmail, "accepted" : false}
            const getClubDetails = await db.collection('Clubs').doc(this.state.clubId).get() //gets club details from firebase
            const getMembers = await getClubDetails.data().Members
            getMembers.push(invitee)
            await db.collection('Clubs').doc(this.state.clubId).update({
                Members : getMembers
            })

            console.log(invitee, "MEMBERS", getMembers)
        }
    }

    render(){
       return (
            <div class = "col-md-12"> 
                <div class = "col-md-12">
                    <Header/>
                </div>
                <div class = "col-md-12">
                    <div className = "col-md-3 mx-auto"> 
                        <h2> Add Members</h2>
                            Invite : 
                        <input type = "email" onChange = {this.emailToInvite} class = "form-control"/>
                            to 
                        <select class = "form-control" onChange = {this.pickClub}>
                            {this.state.clubs.map(club => (
                                <option key ={club} value ={club}> {club} </option>
                            ))}
                        </select>
                        <button class = "btn btn-danger" onClick = {this.inviteMembers}> INVITE </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddMembers;