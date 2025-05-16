import React from "react";
import { Link } from "react-router-dom";
import "../../styles/layout/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/contact">Contact</Link>
        <Link to="/terms">Termeni și Condiții</Link>
        <Link to="/gdpr">GDPR</Link>
        <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer">ANPC</a>
      </div>
      <div className="footer-credits">
        <p>© Clinica MedAria SA </p>
        <p>Dezvoltat de Daria Mireștean</p>
      </div>
    </footer>
  );
};

export default Footer;
