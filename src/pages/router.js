import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import LandingPage from './index'
import LoginUser from './login'
import SignUpUser from './signup'

import ViewClubs from './club/viewClubs'
import AddMember from './club/addMembers'
import CreateClub from './club/createClub'

import ViewProfile from './profile/viewProfile'

function Routerr (){
    return (
        <Router> 
            <div> 

                <Route exact path = "/" component = {LandingPage}/>
                <Route path = "/login" component = {LoginUser}/>
                <Route path = "/signup" component = {SignUpUser}/>
                <Route path = "/club/viewClubs" component = {ViewClubs}/>
                <Route path = "/club/addMember" component = {AddMember}/>
                <Route path = "/club/createClub" component = {CreateClub}/>
                <Route path = "/profile/viewProfile" component = {ViewProfile}/>
            </div>  
        </Router>
    )
}

export default Routerr;
