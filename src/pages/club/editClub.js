import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'

import {db} from '../config/fire'
import Header from '../header'

class EditClub extends Component{
    constructor(props){
        super(props);
        this.state = {
            name : '', 
            email : '', 
            clubname : '',
            clubtype : '',
            membersLimit : 0, 
            id : '', 
            redirect : false
        }
    }
    componentDidMount(props){
        const self = this
        const clubId = this.props.location.state.id
        db.collection('Clubs').doc(clubId).get()        
        .then(function(data){
            let userData = data._document.proto.fields
            console.log(data._document.proto.fields)
            self.setState({id : clubId , name:userData.AdminName.stringValue, email : userData.Email.stringValue, clubname : userData.ClubName.stringValue, clubtype : userData.ClubType.stringValue, membersLimit : userData.MemberLimit.stringValue })
        })
    }

    handleChangeClubName = (e) => {
        this.setState({clubname : e.target.value})
    }

    handleChangeClubType = (e) =>{
        this.setState({clubtype : e.target.value})
    }

    handleMemberLimit = (e) => {
        this.setState({membersLimit : e.target.value})
    }

    updateClubDetails = async () =>{
        await db.collection('Clubs').doc(this.state.id)
        .update({
           ClubName : this.state.clubname, 
           ClubType : this.state.clubtype,
           MemberLimit : this.state.membersLimit
       }).then((u) => {
        this.setState({redirect : true});
        alert("Updated Club Successfully!")
       }).catch((error) => {
         console.log('error', error);
         alert("Cannot Update Club, try again!")
     })
    }
    render(){
        if (this.state.redirect === true){
            return <Redirect to = "/club/viewClubs"/>
        }

        return (
            <div className ="col-md-12"> 
                <div className = "col-md-12">
                    <Header/>
                </div>
               <div className = "col-md-4"></div> 
                <div className = "col-md-4 mt-5">
                    <h3> Club Details </h3> 
                    <p>
                        <label> Club Name </label>
                        <input type = "text" className = "form-control" onChange = {this.handleChangeClubName} value = {this.state.clubname}/>
                    </p>
                    <p>
                        <label> Club Type </label>
                        <select value = {this.state.clubtype} onChange = {this.handleChangeClubType} class = "form-control">
                            <option value = "Game"> Game </option> 
                            <option value = "Book"> Book </option>
                            <option value = "State Affairs"> State Affairs Discussion </option> 
                        </select>
                    </p>
                    <p>
                        <label> Email </label>
                        <input value = {this.state.email} disabled = {true} class = "form-control"/>
                    </p>
                    <p>
                        <label> Members Limit</label>
                        <input type = "number" onChange = {this.handleMemberLimit} value = {this.state.membersLimit} class = "form-control"/>
                    </p>
                    
                    <p>
                        <button class = "btn btn-success btn-block" onClick = {this.updateClubDetails}> SAVE </button>
                    </p>
               </div>
               <div className = "col-md-4"></div>
            </div>
        )
    }
}

export default EditClub;