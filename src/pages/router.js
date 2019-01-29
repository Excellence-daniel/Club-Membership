import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import LandingPage from './index'
import LoginUser from './login'
import SignUpUser from './signup'

import ViewClubs from './club/viewClubs'
import AddMembers from './club/addMembers'
import CreateClub from './club/createClub'
import EditClub from './club/editClub'

import ViewProfile from './profile/viewProfile'

function Routerr (){
    return (
        <Router> 
            <div> 

                <Route exact path = "/" component = {LandingPage}/>
                <Route exact path = "/login" component = {LoginUser}/>
                <Route exact path = "/signup" component = {SignUpUser}/>
                <Route exact path = "/club/viewClubs" component = {ViewClubs}/>
                <Route exact path = "/club/addMembers" component = {AddMembers}/>
                <Route exact path = "/club/createClub" component = {CreateClub}/>
                <Route exact path = "/profile/viewProfile" component = {ViewProfile}/>
                <Route exact path = "/clubs/editClub" render ={(props) => <EditClub {...props}/>}/>
            </div>  
        </Router>
    )
}

export default Routerr;
