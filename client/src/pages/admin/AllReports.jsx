import React, { useEffect, useState } from "react";
import { ReportService } from "@services";
import { StoredReportItem } from "@components";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import "@styles/pages/AllReports.css";
import "@styles/components/ReportCard.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#d0ed57", "#a4de6c", "#d88884"];

const CancellationRateView = ({ data }) => {
  const reportData = data.content || data;

  if (!reportData || !reportData.overview) {
    return (
      <div className="report-box">
        <h3>Rata de anulare a programărilor</h3>
        <p>Date incomplete sau format nerecunoscut.</p>
      </div>
    );
  }

  return (
    <div className="report-box">
      <h3>Rata de anulare a programărilor</h3>
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
      {reportData.trends && reportData.trends.monthly && reportData.trends.monthly.length > 1 && (
        <div className="trends-section">
          <h4>Evoluție lunară</h4>
          <div className="scroll-table-wrapper">
            <table className="report-table styled-table">
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
                {reportData.trends.monthly.map((month, index) => (
                  <tr key={index}>
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
    </div>
  );
};

export default CancellationRateView;
