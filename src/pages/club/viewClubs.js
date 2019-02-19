import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'

import Header from '../header'
import {fire,db} from '../config/fire'
// import '../index.css'

class ViewClubs extends Component {
    constructor(props){
        super(props);
        this.state = {
            clubs : [], 
            clubsID : [], 
            admin : true, 
            clubName : '',
            clubType : '',
            email : '',
            memberLimit : null, 
            clubsjoinned : [], 
            redirect : false, 
            clubMembas : []
        }
    }

componentDidMount=async()=>{        
    const loader = document.getElementById('loader')
    loader.style.display = 'block'
    const allClubs =  [] //an object that take all clubs of the user
    let allClubsID = [] //an array to take the ids of the clubs respectively
    let clubsjjoined = []
    fire.auth().onAuthStateChanged(async (user) => {        
        if (user){
            const clubs = await db.collection('Clubs').where("AdminEmail", "==", user.email).get() //get all information on the clubs created with the admin email
            await clubs.forEach(querySnapshot => {
                                console.log("QUERY", querySnapshot.data())  
                                allClubs.push(querySnapshot.data()) //the object returned is pushed into an array
                                allClubsID.push(querySnapshot.id) // the ID of the respective object/club is stored into the array into
                            })
            console.log("ALLL", allClubsID, allClubs)
            this.setState({clubs : allClubs, clubsID : allClubsID}) //set state with allClubs, allClubsID

            const clubsjoinedArr = await db.collection('Users').where("Email", "==", user.email).get()
            await clubsjoinedArr.forEach(querySnapshot =>{
                clubsjjoined.push(querySnapshot.data().ClubsJoined)
            })
            this.setState({clubsjoinned : clubsjjoined})
            console.log("CLUBS JOINED ---23", clubsjjoined)
            console.log("CLUBS JOINED ---24", clubsjjoined.length)
            console.log("CLUBS JOINED ---25", clubsjjoined[0])
        }
    })

    loader.style.display = 'none'
}

deleteClub = async (e) => {
    var id = e.target.id
    var clubNamee = e.target.value
    const loader = document.getElementById('loader').style
    loader.display = 'block'
    let deleteCClub = window.confirm("Are you sure you want to delete this club?")
    if (deleteCClub === true){
        console.log(clubNamee, "SMFKE")
        var getClubDets = await db.collection('Clubs').doc(id).get()
        console.log(getClubDets.data().Members)
        const clubMembers = getClubDets.data().Members
        clubMembers.forEach( async (memberMail) => {
            console.log(memberMail.email)
            const membersMail = memberMail.email
            const getRespUsers =  await db.collection('Users').where("Email","==",membersMail).get()
            getRespUsers.forEach(async (snapshot)=>{
                let userID = snapshot.id
                let membersClubJoined = snapshot.data().ClubsJoined
                let checkClubIndex = membersClubJoined.findIndex(idx => idx.Club === clubNamee)
                membersClubJoined.splice(checkClubIndex, 1)
                await db.collection('Users').doc(userID).update({
                    ClubsJoined : membersClubJoined
                })
                .then(()=>{
                    db.collection('Clubs').doc(id).delete()  //use club detail ID to delete from Clubs collection
                    .then(() => {
                        alert("Club Deleted!")
                        this.setState({redirect : true})
                    })
                    .catch((error) => {
                        alert("Error. Try Again!")
                        console.log(error, "1")
                    })
                })
                .catch((error)=>{
                    alert("Error. Try Again!")
                    console.log(error, "2")
                })
            })
            // let checkClubIndex = memerMai
        })  
    }
    loader.display = 'none'
}

leaveClub = async (e) => {
    var id = e.target.id
    var oldClubsJoined,clubMembers, clubInvites = []
    var userProfileId, clubIId;
    var leaveCClub = window.confirm("Are you sure you want to leave this club?")
    if (leaveCClub === true){
        //reset in the clubsJoined array in Users 
        var user = fire.auth().currentUser
        const getClubsJoined = await db.collection('Users').where('Email', '==', user.email).get()
        getClubsJoined.forEach(snapshot => {
            oldClubsJoined = snapshot.data().ClubsJoined;   //all clubs joined
            userProfileId = snapshot.id     //id of the user profile
        })
        const getClubId = oldClubsJoined.findIndex(clubs => clubs.Club === id) //get index of club from the array of clubs joined 
        oldClubsJoined.splice(getClubId, 1) //splice out of the array 
        await db.collection('Users').doc(userProfileId).update({
            ClubsJoined : oldClubsJoined    //update/reset the clubs joined
        })
        .then(async ()=>{
            //delete from members and invites of the club
            const getClubDetails = await db.collection('Clubs').where('ClubName', '==', id).get()
            getClubDetails.forEach(snapshot => {
                clubMembers = snapshot.data().Members       //get all the members of the club
                clubInvites = snapshot.data().Invites       //get all the invites sent of the club
                clubIId = snapshot.id           //get the Id of the club profile 
            })
            console.log(clubMembers, clubInvites)

             const getMemberId = clubMembers.indexOf(user.email)   //get Id/index of the user email in the members array
             const getMemberIdFromClubInvites = clubInvites.findIndex(invitee => invitee.email === user.email)   //get index of user email in the invites array

             clubMembers.splice(getMemberId, 1)  //splice out user from the club members list
             clubInvites.splice(getMemberIdFromClubInvites, 1)   //splice out user from the invites list 

            await db.collection('Clubs').doc(clubIId).update({
                Members : clubMembers,       //update members list 
                Invites : clubInvites        //update invites array
            }).then(()=> {
                alert("You have left the club!")
            })
            this.setState({redirect : true})
        })        
    }        
}

showMembers = async (e) =>{
    var cllubname = e.target.id
    const getClubMembers = await db.collection('Clubs').where("ClubName", '==',cllubname).get()
    getClubMembers.forEach((snapshot)=>{
    const memberrrs = snapshot.data().Members
    this.setState({clubMembas : memberrrs})
    })
}

joinedClub = () => {
    console.log(this.state.clubsjoinned)
    console.log("CLUBS JOINED ", this.state.clubsjoinned.length)
    return  this.state.clubsjoinned.length > 0 ? 
        this.state.clubsjoinned[0].map((club, id) => (
            <tr key = {id}>
                <td> {club.Club} </td>
                <td> {club.Type} </td>
                <td> 
                    <button id = {club.Club} onClick = {this.leaveClub} className = "btn btn-warning"> 
                        LEAVE
                    </button> 
                </td>
            </tr>
        )) :
            <div style = {{fontSize : '15px'}}>
                    No Clubs Available 
            </div>  
}
createdClubs =  () => {
    console.log("JJJDJDJJD", this.state.clubs, this.state.clubsID)
    return this.state.clubs.length > 0 ? 
            this.state.clubs.map((club, id) => (
               <tbody>
                    <tr key = {id}>
                        <td onClick = {this.showMembers} id = {club.ClubName} data-toggle="collapse" data-target= {"#"+club.ClubName.replace(/ +/g, "").trim()} style = {{cursor : 'pointer'}}> {club.ClubName} </td>
                        {/* .replace(/ +/g, "") removes white space between the string  */}
                        <td> {club.ClubType} </td>
                        <td> {club.AdminEmail} </td> 
                        <td> {club.MemberLimit} </td> 
                        <td> 
                            <Link to = {{pathname : "/club/editClub", state : ({id: this.state.clubsID[id]})}}>      
                                <button className = "btn btn-primary"> EDIT </button>
                            </Link>
                                    &nbsp;  &nbsp;
                            <button className = "btn btn-danger" id = {this.state.clubsID[id]} value = {club.ClubName} onClick ={this.deleteClub}> DELETE </button>
                        </td>
                    </tr>
                    <tr>
                        <td style = {{borderTop : '0px'}} colspan="5">
                            <div id = {club.ClubName.replace(/ +/g, "").trim()} class="collapse">
                            <b> Members </b>
                            {this.state.clubMembas.length > 0 ?
                                this.state.clubMembas.map(member=>(
                                    <td style = {{borderTop : '0px'}}> {member.name} </td>
                                ))
                                : 
                                <p> No Members </p> }
                            
                            </div>
                        </td>
                    </tr>
                </tbody>     
                                 
            )) :
                <div style = {{fontSize : '15px'}}>
                    No Clubs Available 
                </div> 
}

render(){
    if (this.state.redirect === true){
        return <Redirect to = "/"/>                                                                                                                                    

    }
    return (
        <div className = "col-md-12">
            <div className = "col-md-12">
                <Header/>
            </div> 

            <div className = "col-md-2"></div>
            <div className = "col-md-8">
            <h3> Joined Clubs </h3>
                <table className = "table"> 
                    <thead>
                        <tr>
                            <th> Club Name</th>
                            <th>Club Type </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.joinedClub()}
                    </tbody>
                </table>


                        {/* Created Clubs */}
        <br/>
            <div>
                <center>
                    <img src = "../img/loader.gif" alt = "loader" style = {{display : 'none', width: '5%'}} id = "loader"/>
                </center>
            </div>
        <br/>

                <div>
                    <h3> Created Clubs </h3>
                    <table className = "table"> 
                        <thead>
                            <tr>
                                <th> Club Name</th>
                                <th>Club Type </th> 
                                <th> Email </th>
                                <th> Member Limit </th>
                            </tr>
                        </thead>
                            {this.createdClubs()}
                    </table> 
                </div>
            </div>
            <div className = "col-md-2">
            <button onClick = {this.showMembers}> SHOW MEMBERS </button>
            </div>            
        </div>
    )
}
}

export default ViewClubs;