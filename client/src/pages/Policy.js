import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    
    <Layout title={"Privacy Policy"}>
      <div className="row contactus m-5 p-5 h-100">
        <div className="col-md-6 text-center">
          <img
            src="/images/privacy.jfif"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4 text-center">
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe deleniti repudiandae, ad tempora quod quam animi blanditiis cumque odio in excepturi laborum fuga quia voluptas accusamus omnis! Itaque, magni vero.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
