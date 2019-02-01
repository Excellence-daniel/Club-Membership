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
    componentDidMount = async(props)=>{
        const loader = document.getElementById('loader').style
        loader.display = 'block'
        const clubId = this.props.location.state.id
        const clubb = await db.collection('Clubs').doc(clubId).get() 
        const clubData = clubb.data()
        console.log(clubb.data())       
        this.setState({id : clubId , 
                    name:clubData.AdminName, 
                    email : clubData.AdminEmail, 
                    clubname :clubData.ClubName, 
                    clubtype : clubData.ClubType, 
                    membersLimit : clubData.MemberLimit
                    })
        loader.display = 'none'
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
        const loader = document.getElementById('loader').style
        loader.display = 'block'
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
       loader.display = 'none'
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
                            <option value = ""> SELECT A CLUB TYPE </option>
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
                    <div className = ""><center><img src = "../img/loader.gif" alt = "loader" style = {{display : 'none', width: '15%'}} id = "loader"/></center></div>
               </div>

               <div className = "col-md-4"></div>
            </div>
        )
    }
}

export default EditClub;