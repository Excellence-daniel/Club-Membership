import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import '../index.css'

import {fire} from './config/fire'
const liStyle = {
    display : 'block'
}

function logOut(){
    fire.auth().signOut()
    .then(function(){
        localStorage.setItem("LOGIN", false)
        console.log("HEY")
    })
    return <Redirect to = '/'/>
}

function Header (){
   const status = localStorage.getItem("LOGIN")
   console.log(status)
        if(status !== true){
            return (
                <div className = "col-md-12">
                    <div className = "col-md-4"> 
                        <h2> CLUB MEMBERSHIP APP </h2>
                    </div>
                    <div className = "col-md-5"></div>
                    <div className = "col-md-3 mt-2"> 
                        <nav className ="nav nav-pills nav-justified">
                             <Link to = "/login" className = "nav-link" style = {{color: '#fff',backgroundColor: "#337ab7"}}>  LOGIN  </Link>
                                &nbsp; &nbsp;
                             <Link to = "/signup" className = "nav-link" style = {{color: '#fff',backgroundColor: "#337ab7"}}> SIGN UP </Link>
                        </nav>
                    </div>
                </div>
            )
        } else {
           return (
            <div className = "col-md-12">
                <div className = "col-md-4"> 
                    <h2> CLUB MEMBERSHIP APP </h2>
                </div>
                <div className = "col-md-5"></div>
                <div className = "col-md-3 mt-2">
                    <ul>
                        <Link to = "./profile/viewProfile" style = {{textDecoration : 'none', cursor : 'pointer'}}> <li> PROFILE </li> </Link>
                        <li className ="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style = {{textDecoration : 'none', cursor : 'pointer'}}> CLUBS </li>
                                    <ul className ="dropdown-menu" id="drop-menu" >
                                        <Link to = "/club/createClub" className = "nav-link" style = {{color: '#fff',backgroundColor: "#337ab7"}}> Create Clubs </Link>
                                        <Link to = "/club/addMembers"><li style = {liStyle}>Add Members to Club (via Email) </li></Link>  
                                        <Link to = "/club/viewClubs"><li style = {liStyle}> View Created Clubs </li></Link>
                                    </ul>

                        <li> <button className = "btn btn-danger" onClick = {logOut}> LOG OUT </button> </li>
                    </ul>
                </div>
            </div>
           )
        }     
}

export default Header;