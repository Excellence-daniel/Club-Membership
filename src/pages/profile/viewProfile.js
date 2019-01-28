import React, {Component} from 'react'

import Header from '../header'

import {db} from '../config/fire'

class ViewProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            id : '',
            name : '', 
            email : '',
            address : '',
            phone : null,
            profile : {}, 
            textBoxDisable : true, 
            editBtn : false
        }
    }

    componentDidMount(){
        var user = db.collection('Users')
        var query = user.where ('Email', '==', 'oyeniranexcellenced@gmail.com').get()
            .then((snapshot) => {
                snapshot.forEach((doc,id) =>{
                    console.log(doc.data())
                    const prof = doc.data()
                    this.setState({profile : doc.data(), name  : prof.Name, email : prof.Email, address : prof.Address, phone : prof.Phone, id : doc.id })
                    // alert(doc.id)
                })
            })
    }

    editProfile = () =>{
        this.setState({textBoxDisable : false, editBtn : true})
    }

    changeName = (e) => {
        // var defaultVal = this.state.name
        this.setState({name : e.target.value})
        console.log(this.state.name)
    }

    changeAddress = (e) =>{
        this.setState({address : e.target.value})
    }

    changePhone = (e) => {
        this.setState({phone : e.target.value})
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
            <div class = "col-md-12"> 
                <Header/>

                <div class = "col-md-6 mx-auto"> 
                    <h2> Profile Information </h2>
                    <ul class = "list-group">
                        <li> Name : <input class = "form-control" type = "text" onChange = {this.changeName} disabled = {textBoxDisable} value = {this.state.name}/></li>
                        <li> Email : <input class = "form-control" type = "text" onChange = {this.changeEmail} disabled = {true} value = {this.state.email}/> </li>
                        <li> Address : <input class = "form-control" type = "text" onChange = {this.changeAddress} disabled = {textBoxDisable} value = {this.state.address}/> </li>
                        <li> Phone Number : <input class = "form-control" type = "text" onChange = {this.changePhone} disabled = {textBoxDisable} value = {this.state.phone}/> </li>
                        <p>
                            <button class = "btn btn-success" disabled = {editBtn} onClick = {this.editProfile}> EDIT </button> 
                            &nbsp; &nbsp;
                        <button onClick = {this.updateProfile} disabled = {textBoxDisable} class = "btn btn-primary"> UPDATE </button>
                        </p>
                    </ul>
                </div>
            </div>
        )
    }
}

export default ViewProfile;