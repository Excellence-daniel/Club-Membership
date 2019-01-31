import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'

import {db} from './config/fire'

class VerifyEmail extends Component{
    constructor(props){
        super(props); 
        this.state = {
            redirect : false
        }
    }

    componentDidMount = async () => {
        const email = localStorage.getItem("Email")
        if (email){
            const getUserCollection =  await db.collection('Users').where("Email", "==", email).get()
            const userID = getUserCollection.docs[0].id
            const userEmailVerified = userID._document.proto.fields.EmailVerified.booleanValue
            if(userEmailVerified === false){
                db.collection('Users').doc(userID)
                .update({
                    EmailVerified : true
                }).then((u) => {
                    alert("Verified!")
                }).catch((error) => {
                    console.log('error', error);
                    alert("Cannot Verify Email, try again!")
                })
            } else {
                alert("User is verified already")
            }
            this.setState({redirect : true});
        } else {
            alert ("No user! Get out!")
            this.setState({redirect : true})
        }
    }    

    render(){
        if (this.state.redirect === true){
            return <Redirect to = "/" />
        }

        return <div/>
    }
}

export default VerifyEmail;