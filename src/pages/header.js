import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import '../index.css'

import {fire} from './config/fire'
const liStyle = {
    display : 'block'
}

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            status : false,
            redirect : false
        }
    }
    componentDidMount(){
        //console.log("HERWE", this.props.isloggedIn)
        var status = this.props.isloggedIn
        this.setState({status})
        var getLOGIN = localStorage.getItem("LOGIN")
        if (!getLOGIN){
            localStorage.setItem("LOGIN", false)
        }
    }

    logOut = () => {
            fire.auth().signOut()
            .then(() => {
                localStorage.setItem("LOGIN", false);
            })
        }
    render(){   
        if (this.state.redirect === true ){
            return <Redirect to = '/'/>
        }     
        console.log("STATE STATUS", this.state.status, "LS STATUS", localStorage.getItem("LOGIN"))
        if(this.state.status === false){
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
                                                <Link to = "/club/createClub" style = {{textDecoration : 'none', cursor:'pointer'}}> Create Clubs </Link>
                                                <Link to = "/club/addMembers" style = {{textDecoration : 'none', cursor:'pointer'}}>>
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
                        <div className = "col-md-4"> 
                            
                        </div>
                    </div>

            </div>
           )
        }     
    }
}
export default Header;