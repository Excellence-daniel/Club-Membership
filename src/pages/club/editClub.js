import React, {Component} from 'react'

import {fire,db} from '../config/fire'

class EditClub extends Component{
    componentDidMount(props){
        const clubId = this.props.location.state.id
        db.collection('Clubs').doc(clubId).get()        
        .then(function(data){
            let userData = data._document.proto.fields
            console.log(data._document.proto.fields)
            this.setState({name:userData.AdminName, email : userData.Email, })
        })

            // console.log("sdfghjklhgfd",this.props.location.state)
    }
    render(){
        
        return (
            <div> 
               
            </div>
        )
    }
}

export default EditClub;