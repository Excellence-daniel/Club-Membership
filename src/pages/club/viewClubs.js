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

componentDidMount(){        
    const loader = document.getElementById('loader').style
    loader.display = 'block'
    fire.auth().onAuthStateChanged(async (user) => {
        const self = this
        const allClubs =  [] //an object that take all clubs of the user
        let allClubsID = [] //an array to take the ids of the clubs respectively
        if (user){
            const clubs = await db.collection('Clubs').where("AdminEmail", "==", user.email).get() 
            await clubs.forEach(querySnapshot => {
                                console.log("QUERY", querySnapshot.data())
                                allClubs.push(querySnapshot.data())
                                allClubsID.push(querySnapshot.id)
                            })
            // console.log("DJSKD",clubss)


    //         console.log() 
    //         .then((querySnapshot) => {
    //             querySnapshot.forEach(function(doc) {
    //                 allClubs.push(doc.data())
    //                 allClubsID.push(doc.id)
    //             });
               
    //                 console.log({allClubs})
    //                 self.setState({clubs : [...self.state.clubs, ...allClubs], clubsID : [...self.state.clubsID, ...allClubsID]})
                
    //         })
    //         .catch(function(error) {
    //             console.log("Error getting documents: ", error);
    //         });

    //         const clubsjoinedArr = [];
    //         db.collection('Users').where("Email", "==", user.email).get()
    //             .then((querySnapshot) => {
    //             querySnapshot.forEach(function(doc) {
    //                 console.log("JOINED", doc.data().ClubsJoined)
    //                 let previousClubsJoined = doc.data().ClubsJoined

    //                 clubsjoinedArr.push(previousClubsJoined)
    //                 })
    //                 console.log({clubsjoinedArr})
    //             })
    //                 console.log({clubsjoinedArr})
    //                 this.setState({clubsjoinned : clubsjoinedArr})
    //                 console.log("CLUBS", this.state.clubs)




    //         // console.log("gftdetfghkj", self.state.clubsjoinned)
    //         loader.display ='none'
    //     }
    // })
    // console.log("CHECK", this.state.clubs, this.state.clubsID, this.state.clubsjoinned)
}})}

deleteClub = (e) => {
    const loader = document.getElementById('loader').style
    loader.display = 'block'
    var id = e.target.id
    db.collection('Clubs').doc(id).delete()
    .then((data) => {
        alert("Club Deleted!")
        this.setState({redirect : true})
    })
    .catch((error) => {
        alert("Error. Try Again!")
        console.log(error)
    })
    //console.log("ID", id)
    loader.display = 'none'
}

leaveClub = async (e) => {
    var id = e.target.id
    const jiji = await db.collection('Clubs').doc(id).get()
    console.log(jiji.data())
    
}

showMembers = () => {
    alert("HEUY THERE")
}

joinedClub = () => {
    return  this.state.clubs.length > 0 ? 
        this.state.clubsjoinned.map((club, id) => (
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
            <div style = {{fontSize : '20px'}}>
                <center> No Clubs Available </center>  
            </div> 
}
createdClubs = () => {
    return this.state.clubs.length > 0 ? 
            this.state.clubs.map((club, id) => (
                <tr key = {id}>
                    <td> {club.ClubName} </td>
                    <td> {club.ClubType} </td>
                    <td> {club.Email} </td> 
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
                <div style = {{fontSize : '20px'}}>
                    <center> No Clubs Available </center>  
                </div> 
}

render(){
    if (this.state.redirect === true){
        return <Redirect to = "/club/ViewClubs"/>
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
            <div className = ""><center><img src = "../img/loader.gif" alt = "loader" style = {{display : 'none', width: '10%'}} id = "loader"/></center></div>
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
            <div className = "col-md-2"></div>            
        </div>
    )
}
}

export default ViewClubs;