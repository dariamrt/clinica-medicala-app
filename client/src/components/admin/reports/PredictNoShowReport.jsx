import React, { useState, useEffect } from "react";
import { ReportService, PatientService } from "@services";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PredictNoShowReport = () => {
  const [formData, setFormData] = useState({
    mode: "manual", // "manual" sau "automat"
    age: "",
    gender: "female",
    date: "",
    start_time: "08:00", 
    patient_id: "",
    appointment_id: ""
  });
  
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (formData.patient_id && formData.mode === "patient") {
      loadPatientAppointments(formData.patient_id);
    }
  }, [formData.patient_id, formData.mode]);

  const loadPatients = async () => {
      setLoadingPatients(true);
      try {
          const patientsData = await PatientService.getAllPatients();
          setPatients(patientsData);
      } catch (error) {
          console.error("Eroare la încărcarea pacienților:", error);
          alert("Eroare la încărcarea pacienților.");
      } finally {
          setLoadingPatients(false);
      }
  };

  const loadPatientAppointments = async (patientId) => {
    setLoadingAppointments(true);
    try {
        const appointmentsData = await PatientService.getPatientAppointments(patientId);

        const futureAppointments = appointmentsData.filter(app =>
            app.status !== 'cancelled' && new Date(app.date) >= new Date()
        );
        setAppointments(futureAppointments);
    } catch (error) {
        console.error("Eroare la incarcarea programarilor:", error);
        setAppointments([]);
    } finally {
        setLoadingAppointments(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "mode") {
      setFormData({
        mode: value,
        age: "",
        gender: "female",
        date: "",
        start_time: "08:00", 
        patient_id: "",
        appointment_id: ""
      });
      setSelectedPatient(null);
      setAppointments([]);
      setPrediction(null);
    } else if (name === "patient_id") {
      const patient = patients.find(p => p.user_id === value);
      setSelectedPatient(patient);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        appointment_id: "" 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      let result;
      
      if (formData.mode === "manual") {
        if (!formData.age || !formData.gender || !formData.date || !formData.start_time) {
          alert("Vă rugăm să completați toate câmpurile pentru predicția manuală.");
          return;
        }
        
        result = await ReportService.predictAppointmentNoShow({
          age: formData.age,
          gender: formData.gender,
          date: formData.date,
          start_time: formData.start_time 
        });
      } else {
        if (!formData.patient_id || !formData.appointment_id) {
          alert("Vă rugăm să selectați un pacient și o programare.");
          return;
        }
        
        const selectedAppointment = appointments.find(app => app.id === formData.appointment_id);
        if (!selectedAppointment) {
          alert("Programarea selectată nu este validă.");
          return;
        }
        
        result = await ReportService.predictAppointmentNoShowByPatient({
          patient_id: formData.patient_id,
          date: selectedAppointment.date,
          start_time: selectedAppointment.start_time
        });
      }
      
      setPrediction({ 
        probability: result.risk,
        mode: formData.mode,
        patientInfo: selectedPatient,
        appointmentInfo: formData.mode === "patient" ? 
          appointments.find(app => app.id === formData.appointment_id) : null,
        manualInfo: formData.mode === "manual" ? {
          age: formData.age,
          gender: formData.gender,
          date: formData.date,
          start_time: formData.start_time
        } : null
      });
    } catch (err) {
      console.error("Eroare la prezicerea programării:", err);
      alert("Eroare la prezicerea programării.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await ReportService.saveReport({
        report_type: "predict_no_show",
        content: { 
          input: formData, 
          prediction,
          patient_info: selectedPatient,
          appointment_info: formData.mode === "patient" ? 
            appointments.find(app => app.id === formData.appointment_id) : null
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Eroare la salvarea raportului.");
    }
  };

  const handleDownloadPDF = async () => {
    const reportElement = document.querySelector(".report-box") || document.querySelector(".report-modal-content");
    if (!reportElement) return;
  
    const canvas = await html2canvas(reportElement);
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("raport-no-show.pdf");
  };

  const formatAppointmentDisplay = (appointment) => {
    const date = new Date(appointment.date).toLocaleDateString('ro-RO');
    const doctorName = appointment.Doctors_Datum ? 
      `${appointment.Doctors_Datum.first_name} ${appointment.Doctors_Datum.last_name}` : 
      'Doctor necunoscut';
    return `${date} ${appointment.start_time} - ${doctorName}`;
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };
  
  return (
    <div className="report-box">
      <h3>Prezicere neprezentare programare</h3>
      
      <div className="form-group">
        <label>Mod predicție</label>
        <select name="mode" value={formData.mode} onChange={handleChange}>
          <option value="manual">Introducere manuală</option>
          <option value="patient">Selectare pacient</option>
        </select>
      </div>

      {formData.mode === "manual" ? (
        <>
          <div className="form-group">
            <label>Vârstă</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Ex: 35"
              min="1"
              max="120"
              required
            />
          </div>

          <div className="form-group">
            <label>Gen</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="female">Femeie</option>
              <option value="male">Bărbat</option>
            </select>
          </div>

          <div className="form-group">
            <label>Dată programare</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]} 
              required
            />
          </div>

          <div className="form-group">
            <label>Ora programării</label>
            <select name="start_time" value={formData.start_time} onChange={handleChange} required>
              {generateTimeOptions().map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label>Selectați pacientul</label>
            {loadingPatients ? (
              <p>Se încarcă pacienții...</p>
            ) : (
              <select 
                name="patient_id" 
                value={formData.patient_id} 
                onChange={handleChange}
                required
              >
                <option value="">-- Selectați un pacient --</option>
                {patients.map(patient => (
                  <option key={patient.user_id} value={patient.user_id}>
                    {patient.first_name} {patient.last_name} - {patient.CNP}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedPatient && (
            <div className="patient-info">
              <h4>Informații pacient</h4>
              <p><strong>Nume:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
              <p><strong>Gen:</strong> {selectedPatient.gender === 'male' ? 'Bărbat' : 'Femeie'}</p>
              <p><strong>Telefon:</strong> {selectedPatient.phone_number}</p>
              <p><strong>Email:</strong> {selectedPatient.email}</p>
            </div>
          )}

          {formData.patient_id && (
            <div className="form-group">
              <label>Selectați programarea</label>
              {loadingAppointments ? (
                <p>Se încarcă programările...</p>
              ) : appointments.length > 0 ? (
                <select 
                  name="appointment_id" 
                  value={formData.appointment_id} 
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Selectați o programare --</option>
                  {appointments.map(appointment => (
                    <option key={appointment.id} value={appointment.id}>
                      {formatAppointmentDisplay(appointment)}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Nu există programări viitoare pentru acest pacient.</p>
              )}
            </div>
          )}
        </>
      )}

      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Se prelucrează..." : "Prezice"}
      </button>

      {prediction && (
        <div className="prediction-results">
          <p className="result-msg">
            Probabilitatea neprezentării: <strong>{prediction.probability}</strong>
          </p>
          
          {prediction.mode === "manual" && prediction.manualInfo && (
            <div className="prediction-details">
              <h4>Detalii predicție</h4>
              <p><strong>Vârstă:</strong> {prediction.manualInfo.age} ani</p>
              <p><strong>Gen:</strong> {prediction.manualInfo.gender === 'male' ? 'Bărbat' : 'Femeie'}</p>
              <p><strong>Dată:</strong> {new Date(prediction.manualInfo.date).toLocaleDateString('ro-RO')}</p>
              <p><strong>Ora:</strong> {prediction.manualInfo.start_time}</p>
            </div>
          )}
          
          {prediction.mode === "patient" && prediction.patientInfo && (
            <div className="prediction-details">
              <h4>Detalii predicție</h4>
              <p><strong>Pacient:</strong> {prediction.patientInfo.first_name} {prediction.patientInfo.last_name}</p>
              {prediction.appointmentInfo && (
                <p><strong>Programare:</strong> {formatAppointmentDisplay(prediction.appointmentInfo)}</p>
              )}
            </div>
          )}
          
          <div className="action-buttons">
            <button onClick={handleSave}>Salvează raportul</button>
            <button onClick={handleDownloadPDF}>Descarcă PDF</button>
          </div>
          
          {saved && <p className="success-msg">Raport salvat cu succes!</p>}
        </div>
      )}
    </div>
  );
};

export default PredictNoShowReport;