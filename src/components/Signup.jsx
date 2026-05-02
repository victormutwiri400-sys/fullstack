import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const Signup = () =>{
    // adding the state for each input
    const [username, setUsername] = useState("")
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const[phone, setPhone] = useState("")
    const[loading, setLoading] = useState("")
    const[success, setSuccess] = useState("")
    const[error, setError] = useState("")

    // function to post data in the database
    const submit = async  (e) => {
        // preventing default reloading behaviour of the form
        e.preventDefault()
        // updating the loading message
        setLoading("Please wait as we upload your data!")
        // hosting user input to the database
        try {
            // storing user input into data variable
            const data= new FormData()
            data.append("username", username)
            data.append("email", email)
            data.append("password", password)
            data.append("phone_number", phone)

            //posting the data to the database using backend api
            const response = await axios.post("http://victordesigner.alwaysdata.net/api/signup", data)
            // updating loading message to empty
            setLoading("")
            // updating success message
            setSuccess (response.data.Success)

            //clearing the inputs
            setUsername("")
            setEmail("")
            setPassword("")
            setPhone("")
        } catch (error) {
            // updating loading message to empty
            setLoading("")
            // updating the error message
            setError(error.message)
        }
    }

  return (
    <div className="row mt-4 justify-content-center">
      <div className="col-md-6 card shadow p-4">
        <h2>Signup</h2>
        <form onSubmit={submit}>
          {loading}
          {success}
          {error}

          <input type="text" placeholder="Enter your username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required /><br />
          <input type="email" placeholder="Enter your email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
          <input type="tel" placeholder="Enter your phone number" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required /><br />
          <input type="password" placeholder="Enter your password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />

          <button type="submit" className="btn btn-primary">Signup</button>
          <p className="mt-3">Already have an account? <Link to="/signin">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;