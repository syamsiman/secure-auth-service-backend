//import Link from react router dom
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Cookies from 'js-cookie'

export default function SidebarMenu() {

    const Navigate = useNavigate();

    const { setIsAuthenticated } = useContext(AuthContext)

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("user");

        setIsAuthenticated(false)

        Navigate("/login", { replace: true })
    }


    return (
        <div className="card border-0 rounded shadow-sm">
            <div className="card-header">
                MAIN MENU
            </div>
            <div className="card-body">
                <div className="list-group">
                    <Link to="/dashboard" className="list-group-item list-group-item-action">Dashboard</Link>

                    <Link to="/dashboard/users" className="list-group-item list-group-item-action">Users</Link>
                    <a onClick={logout} className="list-group-item list-group-item-action" style={{ cursor: 'pointer' }}>Logout</a>
                </div>
            </div>
        </div>
    )
}