import React, { useEffect, useState } from "react";
import { ReportService } from "@services";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "@styles/components/CancellationRateReport.css";

const CancellationRateReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [filters, setFilters] = useState({
    period: '3months',
    doctor_id: '',
    specialty_id: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    fetchDoctorsAndSpecialties();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchDoctorsAndSpecialties = async () => {
    try {
      const doctorsRes = await fetch('/api/doctors', { credentials: 'include' });
      const specialtiesRes = await fetch('/api/specialties', { credentials: 'include' });
      
      if (doctorsRes.ok) {
        const doctorsData = await doctorsRes.json();
        setDoctors(doctorsData);
      }
      
      if (specialtiesRes.ok) {
        const specialtiesData = await specialtiesRes.json();
        setSpecialties(specialtiesData);
      }
    } catch (err) {
      console.error("Error fetching doctors/specialties:", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.period) queryParams.append('period', filters.period);
      if (filters.doctor_id) queryParams.append('doctor_id', filters.doctor_id);
      if (filters.specialty_id) queryParams.append('specialty_id', filters.specialty_id);
      
      const response = await fetch(`/api/admin-reports/cancellation-rate?${queryParams}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (err) {
      console.error("Error fetching cancellation rate:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await ReportService.saveReport({
        report_type: "cancellation_rate",
        content: reportData
      });      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Eroare la salvarea raportului.");
    }
  };

  const handleDownloadPDF = async () => {
    const reportElement = document.querySelector(".report-box");
    if (!reportElement) return;
  
    const canvas = await html2canvas(reportElement);
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("raport-anulari.pdf");
  };

  if (loading) {
    return (
      <div className="report-box">
        <p>Se încarcă...</p>
      </div>
    );
  }

  return (
    <div className="report-box">
      <h3>Rata de anulare a programărilor</h3>
      
      <div className="filters-section">
        <div className="filter-group">
          <label>Perioada:</label>
          <select 
            value={filters.period} 
            onChange={(e) => handleFilterChange('period', e.target.value)}
          >
            <option value="1month">Ultima lună</option>
            <option value="3months">Ultimele 3 luni</option>
            <option value="6months">Ultimele 6 luni</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Doctor:</label>
          <select 
            value={filters.doctor_id} 
            onChange={(e) => handleFilterChange('doctor_id', e.target.value)}
          >
            <option value="">Toți doctorii</option>
            {doctors.map(doctor => (
              <option key={doctor.user_id} value={doctor.user_id}>
                {doctor.first_name} {doctor.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Specializare:</label>
          <select 
            value={filters.specialty_id} 
            onChange={(e) => handleFilterChange('specialty_id', e.target.value)}
          >
            <option value="">Toate specializările</option>
            {specialties.map(specialty => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {reportData && (
        <div className="report-content">
          <div className="overview-section">
            <h4>Sumar general</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total programări:</span>
                <span className="stat-value">{reportData.overview.totalAppointments}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Anulate:</span>
                <span className="stat-value">{reportData.overview.canceledAppointments}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">No-show:</span>
                <span className="stat-value">{reportData.overview.noShowAppointments}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Finalizate:</span>
                <span className="stat-value">{reportData.overview.completedAppointments}</span>
              </div>
            </div>
            
            <div className="rates-grid">
              <div className="rate-item">
                <span className="rate-label">Rata anulare:</span>
                <span className="rate-value">{reportData.overview.cancellationRate}%</span>
              </div>
              <div className="rate-item">
                <span className="rate-label">Rata no-show:</span>
                <span className="rate-value">{reportData.overview.noShowRate}%</span>
              </div>
              <div className="rate-item">
                <span className="rate-label">Rata finalizare:</span>
                <span className="rate-value">{reportData.overview.completionRate}%</span>
              </div>
            </div>
          </div>

          {reportData.trends.monthly.length > 0 && (
            <div className="trends-section">
              <h4>Evoluție lunară</h4>
              <div className="trends-table">
                <table>
                  <thead>
                    <tr>
                      <th>Luna</th>
                      <th>Total</th>
                      <th>Anulate</th>
                      <th>No-show</th>
                      <th>Rata anulare</th>
                      <th>Rata no-show</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.trends.monthly.map(month => (
                      <tr key={month.month}>
                        <td>{month.month}</td>
                        <td>{month.total}</td>
                        <td>{month.cancelled}</td>
                        <td>{month.no_show}</td>
                        <td>{month.cancellation_rate}%</td>
                        <td>{month.no_show_rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportData.breakdowns.byDoctor.length > 0 && (
            <div className="breakdown-section">
              <h4>Detalii pe doctor</h4>
              <div className="breakdown-table">
                <table>
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Specializare</th>
                      <th>Total programări</th>
                      <th>Anulate</th>
                      <th>Rata anulare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.breakdowns.byDoctor.map(doctor => (
                      <tr key={doctor.doctor_id}>
                        <td>{doctor.doctor_name}</td>
                        <td>{doctor.specialty}</td>
                        <td>{doctor.total_appointments}</td>
                        <td>{doctor.cancelled_appointments}</td>
                        <td>{doctor.cancellation_rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportData.breakdowns.bySpecialty.length > 0 && (
            <div className="breakdown-section">
              <h4>Detalii pe specializare</h4>
              <div className="breakdown-table">
                <table>
                  <thead>
                    <tr>
                      <th>Specializare</th>
                      <th>Total programări</th>
                      <th>Anulate</th>
                      <th>Rata anulare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.breakdowns.bySpecialty.map(specialty => (
                      <tr key={specialty.specialty_id}>
                        <td>{specialty.specialty_name}</td>
                        <td>{specialty.total_appointments}</td>
                        <td>{specialty.cancelled_appointments}</td>
                        <td>{specialty.cancellation_rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="actions">
        <button onClick={handleSave}>Salvează raportul</button>
        <button onClick={handleDownloadPDF}>Descarcă PDF</button>
        {saved && <p className="success-msg">Raport salvat cu succes!</p>}
      </div>
    </div>
  );
};

export default CancellationRateReport;