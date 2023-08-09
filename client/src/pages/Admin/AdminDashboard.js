import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard">
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card p-3 h-100">
            <AdminMenu />
          </div>
        </div>
        <div className="col-md-9">
          <div className="card p-3 h-100">
            <h5>
              <span style={{ fontWeight: 'bold' }}>Admin Name</span>: {auth?.user?.name}
            </h5>
            <hr />
            <h5>
              <span style={{ fontWeight: 'bold' }}>Admin Email</span>: {auth?.user?.email}
            </h5>
            <hr />
            <h5>
              <span style={{ fontWeight: 'bold' }}>Admin Contact</span>: {auth?.user?.phone}
            </h5>
            <hr />
            <h5>
              <span style={{ fontWeight: 'bold' }}>Admin Address</span>: {auth?.user?.address}
            </h5>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default AdminDashboard;
