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

     signup = (e) => {
         e.preventDefault()
         
         db.collection('Users').add({
            Name : this.state.name, 
            Email : this.state.email,
            Address : this.state.address,
            Phone : this.state.phone,
            Password : this.state.password
         }).then((u) => {
            fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
                // console.log(u , "SUCCESS")
             }).catch((error) => {
                // console.log(error);
             })
             this.setState({redirect : true})
         })
         
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
                <div className = "col-md-6">
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
            </div>
        )
    }
}

export default SignUpUser;