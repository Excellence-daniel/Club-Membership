import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

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
            redirect : false
        }
    }

    componentDidMount= async()=>{
        const loader = document.getElementById('loader').style 
        loader.display = 'block'
        var user = fire.auth().currentUser
        if (user){
            console.log("User ID: ", user.uid)
            console.log("USER EAIL", user.email)
            const getClubs = await db.collection('Clubs').where("AdminEmail", "==", user.email).get()
            let clubnames = []
            getClubs.forEach((snapshot)=>{
                var clubname = snapshot.data().ClubName
                clubnames.push(clubname)
            })
            this.setState({clubs: clubnames})
        } else {
            console.log("No user")
        }
        loader.display = 'none'
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
        const loader = document.getElementById('loader').style 
        loader.display = 'block'
        if (this.state.invitedEmail === '' || this.state.inviteToClub === ''){
            alert("Fill in the fileds")
            loader.display = 'none'
        } else {
            const invitee = {"name":this.state.invitedEmail, "accepted" : false}
            const getClubDetails = await db.collection('Clubs').doc(this.state.clubId).get() //gets club details from firebase
            const getMembers = await getClubDetails.data().Members
            getMembers.push(invitee)
            await db.collection('Clubs').doc(this.state.clubId).update({
                Members : getMembers
            })
            .then(()=> {
                console.log("Invite Sent!")
                alert("Invite Sent!")
            })
            loader.display = 'none'
            this.setState({redirect : true})
        }
    }

    render(){
        if(this.state.redirect === true){
            return <Redirect to = "/"/>
        }
       return (
            <div class = "col-md-12"> 
                <div class = "col-md-12">
                    <Header/>
                </div>
                <div class = "col-md-12">
                    <div className = "col-md-4"></div>
                    <div className = "col-md-4 mx-auto" style = {{fontSize : '18px'}}>
                        <center> 
                            <h2> Add Members</h2>
                            <br/>
                                Invite : 
                            <input type = "email" onChange = {this.emailToInvite} class = "form-control"/>
                                to 
                            <select class = "form-control" onChange = {this.pickClub}>
                                <option value = ""> SELECT A CLUB </option>
                                {this.state.clubs.map(club => (
                                    <option key ={club} value ={club}> {club} </option>
                                ))}
                            </select>
                            <br/>
                            <div><button class = "btn btn-danger btn-block" onClick = {this.inviteMembers}> INVITE </button></div>
                        </center>
                        <div className = ""><center><img src = "../img/loader.gif" alt = "loader" style = {{display : 'none', width: '10%'}} id = "loader"/></center></div>
                    </div>
                    <div className = "col-md-4"></div>
                </div>
            </div>
        )
    }
}

export default AddMembers;