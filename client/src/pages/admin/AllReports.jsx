import React, { useEffect, useState } from "react";
import { ReportService } from "@services";
import { StoredReportItem } from "@components";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import "@styles/pages/AllReports.css";
import "@styles/components/ReportCard.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#d0ed57", "#a4de6c", "#d88884"];

const CancellationRateView = ({ data }) => (
  <div className="report-box">
    <h3>Rata de anulare a programărilor</h3>
    <p><strong>{data.rate}</strong> din programări au fost anulate.</p>
  </div>
);

const PeakHoursView = ({ data }) => (
  <div className="report-box">
    <h3>Ore de vârf pentru programări</h3>
    {data.hours && data.hours.length > 0 ? (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data.hours} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <p>Nu au fost găsite ore de vârf.</p>
    )}
  </div>
);

const CommonDiagnosesView = ({ data }) => (
  <div className="report-box">
    <h3>Diagnosticuri frecvente</h3>
    {data.diagnoses && data.diagnoses.length > 0 ? (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data.diagnoses}
              dataKey="count"
              nameKey="diagnosis"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.diagnoses.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <p>Nu există date despre diagnosticuri.</p>
    )}
  </div>
);

const DoctorPerformanceView = ({ data }) => (
  <div className="report-box">
    <h3>Performanța doctorilor</h3>
    {data.performance && data.performance.length > 0 ? (
      <div className="scroll-table-wrapper">
        <table className="report-table styled-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Număr programări</th>
              <th>Status programări</th>
            </tr>
          </thead>
          <tbody>
            {data.performance.map((doc, idx) => (
              <tr key={idx}>
                <td>{doc.first_name} {doc.last_name}</td>
                <td>{doc.total_appointments}</td>
                <td>{doc.appointment_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p>Nu există date disponibile.</p>
    )}
  </div>
);

const PredictNoShowView = ({ data }) => (
  <div className="report-box">
    <h3>Prezicere neprezentare programare</h3>
    {data.input && (
      <div>
        <p><strong>Date intrare:</strong></p>
        <p>Vârstă: {data.input.age}</p>
        <p>Gen: {data.input.gender === 'female' ? 'Femeie' : 'Bărbat'}</p>
        <p>Dată: {data.input.date}</p>
      </div>
    )}
    {data.prediction && (
      <p className="result-msg">
        Probabilitatea neprezentării: <strong>{data.prediction.probability}%</strong>
      </p>
    )}
  </div>
);

const AllReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('formatted'); 

  const fetchReports = async () => {
    try {
      const data = await ReportService.getStoredReports();
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReports(sorted);
    } catch (err) {
      console.error("Eroare la incarcat rapoartele:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeleteConfirmed = async () => {
    try {
      await ReportService.deleteReport(reportToDelete.id);
      setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
      setReportToDelete(null);
    } catch {
      alert("Eroare la ștergerea raportului.");
    }
  };

  const handleDeleteRequest = (report) => {
    setReportToDelete(report);
  };

  const handleView = (report) => {
    setSelectedReport(report);
  };

  const getParsedContent = (content) => {
    try {
      if (typeof content === "string") {
        return JSON.parse(JSON.parse(content));
      }
      return content;
    } catch {
      return content;
    }
  };

  const downloadJSON = (content, filename = "raport.json") => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", filename);
    dlAnchorElem.click();
  };

  const downloadPDF = async () => {
    const element = document.querySelector(".report-modal-content");
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("raport.pdf");
  };

  const renderFormattedReport = (report) => {
    const content = getParsedContent(report.content);
    
    switch (report.report_type) {
      case 'cancellation_rate':
        return <CancellationRateView data={content} />;
      case 'peak_hours':
        return <PeakHoursView data={content} />;
      case 'common_diagnoses':
        return <CommonDiagnosesView data={content} />;
      case 'doctor_performance':
        return <DoctorPerformanceView data={content} />;
      case 'predict_no_show':
        return <PredictNoShowView data={content} />;
      default:
        return (
          <div className="report-box">
            <h3>Tip necunoscut de raport</h3>
            <pre>{JSON.stringify(content, null, 2)}</pre>
          </div>
        );
    }
  };

  return (
    <div className="all-reports-page">
      <h2 className="page-title">Toate rapoartele salvate</h2>

      {reports.length === 0 ? (
        <p className="empty-msg">Nu există rapoarte salvate.</p>
      ) : (
        <div className="report-list">
          {reports.map((report) => (
            <StoredReportItem
              key={report.id}
              report={report}
              onDelete={() => handleDeleteRequest(report)}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {selectedReport && (
        <div className="report-modal" onClick={() => setSelectedReport(null)}>
          <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedReport.report_type?.replace(/_/g, " ") || "Tip necunoscut"}</h3>
              <div className="view-toggle">
                <button 
                  className={viewMode === 'formatted' ? 'active' : ''}
                  onClick={() => setViewMode('formatted')}
                >
                  Formatat
                </button>
                <button 
                  className={viewMode === 'json' ? 'active' : ''}
                  onClick={() => setViewMode('json')}
                >
                  JSON
                </button>
              </div>
            </div>

            <div className="modal-body">
              {viewMode === 'formatted' ? (
                renderFormattedReport(selectedReport)
              ) : (
                <div className="json-rendered">
                  <pre>{JSON.stringify(getParsedContent(selectedReport.content), null, 2)}</pre>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={() => downloadJSON(getParsedContent(selectedReport.content))}>
                Descarcă JSON
              </button>
              <button onClick={downloadPDF}>Descarcă PDF</button>
              <button onClick={() => setSelectedReport(null)}>Închide</button>
            </div>
          </div>
        </div>
      )}

      {reportToDelete && (
        <div className="report-modal" onClick={() => setReportToDelete(null)}>
          <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmare ștergere</h3>
            <p>Sunteți sigur că doriți să ștergeți raportul <strong>{reportToDelete.report_type?.replace(/_/g, " ")}</strong>?</p>
            <div className="modal-actions">
              <button onClick={handleDeleteConfirmed}>Confirm</button>
              <button onClick={() => setReportToDelete(null)}>Renunță</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReports;