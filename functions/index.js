const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

//const sgMail = require('@sendgrid/mail');
//const SENDGRID_API_KEY = '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';

const SENDGRID_API_KEY = functions.config().sendgrid.key;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

//function to validate users and verify their emails

exports.firestoreValidateNewUsers = functions.firestore
    .document('Users/{UsersId}')
    .onCreate((event) => new Promise((resolve, reject) => {
        const userData = event.data();
        console.log("user data", userData)
        const user = userData
        const url = `http://localhost:3000/verifyEmail?email=${user.Email}`
        // const url = "https://www.google.com/"
        if (user) {
            const msg = {
                to: user.Email,
                from: 'ClubMembershipapp@gmail.com',
                subject: 'Verify Email',
                // text: `Hey ${toName}. You have a new follower!!! `,
                html: `
                            <strong> Hey ${user.Name}. Click on the link below to verify your email. </strong>
                                <br/><br/><br/>
                            <center>
                                <a href = ${url}> <button> Verify Email </button> </a>
                            </center>
                        `,
            }
            sgMail.send(msg)
                .then(() => console.log('Email.sent'))
                .catch((e) => {
                    console.log(e)
                })
        }
    }))


// This function is for sending emails to invite users to join clubs 

exports.firestoreInviteEmail = functions.firestore
    .document('Clubs/{ClubsId}')
    .onUpdate((change, context) => new Promise((resolve, reject) => {
        const newData = change.after.data()         //data that just entered firebase
        console.log("NEW DATA", newData)
        const adminEmail = newData.AdminEmail   //AdminEmail value of the new data 
        const clubName = newData.ClubName       //ClubName value of the new data 
        const clubtype = newData.ClubType       //ClubType value of the new data 
        const allMembers = newData.Invites;     //Invites array of the new data
        const currentMemberID = allMembers.length - 1
        const currentMemberEmail = allMembers[currentMemberID].email
        console.log("NEW EMAIL", currentMemberEmail)
        console.log("NEW DATA ID", currentMemberID)
        if (newData) {
            const msg = {
                to: currentMemberEmail,
                from: 'ClubMembershipapp@gmail.com',
                subject: 'Club Invite',
                html: `
                            <strong> Hey. An invite was sent to you by ${adminEmail} to join a club on our app. Click on the link below to view.  </strong>
                                <br> <br>
                            <center>
                                <a href = http://localhost:3000/club/joinClub?clubname=${clubName}&email=${currentMemberEmail}&clubtype=${clubtype}&clubname=${clubName}&adminEmail=${adminEmail}&check={clubmember} ><button> View Invite Message </button></a>
                            </center>
                        `,
            }
            sgMail.send(msg)
                .then(() => console.log('Invite sent'))
                .catch((e) => {
                    console.log(e)
                })
        }
    }))