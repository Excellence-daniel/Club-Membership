const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const SENDGRID_API_KEY = functions.config().sendgrid.key;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

//function to validate users and verify their emails

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
                                <a href = ${url}> <button> Verify Email </button> </a>
                                <br>
                                or run the link below : 

                                <strong> localhost:3000/verifyEmail </strong>
                            </center>
                        `,
                }
            sgMail.send(msg)
            .then(()=>console.log('Email.sent'))
             .catch((e) => {
                console.log(e)
             })              
}}))


// This function is for sending emails to invite users to join clubs 

exports.firestoreInviteEmail = functions.firestore
    .document('Clubs/{ClubsId}')
    .onUpdate((change, context) => new Promise((resolve,reject) => { 
        const newData = change.after.data()
        console.log("NEW DATA", newData)
        const adminEmail = newData.AdminEmail
        const clubName = newData.ClubName
        const clubtype = newData.ClubType
        const allMembers = newData.Invites;
        const currentMemberID = allMembers.length - 1 
        const currentMemberEmail = allMembers[currentMemberID].email
        console.log("NEW EMAIL", currentMemberEmail)
        console.log("NEW DATA ID", currentMemberID)
        const url = `localhost:3000/club/joinClub?email=${currentMemberEmail}&adminEmail=${adminEmail}&clubname=${clubName}&clubtype=${clubtype}`
                if (newData){
                    const msg = {
                        to: currentMemberEmail,
                        from: 'ClubMembershipapp@gmail.com',
                        subject:  'Verify Email',
                        html: `
                            <strong> Hey. An invite was sent to you by ${adminEmail} to join a club on our app. Click on the link below to view.  </strong>
                                <br> <br>
                            <center>
                                <a href = ${url}><button> View Invite Message </button></a>
                                <br>
                                or run the link below : 
                                <br/>
                                <strong> localhost:3000/club/joinClub?email=${currentMemberEmail}&adminEmail=${adminEmail}&clubname=${clubName}&clubtype=${clubtype} </strong>
                            </center>
                        `,
                }
                sgMail.send(msg)
            .then(()=>console.log('Invite sent'))
             .catch((e) => {
                console.log(e)
             })              
}}))