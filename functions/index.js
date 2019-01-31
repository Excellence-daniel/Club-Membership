const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const SENDGRID_API_KEY = functions.config().sendgrid.key;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

exports.firestoreValidateNewUsers = functions.firestore
    .document('Users/{UsersId}')
    .onCreate((event) => new Promise((resolve,reject) => { 
        const userData = event.data();
        console.log("user data", userData)
                    const user = userData
                    const url = "localhost:3000/verifyEmail"
                if (user){
                    const msg = {
                        to: user.Email,
                        from: 'ClubMembershipapp@gmail.com',
                        subject:  'Verify Email',
                        // text: `Hey ${toName}. You have a new follower!!! `,
                        html: `
                            <strong> Hey ${user.Name}. Click on the link below to verify your email. </strong>
                                <br/><br/><br/>
                            <center>
                                <a href = ${url}> hjhkcnlshdjhdjsscuhdsu37ew890ruwe8eujnshc7832995294kjschdsxjc </a>
                            </center>
                        `,
                }
            sgMail.send(msg)
            .then(()=>console.log('Email.sent'))
             .catch((e) => {
                console.log(e)
             })              
}}))

exports.firestoreInviteEmail = functions.firestore
    .document('Clubs/{ClubsId}')
    .onUpdate((change, context) => new Promise((resolve,reject) => { 
        const newData = change.after.data()
        const adminName = newData.AdminName
        const clubName = newData.ClubName
        const allMembers = newData.Members;
        const currentMemberID = allMembers.length - 1 
        const currentMemberEmail = allMembers[currentMemberID].name
        console.log("NEW EMAIL", currentMemberEmail)
        const url = "localhost:3000/club/joinClub.js"
                if (newData){
                    const msg = {
                        to: currentMemberEmail,
                        from: 'ClubMembershipapp@gmail.com',
                        subject:  'Verify Email',
                        html: `
                            <strong> Hey. An invite was sent to you by ${adminName} to join a club on our app. Click on the link below to view.  </strong>
                                <br> <br>
                            <center>
                                <a href = ${url}><button> View Invite Message </button></a>
                            </center>
                        `,
                }
                sgMail.send(msg)
            .then(()=>console.log('Email.sent'))
             .catch((e) => {
                console.log(e)
             })              
}}))

// exports.firestoreInviteEmail = functions.firestore
//     .document('Clubs/{ClubsId}/Invites')
//     .onCreate((event) => new Promise((resolve,reject) => { 
//         const userData = event.data();
//         console.log("user data", userData)
//                     const user = userData
//                     const url = "localhost:3000/verifyEmail"
//                 if (user){
//                     const msg = {
//                         to: user.Email,
//                         from: 'ClubMembershipapp@gmail.com',
//                         subject:  'Verify Email',
//                         // text: `Hey ${toName}. You have a new follower!!! `,
//                         html: `
//                             <strong> Hey ${user.Name}. Click on the link below to verify your email. </strong>
//                                 <br/><br/><br/>
//                             <center>
//                                 <a href = ${url}> hjhkcnlshdjhdjsscuhdsu37ew890ruwe8eujnshc7832995294kjschdsxjc </a>
//                             </center>
//                         `,
//                 }
//             sgMail.send(msg)
//             .then(()=>console.log('Email.sent'))
//             .catch((e) => {
//                 console.log(e)
//             })              
//     }}))
