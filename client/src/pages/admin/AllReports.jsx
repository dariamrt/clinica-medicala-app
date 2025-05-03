import React, { useEffect, useState } from "react";
import { ReportService } from "@services";
import { StoredReportItem } from "@components";
import "@styles/pages/AllReports.css";
import "@styles/components/ReportCard.css";

const AllReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

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

  const handleDelete = (deletedId) => {
    setReports((prev) => prev.filter((r) => r.id !== deletedId));
  };

  const handleView = (report) => {
    setSelectedReport(report);
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
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {selectedReport && (
        <div className="report-modal" onClick={() => setSelectedReport(null)}>
          <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedReport.type.replace(/_/g, " ")}</h3>
            <pre>{JSON.stringify(selectedReport.data, null, 2)}</pre>
            <button onClick={() => setSelectedReport(null)}>Închide</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReports;
