import React from 'react';
import {Link} from 'react-router-dom';
const liStyle = {
    display : 'block'
}



function Header (props){
        if(props.loginStatus === false){
            return (
                <div className = "col-md-12">
                    <div className = "col-md-4"> 
                        <h2> CLUB MEMBERSHIP APP </h2>
                    </div>
                    <div className = "col-md-5"></div>
                    <div className = "col-md-3 mt-2"> 
                        <ul className = "nav nav-pills nav-fill">
                                <Link to = "./login"> <li className = "nav-item"> LOGIN </li> </Link>
                                <Link to = "./signup"> <li className = "nav-item"> SIGN UP </li> </Link>
                        </ul>
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
                        <Link to = "./profile/viewProfile"> <li> PROFILE </li> </Link>
                        <li className ="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> CLUBS </li>
                                    <ul className ="dropdown-menu" id="drop-menu" >
                                        <Link to = "./club/createClub"><li style = {liStyle}> Create Clubs </li></Link>
                                        <Link to = "./club/addMembers"><li style = {liStyle}>Add Members to Club (via Email) </li></Link>  
                                        <Link to = "./club/viewClubs"><li style = {liStyle}> View Created Clubs </li></Link>
                                    </ul>

                        <li> <button className = "btn btn-danger" onClick = {props.logOut}> LOG OUT </button> </li>
                    </ul>
                </div>
            </div>
           )
        }
    

       
}

export default Header;