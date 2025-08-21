import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../services/api'

export default function Register() {
    const navigate = useNavigate(); // Changed to lowercase as per convention

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validation, setValidation] = useState({ errors: [] });

    const register = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/api/auth/register', {
                name,
                email,
                password,
            });

            if (response.data.success) {
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 422) {
                setValidation({
                    errors: error.response.data.error || []
                });
            }
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-5">
                <div className="card border-0 rounded shadow-sm">
                    <div className="card-body">
                        <h4>REGISTER</h4>
                        <hr />
                        {validation.errors.length > 0 && (
                            <div className="alert alert-danger">
                                {validation.errors.map((error, index) => (
                                    <p key={index} className="mb-0">
                                        {`${error.path}: ${error.msg}`}
                                    </p>
                                ))}
                            </div>
                        )}
                        <form onSubmit={register}>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Full Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Email address</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                REGISTER
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}