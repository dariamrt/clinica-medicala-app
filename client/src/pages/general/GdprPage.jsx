import { Link } from "react-router-dom";
import "@styles/pages/TermsPage.css";

const GDPRPage = () => {
  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <div className="terms-card">
          <h1>Politica de Confidențialitate – MedAria</h1>

          <p>
            Protejarea datelor personale este o prioritate pentru MedAria. Această politică descrie modul în care colectăm, utilizăm și protejăm informațiile personale ale utilizatorilor.
          </p>

          <h2>1. Ce date colectăm?</h2>
          <ul>
            <li>Nume și prenume</li>
            <li>Adresă de e-mail și număr de telefon</li>
            <li>CNP și alte informații identificabile</li>
            <li>Date medicale (diagnostice, prescripții)</li>
            <li>Date tehnice (adresă IP, tip dispozitiv)</li>
          </ul>

          <h2>2. Scopul prelucrării</h2>
          <ul>
            <li>Crearea și gestionarea conturilor</li>
            <li>Programări, consultații și emiterea documentelor medicale</li>
            <li>Comunicări administrative și notificări</li>
            <li>Respectarea obligațiilor legale</li>
          </ul>

          <h2>3. Temeiul legal</h2>
          <p>
            Datele sunt prelucrate în baza consimțământului, a obligațiilor legale, a contractului cu pacientul sau a interesului legitim al clinicii.
          </p>

          <h2>4. Durata stocării</h2>
          <p>
            Datele sunt păstrate pe durata relației contractuale și conform obligațiilor legale (ex. 5-10 ani pentru documentele medicale).
          </p>

          <h2>5. Destinatarii datelor</h2>
          <p>
            Informațiile pot fi partajate cu medici autorizați, furnizori de servicii IT și autorități publice, exclusiv în scopuri legitime.
          </p>

          <h2>6. Măsuri de securitate</h2>
          <ul>
            <li>Criptarea datelor și conexiunilor</li>
            <li>Control strict al accesului</li>
            <li>Backup-uri periodice</li>
          </ul>

          <h2>7. Drepturile dumneavoastră</h2>
          <ul>
            <li>Dreptul de acces, rectificare și ștergere</li>
            <li>Dreptul de opoziție și restricționare</li>
            <li>Dreptul la portabilitate</li>
            <li>Dreptul de a depune plângere la ANSPDCP: www.dataprotection.ro</li>
          </ul>

          <h2>8. Contact</h2>
          <p>
            Pentru solicitări legate de datele personale, ne puteți contacta la:<br />
            <strong>Email:</strong> protectie@medaria.ro<br />
            <strong>Telefon:</strong> +40 123 456 789
          </p>

          <div className="back-link">
            <Link to="/">Înapoi la pagina principală</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRPage;
