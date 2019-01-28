import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

import {fire} from './config/fire'
import Header from './header'


class LoginUser extends Component {
    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : '', 
            redirect : false
        }
    }

    handleEmailInput = (e) => {
            this.setState({email : e.target.value})
        console.log(this.state.email)
    } 

    handlePasswordInput = (e) => {        
            this.setState({password : e.target.value})
        console.log(this.state.password)
    }  

    login = (e) => {
        e.preventDefault()
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=> {
            console.log(u , "SUCCESS")
            alert("You rare logged in");
            this.setState({redirect : true})

        }).catch((error)=>{
          console.log(error)
        })
      }

    render(){
        const redirect = this.state.redirect
        if (redirect){
            return <Redirect to = './'/>
        }
        return (
            <div className = "col-md-12">
                <div className = "col-md-12">
                    <Header/>
                </div>
                <div className = "col-md-6 mx-auto card card-body"> 
                    <form>
                        <p>
                            <label> Email Address </label>
                            <input type ="email" onChange = {this.handleEmailInput} className ="form-control"/>
                        </p>
                        <p>
             e               <label> Password </label>
                            <input type = "password" onChange = {this.handlePasswordInput} className = "form-control"/>
                        </p>
                        <button className = "btn btn-primary" onClick = {this.login}> LOGIN </button>
                    </form>       
                </div>
            </div>
        )
    }
}

export default LoginUser;