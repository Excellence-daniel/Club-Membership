import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

import Header from '../header';
import {fire,db} from '../config/fire'

class AddMembers extends Component {
	constructor(props){
		super(props);
		this.state = {
			clubId : '',    //id of the club the user is inviting an email to
			clubs : [], 
			invitedEmail : '',
			inviteToClub : '',  //name of the club the user is inviting an email to
			redirect : false
		}
	}

	componentDidMount= async()=>{
		const loader = document.getElementById('loader').style 
		loader.display = 'block'    //start loader
		var user = fire.auth().currentUser //get current user object
		if (user){
			const getClubs = await db.collection('Clubs').where("AdminEmail", "==", user.email).get()   //get club data using user email
			let clubnames = []
			getClubs.forEach((snapshot)=>{
				var clubname = snapshot.data().ClubName     //get clubname that the adminemail has created
				clubnames.push(clubname)            //push into the array clubnames
			})
			this.setState({clubs: clubnames})       //set array clubnames into state clubs[]
		} else {
			console.log("No user")
		}

		loader.display = 'none' //stop loader
		console.log("STATE CLUBS ", this.state.clubs)
	}

	emailToInvite = (e) => {
		this.setState({invitedEmail : e.target.value})
	}

	pickClub = async (e) => {
		const club = e.target.value //club selected 
		const getClubId = await db.collection('Clubs').where("ClubName", "==",club).get()   //get data relating to the club selected
		const clubIid = getClubId.docs[0].id    //get the id of the club 
		console.log(club, clubIid)
		this.setState({inviteToClub:club, clubId:clubIid})  //set the clubname and clubId to state 
	}

	inviteMembers = async () => {
		const loader = document.getElementById('loader').style 
		loader.display = 'block'
		if (this.state.invitedEmail === '' || this.state.inviteToClub === ''){
			alert("Fill in the fileds")
			loader.display = 'none'
		} else {
			const invitee = {"email":this.state.invitedEmail, "accepted" : false}
			const getClubDetails = await db.collection('Clubs').doc(this.state.clubId).get() //gets club details from firebase
			const getInvites = await getClubDetails.data().Invites   //get array of Invites
			getInvites.push(invitee) //push the new invite template into the former invites array
			await db.collection('Clubs').doc(this.state.clubId).update({
				Invites : getInvites 		//set array of invites with the new invite
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