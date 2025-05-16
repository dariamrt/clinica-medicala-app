import React from "react";
import PatientNavbar from "@components/patient/PatientNavbar";
import FaqItem from "@components/common/FaqItem";
import "@styles/pages/ContactPage.css";

const faqData = [
  {
    category: "Programări",
    questions: [
      { q: "Cum îmi fac o programare?", a: "Poți crea o programare direct din dashboardul tău sau de pe pagina principală." },
      { q: "Pot anula o programare?", a: "Da, din secțiunea Programările mele, poți anula o programare cu minim 24h înainte." },
      { q: "Pot modifica data programării?", a: "Da, dar este recomandat să iei legătura cu clinica înainte." },
    ],
  },
  {
    category: "Consultații",
    questions: [
      { q: "Cât durează o consultație?", a: "O consultație durează în medie 30 de minute, în funcție de specializare." },
      { q: "Este necesară trimitere de la medicul de familie?", a: "Pentru decontări prin CAS este necesară o trimitere." },
    ],
  },
  {
    category: "Plăți și Decontări",
    questions: [
      { q: "Pot deconta serviciile prin CAS?", a: "Da, anumite servicii sunt eligibile pentru decontare. Consultă lista pe site." },
      { q: "Care sunt metodele de plată acceptate?", a: "Acceptăm numerar și card bancar la recepție, înainte de programare, dar colaborăm și cu Casa de Asigurări. " },
    ],
  },
];

const ContactPage = () => {
  return (
    <>
      <div className="contact-page">
        <div className="contact-content">
          <div className="contact-details-card">
            <h2>Contact</h2>
            <p><strong>Email:</strong> contact@medaria.ro</p>
            <p><strong>Telefon:</strong> 0740 123 456</p>
            <p><strong>Adresă:</strong> Șoseaua Pavel D. Kiseleff 2, București</p>
            <iframe
              src="https://maps.google.com/maps?q=Șoseaua%20Pavel%20D.%20Kiseleff%202%2C%20București&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              allowFullScreen
              title="Locație clinică"
            />

          </div>

          <div className="faq-section">
            <h2 className="faq-title">Întrebări frecvente</h2>
            {faqData.map((section, index) => (
              <div key={index} className="faq-category">
                <h3>{section.category}</h3>
                {section.questions.map((item, idx) => (
                  <FaqItem key={idx} question={item.q} answer={item.a} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
