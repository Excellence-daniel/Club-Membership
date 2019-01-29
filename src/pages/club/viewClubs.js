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
            memberLimit : null
        }
    }

    componentDidMount(){
        const self = this
        fire.auth().onAuthStateChanged(function(user){
            console.log(user.email)
       
        const allClubs =  []
        let allClubsID = []
        let user_name = localStorage.getItem("UserName")
        db.collection('Clubs').where("Email", "==", "oyeniranexcellenced@gmail.com").get()  
        // {/*user.email*/}
        .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());

                if (user_name === doc.data().Name){
                    self.setState({admin : true})
                }

                allClubs.push(doc.data())
                allClubsID.push(doc.id)
            });
            console.log("ALL:", allClubs)
            if (allClubs.length > 0){
                self.setState({clubs : [...self.state.clubs, ...allClubs], clubsID : [...self.state.clubsID, ...allClubsID]})
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    })
    }

    deleteClub = (e) => {
        var id = e.target.id
        db.collection('Clubs').doc(id).delete()
        .then((data) => {
            alert("Club Deleted!")
            return <Redirect to = "/clubs/viewClubs"/>
        })
        .catch((error) => {
            alert("Error. Try Again!")
            console.log(error)
        })
        //console.log("ID", id)
    }

    leaveClub = (e) => {

    }

    editClub = () => {

    }

    render(){
        return (
            <div className = "col-md-12">
                <div className = "col-md-12">
                    <Header/>
                </div> 
                <div className = "col-md-2"></div>
                <div className = "col-md-8">
                    <table className = "table"> 
                        <thead>
                            <tr>
                                <th> Club Name</th>
                                <th>Club Type </th> 
                                <th> Email </th>
                                <th> Member Limit </th>
                                <th> Members </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.clubs.length > 0 ? 
                            this.state.clubs.map((club, id) => (
                        <tr key = {id}>
                        <td> {club.ClubName} </td>
                        <td> {club.ClubType} </td>
                        <td> {club.Email} </td> 
                        <td> {club.MemberLimit} </td>
                        <td></td>
                                {this.state.admin === true ? 
                                    <td> 
                                        <Link to = {{pathname : "/clubs/editClub", state : ({id: this.state.clubsID[id]})}}>      <button className = "btn btn-primary"> EDIT </button></Link>
                                                &nbsp;  &nbsp;
                                        <button className = "btn btn-danger" id = {this.state.clubsID[id]} onClick ={this.deleteClub}> DELETE </button>
                                    </td>
                                :
                                    <td> <button className = "btn btn-alert"> LEAVE</button> </td>
                            }
                         </tr>
                        
                    )) :
                        <div style = {{fontSize : '20px'}}>
                           <center> "No Clubs Available"  </center> 
                        </div>
                        }
                        </tbody>
                    </table>
                </div>
                <div className = "col-md-2"></div>            
            </div>
        )
    }
}

export default ViewClubs;