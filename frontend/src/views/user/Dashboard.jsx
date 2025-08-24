//import SidebarMenu
import SidebarMenu from '../../components/SidebarMenu';
import { Outlet } from 'react-router';

export default function Dashboard() {
    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                <div className="col-md-3">
                    <SidebarMenu />
                </div>
                <Outlet />
            </div>
        </div>
    )
}