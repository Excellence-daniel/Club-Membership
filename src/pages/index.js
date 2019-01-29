import React, {Component} from 'react'

import Header from './header'
// import {fire} from './config/fire'

class LandingPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            loginStatus : false
        }
    }

    render(){
        return (
            <div>
                <Header/>
            </div>
        )
    }
}

export default LandingPage;