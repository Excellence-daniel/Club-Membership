import React, {Component} from 'react'

import Header from '../header'

import {fire, db} from '../config/fire'

class ViewProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            id : '',
            name : '', 
            email : '',
            address : '',
            phone : '',
            profile : {}, 
            textBoxDisable : true, 
            editBtn : false, 
            redirect : false
        }
    }

    componentDidMount(){
        fire.auth().onAuthStateChanged((user) => {
        const self = this
        if (user){
        var users = db.collection('Users')
        users.where ('Email', '==', user.email).get()
            .then((snapshot) => {
                snapshot.forEach((doc,id) =>{
                    console.log("Doc Data: ", doc.data())
                    const prof = doc.data()
                    self.setState({profile : doc.data(), 
                                name  : prof.Name, 
                                email : prof.Email, 
                                address : prof.Address, 
                                phone : prof.Phone, 
                                id : doc.id })
                })
            }).catch((error) => {
                alert("You are not logged in, try again")
                self.setState({redirect : true})
            })
        } else {
            alert("Login and try again!")
        }
    })
}

    editProfile = () =>{
        this.setState({textBoxDisable : false, editBtn : true})
    }

    changeName = (e) => {
        this.setState({name : e.target.value.trim()})
    }

    changeAddress = (e) =>{
        this.setState({address : e.target.value.trim()})
    }

    changePhone = (e) => {
        this.setState({phone : e.target.value.trim()})
    }

    updateProfile = async () =>{
        await db.collection('Users').doc(this.state.id)
        .update({
           Name : this.state.name, 
           Email : this.state.email,
           Address : this.state.address,
           Phone : this.state.phone
       }).then((u) => {
        this.setState({editBtn : false, textBoxDisable : true});
        alert("Updated!")
       }).catch((error) => {
         console.log('error', error);
         alert("Cannot Update, try again!")
     })
  }

    render(){
        var {textBoxDisable, editBtn} = this.state
        return (
            <div className = "col-md-12"> 
                <Header/>
                    <div className = "col-md-4"></div>                
                    <div className = "col-md-4 mt-4 card card-body"> 
                        <h2><center> Profile Information </center></h2>
                        <ul className = "list-group">
                            <li> Name : <input className = "form-control" type = "text" onChange = {this.changeName} disabled = {textBoxDisable} value = {this.state.name}/></li>
                            <li> Email : <input className = "form-control" type = "text" onChange = {this.changeEmail} disabled = {true} value = {this.state.email}/> </li>
                            <li> Address : <input className = "form-control" type = "text" onChange = {this.changeAddress} disabled = {textBoxDisable} value = {this.state.address}/> </li>
                            <li> Phone Number : <input className = "form-control" type = "text" onChange = {this.changePhone} disabled = {textBoxDisable} value = {this.state.phone}/> </li>
                            <p className = "mt-3">
                                <center>
                                    <button className = "btn btn-success" disabled = {editBtn} onClick = {this.editProfile}> EDIT </button> 
                                    &nbsp; &nbsp;
                                <   button onClick = {this.updateProfile} disabled = {textBoxDisable} className = "btn btn-success"> UPDATE </button>
                                </center>
                            </p>
                        </ul>
                </div>
                <div className = "col-md-4"></div>
            </div>
        )
    }
}

export default ViewProfile;