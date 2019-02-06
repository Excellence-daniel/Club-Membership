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
            redirect : false
        }
    }

componentDidMount=async()=>{        
    let loader = document.getElementById('loader').style
    loader.display = "block"
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
                console.log("CLUBS JOINED", querySnapshot.data())
                clubsjjoined.push(querySnapshot.data().ClubsJoined)
            })
            this.setState({clubsjoinned : clubsjjoined})
            console.log("CLUBS JOINED", clubsjjoined)
        }
    })

    loader.display = "none"
}

deleteClub = (e) => {
    const loader = document.getElementById('loader').style
    loader.display = 'block'
    let deleteCClub = window.confirm("Are you sure you want to delete this club?")
    if (deleteCClub === true){
        var id = e.target.id
        db.collection('Clubs').doc(id).delete()  //use club detail ID to delete from Clubs collection
        .then(() => {
            alert("Club Deleted!")
            this.setState({redirect : true})
        })
        .catch((error) => {
            alert("Error. Try Again!")
            console.log(error)
        })
    }
    loader.display = 'none'
}

leaveClub = async (e) => {
    var oldClubsJoined, userProfileId, clubMembers, clubInvites, clubIId;
    var id = e.target.id
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

showMembers = () => {
    alert("HEUY THERE")
}

joinedClub = () => {
    console.log(this.state.clubsjoinned)
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
createdClubs = () => {
    return this.state.clubs.length > 0 ? 
            this.state.clubs.map((club, id) => (
                <tr key = {id}>
                    <td> {club.ClubName} </td>
                    <td> {club.ClubType} </td>
                    <td> {club.AdminEmail} </td> 
                    <td> {club.MemberLimit} </td> 
                    <td> 
                        <Link to = {{pathname : "/club/editClub", state : ({id: this.state.clubsID[id]})}}>      
                            <button className = "btn btn-primary"> EDIT </button>
                        </Link>
                                &nbsp;  &nbsp;
                        <button className = "btn btn-danger" id = {this.state.clubsID[id]} onClick ={this.deleteClub}> DELETE </button>
                    </td>
                </tr>                    
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
                    <img src = "../img/loader.gif" alt = "loader" style = {{display : 'none', width: '10%'}} id = "loader"/>
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
                        <tbody>
                            {this.createdClubs()}
                        </tbody>
                    </table> 
                </div>
            </div>
            <div className = "col-md-2">
            </div>            
        </div>
    )
}
}

export default ViewClubs;