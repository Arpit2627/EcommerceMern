import React from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="row contactus m-5 p-5 h-100">
  <div className="col-md-6 text-center">
    <img
      src="/images/contact.jpg"
      alt="contactus"
      className="img-fluid"
    />
  </div>
  <div className="col-md-6 col-lg-4 mt-3">
    <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
    <p className="text-justify mt-2">
      Any query and info about the product, feel free to call anytime. We are available 24X7.
    </p>
    <p className="mt-3">
      <BiMailSend /> : manasvitech01@gmail.com
    </p>
    <p className="mt-3">
      <BiPhoneCall /> :
(+91) 8319955741
    </p>
    <a className="mt-3" href="manasvitech.in" style={{textDecoration: 'none', color:'black'}}>
      <BiSupport /> : 
      manasvitech.in 
    </a>
  </div>
</div>
    </Layout>
  );
};

export default Contact;
