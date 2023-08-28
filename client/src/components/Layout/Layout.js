import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "react-hot-toast";

const Layout = ({ children, title, description, keywords, author }) => {
  useEffect(() => {
    // Update meta tags and title
    const updateMetaAndTitle = () => {
      const metaCharset = document.querySelector('meta[charset]');
      if (metaCharset) {
        metaCharset.setAttribute('charset', 'utf-8');
      }

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }

      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }

      const metaAuthor = document.querySelector('meta[name="author"]');
      if (metaAuthor) {
        metaAuthor.setAttribute('content', author);
      }

      document.title = title;
    };

    updateMetaAndTitle();
  }, [title, description, keywords, author]);

  return (
    <div>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Ecommerce app - shop now",
  description: "mern stack project",
  keywords: "mern,react,node,mongodb",
  author: "manasvi technologies opc pvt ltd",
};

export default Layout;
