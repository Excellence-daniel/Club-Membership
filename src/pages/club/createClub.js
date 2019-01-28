import React, {Component } from 'react'

class CreateClub extends Component{
    render(){
        return (
            <div class = "col-md-12"> 
                <div class = "col-md-6 mx-auto card card-body">
                    <form> 
                        <p>
                            <label> Name </label> 
                            <input type = "text" class = "form-control"/>
                        </p>
                        
                        <p> 
                            <select class = "form-control"> 
                                <option> Gaming </option> 
                                <option> Books </option>
                                <option> Politics </option> 
                            </select>
                        </p>

                        <p> 
                            <label> Members Limit </label>
                            <input type = "number" class = "form-control"/>
                        </p>
                        <button class = "btn btn-success btn-block"> CREATE CLUB </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default CreateClub;