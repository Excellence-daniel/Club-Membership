import React, {Component} from 'react'
import {fire,db} from './config/fire'
import {Redirect} from 'react-router-dom'

import Header from './header'

 class SignUpUser extends Component{
     constructor(props){
         super(props);
         this.state = {
             name : '',
             address:'', 
             phone : '',
             email : '',
             password : '', 
             redirect : false
         }
     }

     handleNameInput = (e) =>{
        this.setState({name : e.target.value.trim()})
     }

     handleAddressInput = (e) =>{
        this.setState({address : e.target.value.trim()})
     }

     handlePhoneNumber = (e) =>{
        this.setState({phone : e.target.value.trim()})
     }

     handleEmailInput = (e) => {
        this.setState({email : e.target.value.trim()})
     }

     handlePasswordInput = (e) =>{
        this.setState({password : e.target.value.trim()})
     }

     signup = async (e) => {
        e.preventDefault();
        let actionn = document.getElementById('actionn')
        let loader = `<img src = '../img/loader.gif' style = 'width : 5%'/>`
        actionn.innerHTML = loader
        if(this.state.name === '' || this.state.email === '' || this.state.address === '' || this.state.phone === '' || this.state.password === '' ){
            alert('Fill all fields.')
            actionn.textContent = 'Submit Form'
        } else {            
        const self = this
        await fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password) //create user with email and password in auth
        .then(function(data){
            let authsuccess = data.additionalUserInfo.isNewUser  //if user email does not exist, he is a a newUser i.e authSuccess = true
            if (authsuccess === true){
                    db.collection('Users').add({ //add these to database
                        Name : self.state.name, 
                        Email : self.state.email,
                        Address : self.state.address,
                        PhoneNumber : self.state.phone,
                        Password : self.state.password, 
                        Admin : false, 
                        EmailVerified : false,
                        ClubsJoined : []
                        }).then(function(data){
                            console.log("SIGNUP DATA ", data)
                            if (data){
                            self.setState({redirect : true})                                    
                            localStorage.setItem("Email",self.state.email) //save email
                            alert('User Registered Successfully. Verify your email')
                            actionn.textContent = 'Submit Form'
                            }
                        }).catch(function(error){
                            alert(error.message + ". Please try again") 
                            actionn.textContent = 'Submit Form'
                            //should delete user from auth. Do!!
                        })
          
        }}).catch(function(error){
            console.log("SUCCESS", false)
            console.log("error", error.message)
            alert(error.message + " Please try again")
            actionn.textContent = 'Submit Form'
        })
       
     }
     }

    render(){
        const redirect = this.state.redirect
        if (redirect){
          return <Redirect to = "./login" />
        }
        return (
            <div className = "col-md-12">
                <div className = "col-md-12">
                    <Header/>
                </div>
                <div className = "col-md-4"></div>
                <div className = "col-md-4 mt-5 card card-body">
                        
                        <div className ="mt-2">
                            <p>
                                <label> Full Name </label>
                                <input type = "text" onChange = {this.handleNameInput} className = "form-control"/>
                            </p>

                            <p>
                                <label> Contact Address </label>
                                <input type = "text" onChange = {this.handleAddressInput} className = "form-control"/>
                            </p>

                            <p>
                                <label> Contact Number  </label>
                                <input type = "text" onChange = {this.handlePhoneNumber} className = "form-control"/>
                            </p>

                            <p>
                                <label> Email Address </label>
                                <input type = "email" onChange = {this.handleEmailInput} className = "form-control"/>
                            </p>
                            
                            <p>
                                <label> Password </label>
                                <input type = "password" onChange = {this.handlePasswordInput} className = "form-control"/>
                            </p>

                            <button className = "btn btn-block btn-secondary" id = "actionn" onClick ={this.signup}> Submit Form </button>
                        </div>
                </div>
                <div className = "col-md-4"></div>
            </div>
        )
    }
}

export default SignUpUser;