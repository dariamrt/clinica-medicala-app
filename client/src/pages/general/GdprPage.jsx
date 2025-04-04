import React from "react";
import { RoleBasedNavbar } from "@components";
import "@styles/pages/GDPRPage.css";

const GDPRPage = () => {
  return (
    <>
      <RoleBasedNavbar />
      <div className="gdpr-page">
        <h1>Politica de Confidențialitate – Protecția Datelor (GDPR)</h1>

        <section>
          <h2>1. Datele pe care le colectăm</h2>
          <p>
            Nume, prenume, adresă de e-mail, număr de telefon, CNP, informații
            medicale (diagnostice, rețete), date tehnice precum IP, device info.
          </p>
        </section>

        <section>
          <h2>2. Scopul colectării datelor</h2>
          <ul>
            <li>Crearea și gestionarea conturilor</li>
            <li>Programări și consultații medicale</li>
            <li>Emiterea fișelor și rețetelor</li>
            <li>Comunicări administrative</li>
            <li>Respectarea obligațiilor legale</li>
          </ul>
        </section>

        <section>
          <h2>3. Temeiul legal al prelucrării</h2>
          <p>
            Consimțământul tău, executarea contractului, obligații legale sau
            interes legitim.
          </p>
        </section>

        <section>
          <h2>4. Durata stocării datelor</h2>
          <p>
            Datele se păstrează cât timp ești utilizator, respectiv conform
            legii (ex: 5-10 ani pentru fișele medicale), apoi se șterg
            definitiv.
          </p>
        </section>

        <section>
          <h2>5. Cui transmitem datele</h2>
          <p>
            Medici autorizați, autorități legale, furnizori IT – exclusiv în
            scopul funcționării aplicației.
          </p>
        </section>

        <section>
          <h2>6. Securitatea datelor</h2>
          <ul>
            <li>Conexiuni criptate (HTTPS)</li>
            <li>Autentificare și acces controlat</li>
            <li>Backup-uri regulate</li>
          </ul>
        </section>

        <section>
          <h2>7. Drepturile tale</h2>
          <ul>
            <li>Acces, rectificare, ștergere</li>
            <li>Restricționare și opoziție</li>
            <li>Portabilitatea datelor</li>
            <li>Plângere la ANSPDCP: www.dataprotection.ro</li>
          </ul>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            Ne poți contacta la: <br />
            <strong>Email:</strong> contact@clinica.ro <br />
            <strong>Telefon:</strong> +40 123 456 789
          </p>
        </section>

        <p className="last-updated">Ultima actualizare: aprilie 2025</p>
      </div>
    </>
  );
};

export default GDPRPage;
