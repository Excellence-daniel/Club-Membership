import React, {Component} from 'react'

import Header from '../header'
import {db} from '../config/fire'
// import '../index.css'

class ViewClubs extends Component {
    constructor(props){
        super(props);
        this.state = {
            clubs : []
        }
    }

    componentDidMount(){
        const allClubs = []
        db.collection('Clubs').where("Email", "==", "oyeniranexcellenced@gmail.com").get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
                allClubs.push(doc.data())
            });
            console.log("ALL:", allClubs)
            if (allClubs.length > 0){
                this.setState({clubs : [...this.state.clubs, ...allClubs]})
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

    displayTable = () => {
        if (this.state.clubs !== null){
            return (
                    <div>
                    {this.state.clubs.map((club, id) => (
                        <tr key = {id}>
                        <td> {club.ClubName} </td>
                        <td> {club.ClubType} </td>
                        <td> {club.Email} </td> 
                        <td> {club.MemberLimit} </td>
                        </tr>
                    ))}
                    </div>
            ) 
        } else {
            return <div><i><h2> No data to show </h2></i> </div>
        }
    }

    render(){
        return (
            <div class = "col-md-12">
                <div class = "col-md-12">
                    <Header/>
                </div> 
                <div class = "col-md-12">
                    <table> 
                        <thead>
                            <tr>
                                <th> Club Name</th>
                                <th>Club Type </th> 
                                <th> Email </th>
                                <th> Member Limit </th>
                                <th> Members </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr> 
                                {this.displayTable()}
                            </tr>
                        </tbody>
                    </table>
                </div>
            
            </div>
        )
    }
}

export default ViewClubs;