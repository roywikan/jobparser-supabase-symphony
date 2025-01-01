import React from "react";

const Footer = () => {
  return (
    <footer className="mt-8 py-6 border-t border-gray-200">
      <div className="container text-center text-sm text-gray-600">
        <p className="mb-2">
          Created by{" "}
          <a href="https://job.web.id" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Andreas Wikan
          </a>
          {", "}
          <a href="https://lovable.dev" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Lovable
          </a>
          {", "}
          <a href="https://supabase.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Supabase
          </a>
          {" and "}
          <a href="https://netlify.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Netlify
          </a>
        </p>
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;