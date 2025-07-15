import React, { useEffect, useState } from "react";
import * as ReportService from "@services/ReportService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "@styles/components/CancellationRateReport.css";

const CancellationRateReport = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState("3months");

    useEffect(() => {
        const loadReport = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (period) params.append("period", period);

                const res = await fetch(`http://localhost:8080/api/admin-reports/cancellation-rate?${params}`, {
                    credentials: "include"
                });

                if (!res.ok) {
                    const text = await res.text();
                    setError(text);
                    setReportData(null);
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setReportData(data);
            } catch (error) {
                setError("Eroare la încărcarea raportului.");
                setReportData(null);
            } finally {
                setLoading(false);
            }
        };

        loadReport();
    }, [period]);

    const handleDownloadPDF = async () => {
        const element = document.querySelector(".report-box");
        if (!element) return;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("raport_anulari.pdf");
    };

    const handleSave = async () => {
        try {
            await ReportService.saveReport({
                report_type: "cancellation_rate",
                content: reportData
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            setError("Eroare la salvarea raportului.");
        }
    };

    return (
        <div className="report-box">
            <h3>Raport Rata Anulare Programări</h3>

            <label>Perioada:</label>
            <select value={period} onChange={e => setPeriod(e.target.value)}>
                <option value="1month">Ultima lună</option>
                <option value="3months">Ultimele 3 luni</option>
                <option value="6months">Ultimele 6 luni</option>
            </select>

            {loading && <p>Se încarcă raportul...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {reportData && reportData.overview && (
                <div className="report-content">
                    <p>Total programări: {reportData.overview.totalAppointments}</p>
                    <p>Anulate: {reportData.overview.canceledAppointments}</p>
                    <p>No-show: {reportData.overview.noShowAppointments}</p>
                    <p>Finalizate: {reportData.overview.completedAppointments}</p>
                    <p>Rata anulare: {reportData.overview.cancellationRate}%</p>
                    <p>Rata no-show: {reportData.overview.noShowRate}%</p>
                    <p>Rata finalizare: {reportData.overview.completionRate}%</p>
                </div>
            )}

            <div className="actions">
                <button onClick={handleSave}>Salvează raport</button>
                <button onClick={handleDownloadPDF}>Descarcă PDF</button>
                {saved && <span> Raport salvat cu succes!</span>}
            </div>
        </div>
    );
};

export default CancellationRateReport;
