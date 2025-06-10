import React from "react";
import { Navbar } from "../../ui/Navbar";
import { Footer } from "../LayoutHomePage/Footer";

export const LayoutAccount = ({ children }) => {
  return (
    <div className="wrap">
      <header className="py-2 lg:py-3 sticky top-0 z-10 bg-white shadow-lg">
        <Navbar />
      </header>
      <main>{children}</main>
      <footer className="bg-gray-100 text-gray-700 text-sm">
        <Footer />
      </footer>
    </div>
  );
};
