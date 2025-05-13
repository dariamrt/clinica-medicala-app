import React, { useState } from "react";
import "@styles/pages/AdminReports.css";
import "@styles/components/ReportsSidebar.css";
import {
  CancellationRateReport,
  PeakHoursReport,
  CommonDiagnosesReport,
  DoctorPerformanceReport,
  PredictNoShowReport,
  StoredReportItem
} from "@components";

import { AllReports } from "@pages";

const getReportComponent = (key) => {
  switch (key) {
    case "cancellation-rate": return <CancellationRateReport />;
    case "peak-hours": return <PeakHoursReport />;
    case "common-diagnoses": return <CommonDiagnosesReport />;
    case "doctor-performance": return <DoctorPerformanceReport />;
    case "no-show-prediction": return <PredictNoShowReport />;
    case "stored": return <AllReports />;
    default: return null;
  }
};


const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState("cancellation-rate");

  return (
    <div className="admin-reports-page">
      <h2 className="page-title">Rapoarte</h2>
      <aside className="reports-sidebar">
        <div
          className={`sidebar-item ${selectedReport === "cancellation-rate" ? "active" : ""}`}
          onClick={() => setSelectedReport("cancellation-rate")}
        >
          Rată anulare
        </div>
        <div
          className={`sidebar-item ${selectedReport === "peak-hours" ? "active" : ""}`}
          onClick={() => setSelectedReport("peak-hours")}
        >
          Ore vârf
        </div>
        <div
          className={`sidebar-item ${selectedReport === "common-diagnoses" ? "active" : ""}`}
          onClick={() => setSelectedReport("common-diagnoses")}
        >
          Diagnostic frecvent
        </div>
        <div
          className={`sidebar-item ${selectedReport === "doctor-performance" ? "active" : ""}`}
          onClick={() => setSelectedReport("doctor-performance")}
        >
          Performanță doctori
        </div>
        <div
          className={`sidebar-item ${selectedReport === "no-show-prediction" ? "active" : ""}`}
          onClick={() => setSelectedReport("no-show-prediction")}
        >
          Predicție no-show
        </div>
        <div
          className={`sidebar-item ${selectedReport === "stored" ? "active" : ""}`}
          onClick={() => setSelectedReport("stored")}
        >
          Rapoarte salvate
        </div>
      </aside>

      <section className="report-content">
        {getReportComponent(selectedReport)}
      </section>

    </div>
  );
};

export default AdminReports;
