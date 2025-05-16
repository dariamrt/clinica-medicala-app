import { Link } from "react-router-dom";
import "@styles/pages/TermsPage.css";

const TermsAndConditions = () => {
  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <div className="terms-card">
          <h1>Termeni și Condiții – MedAria</h1>

          <p>
            Vă mulțumim că ați ales clinica MedAria. Vă rugăm să citiți cu atenție termenii și condițiile de mai jos, care guvernează utilizarea serviciilor noastre.
          </p>

          <h2>1. Protecția datelor personale</h2>
          <p>
            În conformitate cu Regulamentul General privind Protecția Datelor (GDPR – UE 2016/679), MedAria colectează și prelucrează datele dumneavoastră personale exclusiv în scopuri medicale și administrative.
          </p>

          <h2>2. Datele pe care le colectăm</h2>
          <p>
            MedAria colectează următoarele date:
          </p>
          <ul>
            <li>Nume și prenume</li>
            <li>Adresă de e-mail și număr de telefon</li>
            <li>Date medicale relevante pentru consultații</li>
          </ul>

          <h2>3. Scopul utilizării datelor</h2>
          <ul>
            <li>Gestionarea contului dumneavoastră în platformă</li>
            <li>Programarea consultațiilor medicale</li>
            <li>Comunicări privind statusul programărilor</li>
            <li>Îmbunătățirea calității serviciilor oferite</li>
          </ul>

          <h2>4. Drepturile dumneavoastră</h2>
          <p>În conformitate cu legislația în vigoare, aveți dreptul de:</p>
          <ul>
            <li>Acces la datele personale</li>
            <li>Rectificare a datelor incorecte</li>
            <li>Ștergere a datelor („dreptul de a fi uitat”)</li>
            <li>Restricționare a prelucrării</li>
            <li>Opoziție față de prelucrarea în scop de marketing</li>
            <li>Portabilitatea datelor</li>
          </ul>

          <h2>5. Securitatea datelor</h2>
          <p>
            MedAria aplică măsuri tehnice și organizatorice pentru a asigura protecția datelor împotriva accesului neautorizat sau pierderii accidentale.
          </p>

          <h2>6. Contact</h2>
          <p>
            Pentru întrebări legate de protecția datelor, ne puteți contacta la <strong>protectie@medaria.ro</strong>.
          </p>

          <div className="back-link">
            <Link to="/">Înapoi la pagina principală</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
