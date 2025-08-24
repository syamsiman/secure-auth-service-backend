import { useNavigate } from "react-router-dom"
import { AuthContext } from '../../context/AuthContext'
import { useContext, useState } from "react"
import Api from "../../services/api"
import Cookies from "js-cookie"

export default function Login() {
    const navigate = useNavigate() // lowercase as per convention
    const { setIsAuthenticated } = useContext(AuthContext)

    // Form states
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({
        validation: [],
        login: null
    })

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear errors when user types
        setErrors(prev => ({
            ...prev,
            validation: prev.validation.filter(error => error.path !== name),
            login: null
        }))
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({ validation: [], login: null })

        try {
            const response = await Api.post("/api/auth/login", formData)
            
            if (response.data.success) {
                // Store tokens securely
                const { accessToken, user } = response.data.data
                
                // Set HTTP-only cookie for refresh token (handled by backend)
                // Store access token in memory or secure cookie
                Cookies.set("token", accessToken, { 
                    secure: true,
                    sameSite: 'strict'
                })
                
                // Store minimal user info
                Cookies.set("user", JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email
                }))

                setIsAuthenticated(true)
                navigate("/dashboard", { replace: true })
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response

                switch (status) {
                    case 422: // Validation error
                        setErrors(prev => ({
                            ...prev,
                            validation: data.error || []
                        }))
                        break
                    case 401: // Invalid credentials
                        setErrors(prev => ({
                            ...prev,
                            login: "Invalid email or password"
                        }))
                        break
                    default:
                        setErrors(prev => ({
                            ...prev,
                            login: "An error occurred. Please try again."
                        }))
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-4">
                <div className="card border-0 rounded shadow-sm">
                    <div className="card-body">
                        <h4>LOGIN</h4>
                        <hr />
                        
                        {/* Display validation errors */}
                        {errors.validation.length > 0 && (
                            <div className="alert alert-danger">
                                {errors.validation.map((error, index) => (
                                    <p key={index} className="mb-0">
                                        {error.msg}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Display login error */}
                        {errors.login && (
                            <div className="alert alert-danger">
                                {errors.login}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="form-group mb-3">
                                <label className="mb-1 fw-bold">Email address</label>
                                <input 
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`form-control ${
                                        errors.validation.find(e => e.path === 'email') ? 'is-invalid' : ''
                                    }`}
                                    placeholder="Email Address"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="mb-1 fw-bold">Password</label>
                                <input 
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`form-control ${
                                        errors.validation.find(e => e.path === 'password') ? 'is-invalid' : ''
                                    }`}
                                    placeholder="Password"
                                    disabled={isLoading}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary w-100"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'LOGIN'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}