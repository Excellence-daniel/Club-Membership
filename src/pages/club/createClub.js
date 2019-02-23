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
        const loader = document.getElementById('loader')
        const imgLoader = "<img src = '../img/loader.gif' width = '5%'/>"
        loader.innerHTML = imgLoader
        const user =  fire.auth().currentUser
        if (user){
        this.setState({email : user.email.trim()}) //set email on load of the page 
        }
        loader.textContent = "Create Club"
    }

    handleClubName = (e) => {
        this.setState({clubName : e.target.value.trim()})
    }

    handleClubType = (e) => {
        this.setState({clubType : e.target.value.trim()})
    }

    handleMemberLimit = (e) => {
        this.setState({memberLimit : e.target.value.trim()})
    }

    onCreateClub = async (e) => {
        e.preventDefault();
        let actionn = document.getElementById('loader')
        let loader = `<img src = '../img/loader.gif' style = 'width : 5%'/>`
        actionn.innerHTML = loader
        if (this.state.email === '' || this.state.clubName === '' || this.state.clubType === '' || this.state.memberLimit === ''){
            alert ("Fill in all fields"); 
            actionn.textContent = 'Create Club'
        } else { 
           const user =  fire.auth().currentUser //get the current user 
           if (user.email !== this.state.email){
               alert("You have to use a registered email or be logged in before you can create club.")
               actionn.textContent = 'Create Club'
            } else {
                db.collection('Clubs').add({
                    AdminEmail : this.state.email,
                    ClubName : this.state.clubName,
                    ClubType : this.state.clubType, 
                    MemberLimit : this.state.memberLimit, 
                    Members : [], 
                    Invites : []
                })            
                .then(async () => {
                    let userID;
                    localStorage.setItem("Club", this.state.clubName) //set localStorage to clubName
                    const getUser = await db.collection('Users').where('Email', '==', user.email).get()
                    console.log(getUser)
                    getUser.forEach(async (snapshot)=>{
                        console.log(snapshot.data())
                        userID = snapshot.id
                        console.log(userID)
                        db.collection('Users').doc(userID).update({
                            Admin : true
                        })
                    })
                    alert('Club Created Successfully!')
                    this.setState({redirect : true}) //enable redirect the page to view club
                }).catch((error) => {
                    console.log(error)
                    alert("Can't create club at the moment, please try again!") //Error message
                    actionn.textContent = 'Create Club'
                })
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
                                    <option value = "" selected disabled> SELECT A CLUB TYPE </option>
                                    <option value = "Game"> Game </option> 
                                    <option value = "Book"> Book </option>
                                    <option value = "Sport"> Sport </option> 
                                    <option value = "Politics"> Politics </option>
                                    <option value = "Charity"> Charity </option>  
                                </select>
                            </p>

                            <p> 
                                <label> Members Limit </label>
                                <input type = "number" onChange ={this.handleMemberLimit} className = "form-control"/>
                            </p>
                            <button onClick = {this.onCreateClub} className = "btn btn-success btn-block" id = "loader"> Create Club </button>
                        </form>
                    </div>                                                
                    <div className = "col-md-4"></div>
                </div>
            </div>
        )
    }
}

export default CreateClub;