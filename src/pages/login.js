import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

import {fire,db} from './config/fire'
import Header from './header'

class LoginUser extends Component {
    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : '', 
            redirect : false, 
            displayLoader : 'none'
        }
    }

    handleEmailInput = (e) => {
            this.setState({email : e.target.value.trim()})
    } 

    handlePasswordInput = (e) => {        
            this.setState({password : e.target.value.trim()})
    } 

    login = async (e) => {
        e.preventDefault();
        let actionn = document.getElementById('actionn')
        let loader = `<img src = '../img/loader.gif' style = 'width : 5%'/>`
        actionn.innerHTML = loader
        const {email, password} =  this.state
        if (email === '' || password === ''){
            alert("Fill in all fields")
            actionn.innerText = 'Login To Proceed'
        }else {
            const getUserCollection =  await db.collection('Users').where("Email", "==", email).get() //get users from data with the email specified
            let getUserEmailVer; 
            getUserCollection.forEach((snapshot)=>{
            getUserEmailVer = snapshot.data().EmailVerified  //status of email verification
            })

            if (getUserEmailVer === false){
                alert("Verify your email before you login")
                this.setState({redirect : true})
            } else {
                fire.auth().signInWithEmailAndPassword(email, password).then((u)=> {
                console.log(u , "SUCCESS");
                alert("Log in Successful.");
                localStorage.setItem("IsUserLoggedIn", true)
                this.setState({redirect : true})            
                }).catch((error)=>{
                    console.log(error)
                    alert("Wrong Email or Password. Try Again!")
                    actionn.innerText = 'Login To Proceed'
                })
                }
            }
    }      

    render(){
        const redirect = this.state.redirect
        if (redirect){
            return <Redirect to = '/'/> //redirect to the home page
        }

        return (
            <div className = "col-md-12">
                <div className = "col-md-12">
                    <Header/>
                </div>
                <div className = "col-md-4"></div>
                <div className = "col-md-4 mt-5"> 
                    <form>
                        <p>
                            <input type ="email" placeholder = "Email" onChange = {this.handleEmailInput} className ="form-control"/>
                        </p>
                        <p>
                            <input type = "password" placeholder = "Password" onChange = {this.handlePasswordInput} className = "form-control"/>
                        </p>
                        <button className = "btn btn-block btn-primary" id = "actionn" style = {{padding : '15px'}} onClick ={this.login}> Login To Proceed </button>
                    </form>
                </div>
                <div className = "col-md-4"></div>
            </div>
        )
    }
}

export default LoginUser;