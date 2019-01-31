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
    .document('Clubs/{ClubsId}/Members')
    .onUpdate((change, context) => new Promise((resolve,reject) => { 
        const ClubInviteData = change.after.data();
        console.log("Change After ", change.after.data())
        console.log("Before Data", change.before.data())
        console.log("NEW DATA", ClubInviteData.Members)
        // console.log("ClubInviteData", ClubInviteData)
//                     const user = userData
//                     const 
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
//             //sgMail.send(msg)
//             .then(()=>console.log('Email.sent'))
//              .catch((e) => {
//                 console.log(e)
//              })              
// }
}))

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
