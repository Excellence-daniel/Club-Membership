import React, {Component } from 'react'
import {Redirect} from 'react-router-dom'

import Header from '../header'
import {fire,db} from '../config/fire'


class CreateClub extends Component{
    constructor(props){
        super(props)
        this.state = {
            email : '', 
            clubName : '', 
            clubType : '', 
            memberLimit : null, 
            members : {}, 
            deleted : false, 
            redirect : false
        }
    }

    componentDidMount(){
        const loader = document.getElementById('loader').style
        loader.display = 'block'  //activate loader
       const user =  fire.auth().currentUser
       if (user){
        this.setState({email : user.email})
       }
       loader.display = 'none'
    }

    handleClubName = (e) => {
        this.setState({clubName : e.target.value})
    }

    handleClubType = (e) => {
        this.setState({clubType : e.target.value})
    }

    handleMemberLimit = (e) => {
        this.setState({memberLimit : e.target.value})
    }

    onCreateClub = async (e) => {
        e.preventDefault();
        const loader = document.getElementById('loader').style
        loader.display = 'block' //start loader
        if (this.state.email === '' || this.state.clubName === '' || this.state.clubType === '' || this.state.memberLimit === ''){
            alert ("Fill in all fields"); 
            loader.display = 'none'
        } else { 
           const user =  fire.auth().currentUser
           if (user.email !== this.state.email){
               alert("You have to use a registered email or be logged in before you can create club.")
            } else {
                db.collection('Clubs').add({
                    AdminEmail : this.state.email,
                    ClubName : this.state.clubName,
                    ClubType : this.state.clubType, 
                    MemberLimit : this.state.memberLimit, 
                    Members : [], 
                    Inivites : []
                })            
                .then(async () => {
                    alert("Club Created!") //display on success
                    localStorage.setItem("Club", this.state.clubName) //set localStorage to clubName
                    this.setState({redirect : true}) //enable redirect the page to view club
                }).catch((error) => {
                    console.log(error)
                    alert("Can't create club at the moment, please try again!") //Error message
                })
        loader.display = 'none' //stop loader
          }
        }
    }

    render(){
        if (this.state.redirect === true){
            return <Redirect to = "/club/viewClubs" />
        }
        return (
            <div className = "col-md-12"> 
                <div className = "col-md-12">
                    <Header/>
                </div>
                <div className = "col-md-12">
                    <div className = "col-md-4"></div>
                    <div className = "col-md-4 mx-auto card card-body mt-4">
                        <form> 
                            <p>
                                <label> Email </label>
                                <input type = "email" disabled = {true} value = {this.state.email} className = "form-control"/>
                            </p>

                            <p>
                                <label> Club Name </label>
                                <input type = "text" onChange ={this.handleClubName} className = "form-control"/>
                            </p>
                            
                            <p> 
                                <label> Club Type </label>
                                <select onChange = {this.handleClubType} className = "form-control"> 
                                    <option value = ""> SELECT A CLUB TYPE </option>
                                    <option value = "Game"> Game </option> 
                                    <option value = "Book"> Book </option>
                                    <option value = "State Affairs"> State Affairs Discussion </option> 
                                </select>
                            </p>

                            <p> 
                                <label> Members Limit </label>
                                <input type = "number" onChange ={this.handleMemberLimit} className = "form-control"/>
                            </p>
                            <button onClick = {this.onCreateClub} className = "btn btn-success btn-block"> CREATE CLUB </button>
                        </form>
                    <div className = ""><center><img src = "../img/loader.gif" alt = "loader" style = {{display : 'none', width: '20%'}} id = "loader"/></center></div>
                    </div>                                                
                    <div className = "col-md-4"></div>
                </div>
            </div>
        )
    }
}

export default CreateClub;