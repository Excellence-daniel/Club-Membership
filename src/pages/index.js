import React, {Component} from 'react'

import Header from './header'
// import {fire} from './config/fire'

class LandingPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            //loginStatus : false
            status : false
        }
    }

    componentDidMount(){
        var status = localStorage.getItem("LOGIN")
        this.setState({status})
    }

    render(){
        return (
            <div>
                <Header isloggedIn ={this.state.status}/>
            </div>
        )
    }
}

export default LandingPage;