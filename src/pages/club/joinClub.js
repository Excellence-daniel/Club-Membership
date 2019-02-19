import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {parse} from 'query-string'

import {fire,db} from '../config/fire'

class JoinClub extends Component{
    constructor(props){
        super(props);
        this.state = {
            redirect : false, 
            redirectSignUp : false,
            email : '', //email of the person invite was sent to
            clubname : '', //club the user was invited to join
            clubtype : '',
            adminEmail : ''//the creator of the club
        }
    }

    componentDidMount(){
        console.log("DSFHNJHJFSK" , parse(this.props.location.search).name)
        var getURLVal = parse(this.props.location.search)
        this.setState({email : getURLVal.email, adminEmail : getURLVal.adminEmail, clubname :getURLVal.clubname, clubtype : getURLVal.clubtype}) 
        console.log(getURLVal.clubtype)
    }

    acceptInvite = async () => {
        // fire.auth().signOut()  
        var loader = document.getElementById('loader')
        const img = '<img src = "../img/loader.gif" style = "width : 7%"/>' 
        const text = "Accept Invite"
        loader.innerHTML = img 
        console.log(this.state.clubname)
        var newClub = {"Club":this.state.clubname, "Type":this.state.clubtype}
        const getUserData = await db.collection('Users').where('Email', "==", this.state.email).get() //get user details using emails as ref 
        let user, userId, clubId;
        let clubMembers = []
        let clubInvites = []
        const getClubData = await db.collection('Clubs').where('ClubName', '==', this.state.clubname).get()  //get club details 
        const isClubDataPresent = getClubData.docs
        if(!(isClubDataPresent.length > 0)){
            alert('Club does not exist!')
            loader.textContent = text
        }else{
            console.log(getClubData.docs)
            getClubData.forEach((snapshot)=>{
            var clubsDaata = snapshot.data()    //get data relating to the club from firebase
            var mmenberLimit = clubsDaata.MemberLimit   //number of members that can be added to the group
            var memberrs = clubsDaata.Members   //members array from the club collection
            console.log(mmenberLimit, memberrs)
            if (memberrs.length < parseInt(mmenberLimit)){ 
                var checcck =  memberrs.filter(member => (member.email === this.state.email))  //check if the email exists in the array of objects 'Members'
                console.log("CEECL", checcck.length)
                if (checcck.length > 0 ){    //returned data is an array, check array length 
                alert("You already belong to this club. ")  
                window.close();     //close the tab in the browser
                }else{
                    getUserData.forEach((snapshot)=>{
                        console.log("DTATA",snapshot.data())
                        user = snapshot.data()  //object data of the user
                        userId = snapshot.id    //id of the user in firebase
                    })                
                    // if a user is gotten 
                    if(user){
                        const joinedClubs = user.ClubsJoined    //get all the clubs the user has joined
                        joinedClubs.push(newClub)   //push the new club into that array
                        console.log(userId)
                        console.log(joinedClubs)
                        db.collection('Users').doc(userId.trim())
                        .update({
                            ClubsJoined : joinedClubs    //update the clubs joined array in the 'Users' collection of the user 
                        })
                        .then(async()=>{
                            //update the members array in collection 'Clubs'
                            const getClub = await db.collection('Clubs').where("ClubName", "==", this.state.clubname).get()
                            getClub.forEach((snapshot) => {
                                console.log("SNAPSNAP", snapshot.data())
                                clubMembers = snapshot.data().Members       //get members of the club
                                clubInvites = snapshot.data().Invites       //get invites array in club
                                clubId = snapshot.id                        //get Id of club
                            })
            
                            console.log(clubInvites)
                            const newMember = {"name": user.Name, "email":user.Email}
                            console.log("NEW MEMBER", newMember)
                            clubMembers.push(newMember)      //add the new email to the list of member emails
                            let memberindex = clubInvites.findIndex(invitee => invitee.email === this.state.email)  //get index of object with email as ref
                            if(memberindex >= 0){
                                console.log(memberindex)
                                clubInvites[memberindex].accepted = true    //set invite accepted option to true
                            }
            
                            await db.collection('Clubs').doc(clubId).update({       //update 
                                Members : clubMembers,
                                Invites : clubInvites
                            }).then(()=>{
                                alert("You have joined the club!")
                                loader.textContent = text
                                this.setState({redirect : true})
                            })
                        })
                    } else {
                        localStorage.setItem("ClubJoined", JSON.stringify(newClub))
                        var signUp = window.confirm("You have to sign up before you can any club. Would you like to sign up?")
                        fire.auth().signOut() 
                        if (signUp === true){
                            this.setState({redirectSignUp : true})
                        } else{
                            alert("Thank you")
                            window.close()
                        }
                    }
                }
            }else {
                alert("You cant join this club, members limit reached!")
                window.close()
            }
            })
        }
    }

    declineInvite = () =>{        
        var check = window.confirm("You just declined this invite. Would you like to join our club membership app?")
        if (check === true){
            this.setState({redirect : true})
        } else {
            //close the window tab
            window.close()
        }
    }

    render(){
        if (this.state.redirect === true){
            return <Redirect to = "/"/>
        } else if (this.state.redirectSignUp) {
            return <Redirect to = "/signup"/>
        }
        const {email, clubname, adminEmail} = this.state
        return (
        <div className = "container">
            <div className = "row">
                <div className = "col-md-12">
                    <div className = "col-md-3"></div>
                    <div className = "col-md-6">
                        <h3> Hey {email}, </h3>
                            <p style = {{lineHeight : '2'}}>
                                You have been sent an invite by {adminEmail} to join {clubname} on our app. Click on the either of the buttons below to respond.
                                <br/>
                                If you are a new user,by accepting this invite, you would have to sign up first and accept the invite again. 
                            </p>
                        <p>
                            <button className = "btn btn-success deff" id = "loader" onClick = {this.acceptInvite} > Accept Invite </button>
                                &nbsp; &nbsp;
                            <button className = "btn btn-danger deff" onClick = {this.declineInvite}> Decline Invite </button>
                        </p>
                    </div>
                    <div className = "col-md-3"></div>
                </div>
            </div>
        </div>
        )
    }
}

export default JoinClub;