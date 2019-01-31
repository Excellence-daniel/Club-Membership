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

    calllogin=(email, password)=> {
        fire.auth().signInWithEmailAndPassword(email, password).then((u)=> {
            console.log(u , "SUCCESS");
            alert("You are logged in");
            this.setState({redirect : true})            
        }).catch((error)=>{
          console.log(error)
          alert("Wrong Email or Password")
        })
    } 

    login = async (e) => {
        e.preventDefault();
        const {email, password} =  this.state
        if (email === '' || password === ''){
            alert("Fill in all fields")
        }else {
            const getUserCollection =  await db.collection('Users').where("Email", "==", email).get()
            const getUser = await getUserCollection.docs[0]._document.proto.fields;
            const getUserEmailVer = await getUser.EmailVerified.booleanValue //to get if user is verified
            
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
                    alert("Wrong Email or Password")
                })
            }
        }
    }      

    render(){
        const redirect = this.state.redirect
        if (redirect){
            return <Redirect to = '/'/>
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
                </div>
                <div className = "col-md-5"></div>
            </div>
        )
    }
}

export default LoginUser;