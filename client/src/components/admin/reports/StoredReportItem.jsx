import React from "react";
import { ReportService } from "@services";
import { Eye, Trash2 } from "lucide-react";

const StoredReportItem = ({ report, onDelete, onView }) => {
  const handleDelete = async () => {
    if (!window.confirm("Sunteți sigur că vrei să ștergi acest raport?")) return;

    try {
      await ReportService.deleteReport(report.id);
      onDelete?.(report.id);
    } catch {
      alert("Eroare la sters raport.");
    }
  };

  return (
    <div className="report-card">
      <div className="report-info">
        <h4>Tip: {report.type.replace(/_/g, " ")}</h4>
        <p>Creat la: {new Date(report.createdAt).toLocaleString()}</p>
      </div>

      <div className="report-actions">
        <button onClick={() => onView?.(report)} title="Vezi">
          <Eye size={18} />
        </button>
        <button onClick={handleDelete} title="Șterge">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default StoredReportItem;
