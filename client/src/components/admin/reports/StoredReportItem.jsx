import React from "react";
import { ReportService } from "@services";
import { Eye, Trash2 } from "lucide-react";

const StoredReportItem = ({ report, onDelete, onView }) => {
  const handleDelete = () => {
    onDelete?.(report); 
  };

  return (
    <div className="report-card">
      <div className="report-info">
        <h4>Tip: {report.report_type?.replace(/_/g, " ") || "Necunoscut"} </h4>
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