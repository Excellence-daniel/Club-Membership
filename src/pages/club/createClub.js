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
        console.log(this.state.memberLimit)
    }

    onCreateClub = (e) => {
        e.preventDefault();
        if (this.state.name === '' || this.state.email === '' || this.state.clubName === '' || this.state.clubType === '' || this.state.memberLimit === ''){
            alert ("Fill in all fields"); 
        } else { 
            db.collection('Clubs').add({
                Name : this.state.name,
                Email : this.state.email,
                ClubName : this.state.clubName,
                ClubType : this.state.clubType, 
                MemberLimit : this.state.memberLimit, 
                Members : {}
            })
            .then((u) => {
                console.log(u)
                alert("Club Created!")
                localStorage.setItem("Club", this.state.clubName)
                this.setState({redirect : true})
            }).catch((error) => {
                console.log(error)
                alert("Can't create club at the moment, please try again!")
            })
        }
    }

    render(){
        if (this.state.redirect === true){
            return <Redirect to = "./addMembers" />
        }
        return (
            <div class = "col-md-12"> 
                <div class = "col-md-12">
                    <Header/>
                </div>
                <div class = "col-md-12">
                    <div clasName = "col-md-4"></div>
                    <div class = "col-md-4 mx-auto card card-body">
                        <form> 
                            <p>
                                <label>  Name </label> 
                                <input type = "text" onChange = {this.handleNameInput} class = "form-control"/>
                            </p>

                            <p>
                                <label> Email </label>
                                <input type = "email" onChange = {this.handleEmailInput} class = "form-control"/>
                            </p>

                            <p>
                                <label> Club Name </label>
                                <input type = "text" onChange ={this.handleClubName} class = "form-control"/>
                            </p>
                            
                            <p> 
                                <label> Club Type </label>
                                <select onChange = {this.handleClubType} class = "form-control"> 
                                    <option value = "Game"> Game </option> 
                                    <option value = "Book"> Book </option>
                                    <option value = "State Affairs"> State Affairs Discussion </option> 
                                </select>
                            </p>

                            <p> 
                                <label> Members Limit </label>
                                <input type = "number" onChange ={this.handleMemberLimit} class = "form-control"/>
                            </p>
                            <button onClick = {this.onCreateClub} class = "btn btn-success btn-block"> CREATE CLUB </button>
                        </form>
                    </div>
                    <div className = "col-md-4"></div>
                </div>
            </div>
        )
    }
}

export default CreateClub;