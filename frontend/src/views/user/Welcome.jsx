import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'

const Welcome = () => {
    const [user, setUser] = useState([])
    useEffect(() => {
      const userData = Cookies.get("user");

      if (userData) {
        setUser(JSON.parse(userData));
      }

    }, [])

  return (
    <div className="col-md-9">
        <div className="card border-0 rounded shadow-sm">
            <div className="card-header">
                DASHBOARD
            </div>
            <div className="card-body">
                Selamat Datang, <strong>{user?.name}</strong>
            </div>
        </div>
    </div>
  )
}

export default Welcome 