import React, {Component} from 'react'

class JoinClub extends Component{
    constructor(props){
        super(props);
        this.state = {
            redirect : false, 
            email : '', //email of the person invite was sent to
            clubname : '', //club the user was invited to join
            adminName : ''//the creator of the club
        }
    }

    componentDidMount(){
        console.log("DSFHNJHJFSK" , this.props.location.search)
    }

    acceptInvite = () => {
        alert("Yay!. You have to sign up on the app.")
        this.setState({redirect : true})
    }

    declineInvite = () =>{
        
        // confirm("You just declined this invite. Would you like to join our club membership app?")
        // if (true){
        //     this.setState({redirect : true})
        // } else {
        //     //close the window tab
        // }
    }

    render(){
        const {email, clubname, adminName} = this.state
        return (
        <div className = "container">
            <div className = "row">
                <div class = "col-md-12">
                    <h3> Hey {email}, 
                            <br/>
                            You have been sent an invite by {adminName} to join {clubname} on our app. Click on the either of the buttons below to respond.
                    </h3>
                    <p>
                        <button className = "btn btn-success" onClick = {this.acceptInvite}> Accept Invite </button>
                            &nbsp; &nbsp;
                        <button className = "btn btn-danger" onClick = {this.declineInvite}> Decline Invite </button>
                    </p>

                </div>
            </div>
        </div>
        )
    }
}

export default JoinClub;