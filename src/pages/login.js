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
            this.setState({email : e.target.value})
    } 

    handlePasswordInput = (e) => {        
            this.setState({password : e.target.value})
    } 

    login = async (e) => {
        e.preventDefault();
        const loader = document.getElementById('loader').style
        loader.display = 'block' //start loader
        const {email, password} =  this.state
        if (email === '' || password === ''){
            alert("Fill in all fields")
            loader.display = 'none'
        }else {
            const getUserCollection =  await db.collection('Users').where("Email", "==", email).get() //get users from data with the email specified
            let getUserEmailVer; 
            getUserCollection.forEach((snapshot)=>{
            getUserEmailVer = snapshot.data().EmailVerified  //status of email verification
        })
        loader.display = 'none' //stop the loader

        if (getUserEmailVer === false){
            alert("Verify your email before you login")
            this.setState({redirect : true})
        } else {
                fire.auth().signInWithEmailAndPassword(email, password).then((u)=> {
                console.log(u , "SUCCESS");
                alert("You are logged in");
                this.setState({redirect : true})            
            }).catch((error)=>{
                console.log(error)
                alert("Wrong Email or Password. Try Again!")
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
                <div className = "col-md-5"></div>
                <div className = "col-md-2 mt-5"> 
                    <form>
                        <p>
                            <label> Email Address </label>
                            <input type ="email" onChange = {this.handleEmailInput} className ="form-control"/>
                        </p>
                        <p>
                            <label> Password </label>
                            <input type = "password" onChange = {this.handlePasswordInput} className = "form-control"/>
                        </p>
                        <button className = "btn btn-primary btn-block" onClick = {this.login}> LOGIN </button>
                    </form>
                    <div className = ""><center><img src = "img/loader.gif" alt = "loader" style = {{display : 'none', width: '30%'}} id = "loader"/></center></div>       
                </div>
                <div className = "col-md-5"></div>
            </div>
        )
    }
}

export default LoginUser;