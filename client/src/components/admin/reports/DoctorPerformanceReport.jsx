import { useEffect, useState } from "react";
import { ReportService } from "@services";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "@styles/components/ReportCard.css";
import "@styles/components/DoctorPerformanceReports.css";

const DoctorPerformanceReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [period, setPeriod] = useState('3months');
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const result = await ReportService.getDoctorPerformanceReport();
        setReportData(result.doctorPerformanceReport || []);
        setTotalDoctors(result.totalDoctors || 0);
        setAverageScore(result.averageScore || 0);
      } catch (err) {
        console.error("Eroare la obtinerea performantei doctorilor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  const handleSave = async () => {
    try {
      await ReportService.saveReport({
        report_type: "doctor_performance",
        content: { 
          performance: reportData,
          totalDoctors,
          averageScore,
          period
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
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
    pdf.save("raport-performanta-doctori.pdf");
  };

  const getPerformanceTierColor = (tier) => {
    const colors = {
      'Excelent': '#4CAF50',
      'Bun': '#8BC34A', 
      'Mediu': '#FF9800',
      'Sub medie': '#FF5722',
      'Necesita imbunatatire': '#F44336'
    };
    return colors[tier] || '#9E9E9E';
  };

  useEffect(() => {
    const setBadgeColors = () => {
      const badges = document.querySelectorAll('.performance-tier-badge');
      badges.forEach(badge => {
        const tier = badge.textContent.trim();
        const color = getPerformanceTierColor(tier);
        badge.style.backgroundColor = color;
        badge.style.color = 'white';
      });
    };

    if (reportData.length > 0) {
      setTimeout(setBadgeColors, 0);
    }
  }, [reportData]);

  return (
    <div className="report-box">
      <h3>Performanța doctorilor</h3>
      
      {loading ? (
        <p>Se încarcă...</p>
      ) : reportData.length === 0 ? (
        <p>Nu există date disponibile.</p>
      ) : (
        <>
          <div className="report-summary">
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total doctori:</span>
                <span className="stat-value">{totalDoctors}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Scor mediu:</span>
                <span className="stat-value">{averageScore}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Perioada:</span>
                <span className="stat-value">{period === '3months' ? 'Ultimele 3 luni' : period}</span>
              </div>
            </div>
          </div>

          <div className="scroll-table-wrapper">
            <table className="report-table styled-table">
              <thead>
                <tr>
                  <th>Rang</th>
                  <th>Doctor</th>
                  <th>Specialitate</th>
                  <th>Total programări</th>
                  <th>Completate</th>
                  <th>Anulate</th>
                  <th>Rată completare</th>
                  <th>Rată utilizare</th>
                  <th>Scor performanță</th>
                  <th>Nivel</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((doc, idx) => (
                  <tr key={idx}>
                    <td>#{doc.ranking}</td>
                    <td>{doc.first_name} {doc.last_name}</td>
                    <td>{doc.specialty?.name || 'N/A'}</td>
                    <td>{doc.total_appointments}</td>
                    <td>{doc.completed_appointments}</td>
                    <td>{doc.cancelled_appointments}</td>
                    <td>{doc.completion_rate}%</td>
                    <td>{doc.utilization_rate}%</td>
                    <td>{doc.performance_score}%</td>
                    <td>
                      <span className="performance-tier-badge">
                        {doc.performance_tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="detailed-metrics">
            <h4>Metrici detaliate</h4>
            <div className="metrics-grid">
              {reportData.slice(0, 5).map((doc, idx) => (
                <div key={idx} className="metric-card">
                  <h5>{doc.first_name} {doc.last_name}</h5>
                  <div className="metric-details">
                    <div className="metric-row">
                      <span>Pacienți unici:</span>
                      <span>{doc.unique_patients}</span>
                    </div>
                    <div className="metric-row">
                      <span>Rată retenție pacienți:</span>
                      <span>{doc.patient_retention_rate}%</span>
                    </div>
                    <div className="metric-row">
                      <span>Rată anulări:</span>
                      <span>{doc.cancellation_rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="report-actions">
            <button onClick={handleSave}>Salvează raportul</button>
            <button onClick={handleDownloadPDF}>Descarcă PDF</button>
            {saved && <p className="success-msg">Raport salvat cu succes!</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorPerformanceReport;