import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading("Please wait as we log you in...")
    setError("")
    setSuccess("")

    try {
      // Use FormData to match your Flask request.form requirements
      const data = new FormData()
      data.append("email", email)
      data.append("password", password)

      const response = await axios.post("https://victordesigner.alwaysdata.net/api/signin", data)
      setLoading("")

      if (response.data.message === "login successful") {
        // Your API returns { message, role, user } OR { message, role, admin }
        const responseData = response.data;

        // 1. Save the entire response object to localStorage
        // This keeps the 'role' and the specific data (user or admin) together
        localStorage.setItem("user", JSON.stringify(responseData));

        // 2. Decision Logic based on the 'role' key from your API
        if (responseData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        // Clear fields on success
        setEmail("")
        setPassword("")
      } else {
        // Handle "login failed" message
        setError(response.data.message);
      }
    } catch (err) {
      setLoading("")
      if (err.response && err.response.data && err.response.data.response) {
        setError(err.response.data.response)
      } else {
        setError(err.message)
      }
    }
  }

  return (
    <div className='row mt-4 justify-content-center'>
      <div className='col-md-6 p-4 card shadow'>
        <h2 className="text-center mb-4">Sign In</h2>
        <form onSubmit={submit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="alert alert-info">{loading}</div>}
          {success && <div className="alert alert-info">{success}</div>}

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder='example@mail.com'
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Enter your password'
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPass"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="form-check-label" htmlFor="showPass">Show Password</label>
          </div>

          <button type='submit' className='btn btn-primary w-100 py-2 mb-3'>
            Sign in
          </button>
          
          <p className="text-center">
            Don't have an account? <Link to="/signup" className="text-decoration-none">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signin