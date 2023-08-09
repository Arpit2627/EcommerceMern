import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
<div className="footer bg-dark text-white p-4">
    <h1 className="text-center mb-3">
      All Rights Reserved &copy; Manasvi Technologies (OPC) Pvt. Ltd.
    </h1>
    <p className="text-center mb-3">
      Developed and Maintained by Manasvi Technologies (OPC) Pvt. Ltd.
    </p>
    <div className="text-center">
      <Link to="/about" className="text-white text-decoration-none me-3">About</Link>
      <Link to="/contact" className="text-white text-decoration-none me-3">Contact</Link>
      <Link to="/policy" className="text-white text-decoration-none">Privacy Policy</Link>
    </div>
  </div>
  );
};

export default Footer;
