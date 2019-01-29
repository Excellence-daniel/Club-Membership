import React, {Component} from 'react';

import Header from '../header';
import {db} from '../config/fire'

class AddMembers extends Component {
    constructor(props){
        super(props);
        this.state = {
            clubProfile : {},
            id : ''
        }
    }

    componentDidMount(){
        var club = localStorage.getItem("Clubs");
        db.collection('Clubs').where("ClubName", "==", club).get()
        .then((snapshot) => {
            snapshot.forEach((doc,id) =>{
                console.log(doc.data())
                this.setState({clubProfile : doc.data(), id : doc.id })
                // alert(doc.id)
            })
        })
        console.log(club)
    }

    render(){
       return (
            <div class = "col-md-12"> 
                <div class = "col-md-12">
                    <Header/>
                </div>
                <div class = "col-md-12">
                    <div className = "col-md-3 mx-auto"> 
                        <h2> Add Members</h2>
                        <input type = "email" class = "form-control"/>
                        <p className = "col-md-12 mt-4">
                            <button class = "btn btn-danger"> INVITE </button>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddMembers;