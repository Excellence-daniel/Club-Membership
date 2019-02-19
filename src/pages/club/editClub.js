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
        const loader = document.getElementById('loader').style      //start loader 
        loader.display = 'block'
        const clubId = this.props.location.state.id     //get the ID sent from the viewClubs page
        const clubb = await db.collection('Clubs').doc(clubId).get()    //get data with the clubID as ref
        const clubData = clubb.data()   //get data
        console.log(clubb.data())       
        this.setState({id : clubId ,   
                    name:clubData.AdminName, 
                    email : clubData.AdminEmail, 
                    clubname :clubData.ClubName, 
                    clubtype : clubData.ClubType, 
                    membersLimit : clubData.MemberLimit
                    })                                      //set form value to equal the data fetched 
        loader.display = 'none'
    }

    handleChangeClubName = (e) => {
        this.setState({clubname : e.target.value.trim()})
    }

    handleChangeClubType = (e) =>{
        this.setState({clubtype : e.target.value.trim()})
    }

    handleMemberLimit = (e) => {
        this.setState({membersLimit : e.target.value.trim()})
    }

    updateClubDetails = async () =>{
        var actionn = document.getElementById('actionn')
        const loader = '<img src = "../img/loader.gif" style = "width : 10%"/>'
        const teeext = 'Update Club'
        actionn.innerHTML = loader
        await db.collection('Clubs').doc(this.state.id)
        .update({
           ClubName : this.state.clubname, 
           ClubType : this.state.clubtype,
           MemberLimit : this.state.membersLimit    //update collection Clubs
       }).then((u) => {
        this.setState({redirect : true});
        alert("Updated Club Successfully!")
        actionn.textContent = teeext
       }).catch((error) => {
         console.log('error', error);
         alert("Cannot Update Club, try again!")
         actionn.textContent = teeext
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
                    <h3><center> Club Details </center></h3> 
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
                            <option value = "Sport"> Sport </option> 
                            <option value = "Politics"> Politics </option>
                            <option value = "Charity">Charity </option> 
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
                        <button class = "btn btn-success btn-block" id ="actionn" style = {{padding: '20px'}} onClick = {this.updateClubDetails}> SAVE </button>
                    </p>
                    <div className = ""><center><img src = "../img/loader.gif" alt = "loader" style = {{display : 'none', width: '10%'}} id = "loader"/></center></div>
               </div>

               <div className = "col-md-4"></div>
            </div>
        )
    }
}

export default EditClub;