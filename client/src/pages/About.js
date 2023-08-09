import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Ecommer app"}>
      <div className="row contactus">
  <div className="col-md-6">
    <img
      src="/images/about.jpg"
      alt="contactus"
      className="img-fluid"
    />
  </div>
  <div className="col-md-6 col-lg-4 mt-3">
    <p className="text-justify">
    Manasvi Technologies (OPC) Pvt. Ltd. is an IT Company situated at Bhopal,Madhya Pradesh (India). Our professionals design element that complements the content, an interactive, user- friendly interface with integrated application features controlled with a technical foundation at the backend, to give the visitor a sense of a personal touch.

Great website designing is actually about creating a website that aligns with an overarching strategy.Well-designed websites offer much more than just esthetics. They attract visitors and help people understand your product, company, and brand.

We have always been open to newest technologies, and have worked on future technologies at a time when people were sceptical about it. We are learners and hence, we never cease to educate ourselves on anything new and different that comes up in this industry. And this eagerness to stay ahead of the game is what has set us apart.
    </p>
  </div>
</div>

    </Layout>
  );
};

export default About;
