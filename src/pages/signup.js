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
        this.setState({name : e.target.value})
     }

     handleAddressInput = (e) =>{
        this.setState({address : e.target.value})
     }

     handlePhoneNumber = (e) =>{
        this.setState({phone : e.target.value})
     }

     handleEmailInput = (e) => {
        this.setState({email : e.target.value})
     }

     handlePasswordInput = (e) =>{
        this.setState({password : e.target.value})
     }

     signup = async (e) => {
        e.preventDefault();
        
        if(this.state.name === '' || this.state.email === '' || this.state.address === '' || this.state.phone === '' || this.state.password === '' ){
            alert('Fill all fields.')
        } else {
            const self = this
        await fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password) //create user with email and password in auth
        .then(function(data){
            let authsuccess = data.additionalUserInfo.isNewUser  //if user email does not exist, he is a a newUser i.e authSuccess = true
            if (authsuccess === true){
                var user = fire.auth().currentUser  //get the current user
                 var sendEmail = user.sendEmailVerification() //send the user an email for verification
                 if (sendEmail){
                        alert("Verify your email.") //user to verify email
                            db.collection('Users').add({ //add these to database
                                Name : self.state.name, 
                                Email : self.state.email,
                                Address : self.state.address,
                                Phone : self.state.phone,
                                Password : self.state.password, 
                                Admin : false
                             }).then(function(data){
                                 console.log(data)
                                 if (data){
                                    self.setState({redirect : true})
                                    alert('User Signed In Successfully!')
                                 }
                             }).catch(function(error){
                                    alert(error.message + ". Please try again") 
                             })
            } //console.log("SUCCESS", data.additionalUserInfo.isNewUser)
          }
        }).catch(function(error){
            console.log("SUCCESS", false)
            console.log("error", error.message)
            alert(error.message + " Please try again")
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
                        <p className = "col-md-12"> 
                            <center><img src = "img/avata.png" alt = "Avatar SignUp" style = {{width : '20%'}}/></center>
                        </p>
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

                        <button className = "btn btn-block btn-secondary" onClick ={this.signup}> SIGN UP </button>
                </div>
                <div className = "col-md-4"></div>
            </div>
        )
    }
}

export default SignUpUser;