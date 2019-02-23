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
		const loader = '<img src ="../img/loader.gif" style = "width : 5%"/>'
		const teeext = 'Send Invite'
		var actionn = document.getElementById('actionn')
		actionn.innerHTML = loader 
		var user = fire.auth().currentUser //get current user object
		if (user){
			const getClubs = await db.collection('Clubs').where("AdminEmail", "==", user.email).get()   //get club data using user email
			let clubnames = []
			getClubs.forEach((snapshot)=>{
				var clubname = snapshot.data().ClubName     //get clubname that the adminemail has created
				clubnames.push(clubname)            //push into the array clubnames
			})
			this.setState({clubs: clubnames})       //set array clubnames into state clubs[]
			actionn.textContent = teeext
		} else {
			console.log("No user")
			alert('Login to invite to a club')
			actionn.textContent = teeext
		}
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
		const loader = '<img src ="../img/loader.gif" style = "width : 7%"/>'
		const teeext = 'Send Invite'
		var actionn = document.getElementById('actionn')
		actionn.innerHTML = loader 
		if (this.state.invitedEmail === '' || this.state.inviteToClub === ''){
			alert("Fill in the fileds")
			actionn.textContent = teeext
		} else {
			const invitee = {"email":this.state.invitedEmail, "accepted" : false}
			const getClubDetails = await db.collection('Clubs').doc(this.state.clubId).get() //gets club details from firebase
			const getInvites = await getClubDetails.data().Invites   //get array of Invites
			const getMembersLimit = await getClubDetails.data().MemberLimit 	//get members limit declared
			const getMembers = await getClubDetails.data().Members 	//get members in the club
			const MembersLength = getMembers.length

			console.log(MembersLength, getMembersLimit)
			if (MembersLength < getMembersLimit){
				getInvites.push(invitee) //push the new invite template into the former invites array
				await db.collection('Clubs').doc(this.state.clubId).update({
					Invites : getInvites 		//set array of invites with the new invite
				})
				.then(()=> {
					console.log("Invite Sent!")
					alert("Invite Sent!")
					actionn.textContent = teeext
				})
			} else {
				alert ("Cannot send invite, member's limit reached in this club!")
				actionn.textContent = teeext
			}
			this.setState({redirect : true})
		}
	}

	render(){
		if(this.state.redirect === true){
			return <Redirect to = "/"/>
		}
	   return (
			<div className = "col-md-12"> 
				<div className = "col-md-12">
					<Header/>
				</div>
				<div className = "col-md-12">
					<div className = "col-md-4"></div>
					<div className = "col-md-4 mx-auto" style = {{fontSize : '18px'}}>
						<center> 
							<h2> Add Members</h2>
							<br/>
								Invite : 
							<input type = "email" onChange = {this.emailToInvite} class = "form-control"/>
								to 
							<select className = "form-control" onChange = {this.pickClub}>
								<option value = ""> SELECT A CLUB </option>
								{this.state.clubs.map(club => (
									<option key ={club} value ={club}> {club} </option>
								))}
							</select>
							<br/>
							<div><button className = "btn btn-danger btn-block" id = "actionn" onClick = {this.inviteMembers}> Send Invite </button></div>
						</center>
					</div>
					<div className = "col-md-4"></div>
				</div>
			</div>
		)
	}
}

export default AddMembers;