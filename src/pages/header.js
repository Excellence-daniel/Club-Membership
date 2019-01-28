import React, {Component} from 'react';
import {Link} from 'react-router-dom';
const liStyle = {
    display : 'block'
}



class Header extends Component{
    constructor(props){
        super(props);
        this.state ={
            loginStatus : true
        }
    }

    loginStatus = () => {
        if(this.state.loginStatus === false){
            return (
                <div> 
                    <ul>
                            <div>
                            <Link to = "./login"> <li> LOGIN </li> </Link>
                            <Link to = "./signup"> <li> SIGN UP </li> </Link>
                           
                            </div>
                    </ul>
                </div>
            )
        } else {
           return (
            <div>
                <ul>
                    <Link to = "./profile/viewProfile"> <li> PROFILE </li> </Link>
                    <li class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> CLUBS </li>
								  <ul class="dropdown-menu" id="drop-menu" >
                                    <Link to = "./club/createClub"><li style = {liStyle}> Create Clubs </li></Link>
                                    <Link to = "./club/addMembers"><li style = {liStyle}>Add Members to Club (via Email) </li></Link>  
                                    <Link to = "./club/viewClubs"><li style = {liStyle}> View Created Clubs </li></Link>
                                  </ul>

                    <li> <button class = "btn btn-danger"> LOG OUT </button> </li>
                </ul>
            </div>
           )
        }
    }

    render(){
        return (
            <div>
                <div className = "col-md-12">
                    <div className = "col-md-4"> 
                        <h2> CLUB MEMBERSHIP APP </h2>
                    </div>
                    <div className = "col-md-5"></div>
                    <div className = "col-md-3 mt-2">
                        {this.loginStatus()}
                    </div>
                </div>
               
                

            </div> 
        )
    }
}

export default Header;