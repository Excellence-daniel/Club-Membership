import React, {Component } from 'react'
import {Redirect} from 'react-router-dom'

import Header from '../header'
import {db} from '../config/fire'


class CreateClub extends Component{
    constructor(props){
        super(props)
        this.state = {
            name : '',
            email : '', 
            clubName : '', 
            clubType : '', 
            memberLimit : null, 
            members : {}, 
            deleted : false, 
            redirect : false
        }
    }

    handleNameInput = (e) => {
        this.setState({name : e.target.value})
    }

    handleEmailInput = (e) => {
        this.setState({email : e.target.value})
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

    onCreateClub = (e) => {
        e.preventDefault();
        if (this.state.name === '' || this.state.email === '' || this.state.clubName === '' || this.state.clubType === '' || this.state.memberLimit === ''){
            alert ("Fill in all fields"); 
        } else { 
            db.collection('Clubs').add({
                AdminName : this.state.name,
                Email : this.state.email,
                ClubName : this.state.clubName,
                ClubType : this.state.clubType, 
                MemberLimit : this.state.memberLimit, 
                Members : {}
            }) //submit data into firebase collection
            .then((u) => {
                console.log(u)
                alert("Club Created!") //display on success
                localStorage.setItem("Club", this.state.clubName) //set localStorage to clubName
                this.setState({redirect : true}) //enable redirect the page to view club
            }).catch((error) => {
                console.log(error)
                alert("Can't create club at the moment, please try again!") //Error message
            })
        }
    }

    render(){
        if (this.state.redirect === true){
            return <Redirect to = "./viewClubs" />
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
                                <label>  Name </label> 
                                <input type = "text" onChange = {this.handleNameInput} className = "form-control"/>
                            </p>

                            <p>
                                <label> Email </label>
                                <input type = "email" onChange = {this.handleEmailInput} className = "form-control"/>
                            </p>

                            <p>
                                <label> Club Name </label>
                                <input type = "text" onChange ={this.handleClubName} className = "form-control"/>
                            </p>
                            
                            <p> 
                                <label> Club Type </label>
                                <select onChange = {this.handleClubType} className = "form-control"> 
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
                    </div>
                    <div className = "col-md-4"></div>
                </div>
            </div>
        )
    }
}

export default CreateClub;