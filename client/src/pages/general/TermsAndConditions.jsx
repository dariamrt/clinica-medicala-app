import React from "react";
import { Link } from "react-router-dom";
import "@styles/pages/TermsPage.css";

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <div className="terms-card">
        <h1>Termeni și Condiții</h1>
        <p>
          Bine ați venit la clinica noastră! Vă rugăm să citiți cu atenție acești termeni și condiții înainte de a utiliza serviciile noastre.
        </p>

        <h2>1. Protecția datelor personale (GDPR)</h2>
        <p>
          Conform Regulamentului General privind Protecția Datelor (GDPR) - UE 2016/679, clinică noastră colectează și prelucrează datele cu caracter personal în scopul furnizării serviciilor medicale, gestionării programărilor și asigurării unei experiențe sigure pacienților noștri.
        </p>

        <h2>2. Ce date colectăm?</h2>
        <p>
          Colectăm date precum: numele, prenumele, adresa de email, numărul de telefon, date medicale relevante pentru consultațiile efectuate.
        </p>

        <h2>3. Cum utilizăm aceste date?</h2>
        <ul>
          <li>Pentru a vă crea și gestiona contul;</li>
          <li>Pentru programarea consultațiilor medicale;</li>
          <li>Pentru comunicări legate de programările dumneavoastră;</li>
          <li>Pentru îmbunătățirea serviciilor oferite.</li>
        </ul>

        <h2>4. Drepturile utilizatorului</h2>
        <p>
          Conform GDPR, aveți următoarele drepturi:
        </p>
        <ul>
          <li>Dreptul de acces la datele personale;</li>
          <li>Dreptul de rectificare a datelor incorecte;</li>
          <li>Dreptul de ștergere a datelor ("dreptul de a fi uitat");</li>
          <li>Dreptul de restricționare a prelucrării;</li>
          <li>Dreptul de a vă opune prelucrării datelor în scopuri de marketing direct;</li>
          <li>Dreptul la portabilitatea datelor.</li>
        </ul>

        <h2>5. Cum protejăm datele?</h2>
        <p>
          Clinică noastră implementează măsuri de securitate avansate pentru protecția datelor personale împotriva accesului neautorizat, utilizării abuzive sau divulgării acestora.
        </p>

        <h2>6. Contact</h2>
        <p>
          Pentru orice întrebări sau solicitări privind protecția datelor, ne puteți contacta la <strong>email@clinica.ro</strong>.
        </p>

        <p className="back-link">
          <Link to="/">Înapoi la pagina principală</Link>
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
