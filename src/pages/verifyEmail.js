import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { parse } from 'query-string'

import { db, fire } from './config/fire'

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }

    componentDidMount = async () => {
        var getURLVal = parse(this.props.location.search)
        const email = getURLVal.email
        const user = fire.auth().currentUser
        if (email) {
            let userEmailVerified, userID;
            const getUserCollection = await db.collection('Users').where("Email", "==", email).get()
            console.log("Check this", getUserCollection.docs)
            getUserCollection.forEach((snapshot) => {
                userEmailVerified = snapshot.data().EmailVerified
                console.log(snapshot.data())
                userID = snapshot.id
            })
            if (userEmailVerified === false) {
                db.collection('Users').doc(userID)
                    .update({
                        EmailVerified: true
                    }).then(async (u) => {
                        await user.updateProfile({
                            emailVerified : true
                        })
                        alert("Verified!")
                    }).catch((error) => {
                        console.log('error', error);
                        alert("Cannot Verify Email, try again!")
                    })
            } else {
                alert("User is verified already")
            }
            this.setState({ redirect: true });
        } else {
            alert("No user! Go sign up!")
            this.setState({ redirect: true })
        }
    }

    render() {
        if (this.state.redirect === true) {
            return <Redirect to="/" />
        }

        return <div />
    }
}

export default VerifyEmail;