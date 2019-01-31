import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import '../index.css'

import {fire,db} from './config/fire'
const liStyle = {
    display : 'block'
}

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : false,
            redirect : false
        }
    }
    componentDidMount =async () => {
        const user = fire.auth().currentUser        
        if (user){
            //if user is present, check of his email is verified
                let emailVerifiied = false
                const getUserCollection =  await db.collection('Users').where("Email", "==", user.email).get()
                console.log("HEY", getUserCollection)
                if(getUserCollection.docs.length > 0){
                    const getUser = getUserCollection.docs[0]._document.proto.fields; 
                    const getUserEmailVer = getUser.EmailVerified.booleanValue
                    emailVerifiied = getUserEmailVer
                } 

            if (emailVerifiied === false){
                 this.setState({isLoggedIn : false})
                 console.log("User is in but email is not verified ")
            } else {
                 this.setState({isLoggedIn : true})
                 console.log("User is in and verfied")
            }
        } else{
             console.log("User is out.")
             this.setState({isLoggedIn : false})
         }
    }

    logOut =()=> {
        fire.auth().signOut()  
    }

    render(){   
        if (this.state.redirect === true ){
            return <Redirect to = '/'/>
        }     
        console.log("LoggedIn: " ,this.state.isLoggedIn)
        if(this.state.isLoggedIn === false){
            return (
                <div className = "col-md-12">
                    <div className = "col-md-12" > 
                        <center><h1> CLUB MEMBERSHIP APP </h1></center>
                        <div className = "col-md-5"></div>
                        <div className = "col-md-2 mt-3">
                            <center>
                                <nav className ="nav nav-pills nav-justified">
                                    <Link to = "/login" className = "nav-link" style = {{color: '#fff',backgroundColor: "#337ab7"}}>  LOGIN  </Link>
                                        &nbsp; &nbsp;
                                    <Link to = "/signup" className = "nav-link" style = {{color: '#fff',backgroundColor: "#337ab7"}}> SIGN UP </Link>
                                </nav>
                            </center>
                        </div>
                        <div className = "col-md-5"> 
                        </div>
                    </div>
                </div>
            )
        } else {
           return (
            <div className = "col-md-12">
                    <div className = "col-md-12" > 
                        <center><h1> CLUB MEMBERSHIP APP </h1></center>
                        <div className = "col-md-4"></div>
                        <div className = "col-md-4 mt-3">
                            <center>
                            <ul>
                                <Link to = "/profile/viewProfile" style = {{textDecoration : 'none', cursor : 'pointer', color: 'black'}}> <li> PROFILE </li> </Link>
                                <li className ="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style = {{textDecoration : 'none', color : 'black', cursor : 'pointer'}}>
                                             CLUBS 
                                </li>
                                            <ul className ="dropdown-menu" id="drop-menu" >
                                                <Link to = "/club/createClub" style = {{textDecoration : 'none', cursor:'pointer'}}> <li style = {liStyle}> Create Clubs </li> </Link>
                                                <Link to = "/club/addMembers" style = {{textDecoration : 'none', cursor:'pointer'}}>
                                                        <li style = {liStyle}>
                                                            Add Members to Club (via Email) 
                                                        </li>
                                                </Link>  
                                                <Link to = "/club/viewClubs" style = {{textDecoration : 'none', cursor:'pointer'}}>>
                                                        <li style = {liStyle}> 
                                                            View Created Clubs 
                                                        </li>
                                                </Link>
                                            </ul>
                                <li> <button className = "btn btn-danger" onClick = {this.logOut}> LOG OUT </button> </li>
                            </ul>
                            </center>
                        </div>
                        <div className = "col-md-4"></div>
                    </div>

            </div>
           )
        }     
    }
}
export default Header;