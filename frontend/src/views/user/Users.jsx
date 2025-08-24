import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import Api from '../../services/api'

const Users = () => {

  const [users, setUsers] = useState([])

  const fetchDataUsers = async () => {
    const token = Cookies.get("token");

    if (token) {
      Api.defaults.headers.common["Authorization"] = token

        try {
          const response = await Api.get("/api/users");
          console.log(response);
          setUsers(response.data.data)

        } catch (error) {
          console.error(error)
        }
    } else {
      console.error('token is not avaiable')
    }
  }

  useEffect(() => {
    fetchDataUsers()
  }, [])

  return (
    <div className="col-md-9">
      <div className="card border-0 rounded shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
              <span>USERS</span>
              <Link to="/dashboard/users/create" className="btn btn-sm btn-success rounded shadow-sm border-0">ADD USER</Link>
          </div>
          <div className="card-body">
              <table className="table table-bordered">
                  <thead className="bg-dark text-white">
                      <tr>
                          <th scope="col">Full Name</th>
                          <th scope="col">Email Address</th>
                          <th scope="col" style={{ width: "17%" }}>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          users.length > 0
                              ? users.map((user, index) => (
                                  <tr key={index}>
                                      <td>{user.name}</td>
                                      <td>{user.email}</td>
                                      <td className="text-center">
                                          <Link to={`/dashboard/users/edit/${user.id}`} className="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">EDIT</Link>
                                          <button className="btn btn-sm btn-danger rounded-sm shadow border-0">DELETE</button>
                                      </td>
                                  </tr>
                              ))

                              : <tr>
                                  <td colSpan="4" className="text-center">
                                      <div className="alert alert-danger mb-0">
                                          Data Belum Tersedia!
                                      </div>
                                  </td>
                              </tr>
                      }
                  </tbody>
              </table>
          </div>
      </div>
  </div> 
)
}

export default Users