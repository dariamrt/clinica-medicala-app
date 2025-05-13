import React, { useEffect, useState } from "react";
import { ReportService } from "@services";
import { StoredReportItem } from "@components";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "@styles/pages/AllReports.css";
import "@styles/components/ReportCard.css";

const AllReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);

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
            <h3>{selectedReport.report_type?.replace(/_/g, " ") || "Tip necunoscut"}</h3>

            <div className="json-rendered">
              <pre>{JSON.stringify(getParsedContent(selectedReport.content), null, 2)}</pre>
            </div>

            <div className="modal-actions">
              <button onClick={() => downloadJSON(getParsedContent(selectedReport.content))}>Descarcă JSON</button>
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
