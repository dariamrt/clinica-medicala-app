import React, { useEffect, useState } from "react";
import { ReportService } from "@services";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
 BarChart,
 Bar,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer,
 CartesianGrid,
} from "recharts";

const PeakHoursReport = () => {
 const [peakHours, setPeakHours] = useState([]);
 const [peakHoursByDay, setPeakHoursByDay] = useState({});
 const [loading, setLoading] = useState(true);
 const [saved, setSaved] = useState(false);
 const [selectedView, setSelectedView] = useState("overall");
 const [selectedDay, setSelectedDay] = useState("monday");

 const daysOfWeek = {
   monday: "Luni",
   tuesday: "Marți",
   wednesday: "Miercuri",
   thursday: "Joi",
   friday: "Vineri",
   saturday: "Sâmbătă",
   sunday: "Duminică"
 };

 useEffect(() => {
   const fetchData = async () => {
     try {
       const result = await ReportService.getPeakAppointmentHours();
       setPeakHours(result.peakHours || []);
       setPeakHoursByDay(result.peakHoursByDay || {});
     } catch (err) {
       console.error("Eroare la preluarea orelor de varf:", err);
     } finally {
       setLoading(false);
     }
   };

   fetchData();
 }, []);

 const handleSave = async () => {
   try {
     await ReportService.saveReport({
       report_type: "peak_hours",
       content: { 
         hours: peakHours,
         hoursByDay: peakHoursByDay,
         viewType: selectedView,
         selectedDay: selectedView === "byDay" ? selectedDay : null
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
   
   const fileName = selectedView === "overall" 
     ? "ore_varf_general.pdf" 
     : `ore_varf_${selectedDay}.pdf`;
   
   pdf.save(fileName);
 };

 const getCurrentData = () => {
   if (selectedView === "overall") {
     return peakHours;
   } else {
     return peakHoursByDay[selectedDay] || [];
   }
 };

 const getChartTitle = () => {
   if (selectedView === "overall") {
     return "Ore de vârf pentru programări (General)";
   } else {
     return `Ore de vârf pentru ${daysOfWeek[selectedDay]}`;
   }
 };

 return (
   <div className="report-box">
     <div className="report-controls">
       <div className="radio-group">
         <label>
           <input
             type="radio"
             value="overall"
             checked={selectedView === "overall"}
             onChange={(e) => setSelectedView(e.target.value)}
           />
           Vedere generală
         </label>
         <label>
           <input
             type="radio"
             value="byDay"
             checked={selectedView === "byDay"}
             onChange={(e) => setSelectedView(e.target.value)}
           />
           Pe zile ale săptămânii
         </label>
       </div>

       {selectedView === "byDay" && (
         <div className="day-selector">
           <label htmlFor="daySelect">Selectează ziua:</label>
           <select
             id="daySelect"
             value={selectedDay}
             onChange={(e) => setSelectedDay(e.target.value)}
           >
             {Object.entries(daysOfWeek).map(([key, value]) => (
               <option key={key} value={key}>
                 {value}
               </option>
             ))}
           </select>
         </div>
       )}
     </div>

     <h3>{getChartTitle()}</h3>
     
     {loading ? (
       <p>Se încarcă...</p>
     ) : (
       <>
         {getCurrentData().length > 0 ? (
           <div className="chart-container">
             <ResponsiveContainer>
               <BarChart data={getCurrentData()} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="hour" />
                 <YAxis allowDecimals={false} />
                 <Tooltip 
                   formatter={(value, name) => [`${value} programări`, 'Numărul de programări']}
                   labelFormatter={(label) => `Ora: ${label}:00`}
                 />
                 <Bar dataKey="count" fill="#8884d8" />
               </BarChart>
             </ResponsiveContainer>
           </div>
         ) : (
           <p>
             {selectedView === "overall" 
               ? "Nu au fost găsite ore de vârf." 
               : `Nu au fost găsite ore de vârf pentru ${daysOfWeek[selectedDay]}.`
             }
           </p>
         )}

         <div className="action-buttons">
           <button onClick={handleSave}>Salvează raportul</button>
           <button onClick={handleDownloadPDF}>Descarcă PDF</button>
         </div>
         
         {saved && <p className="success-msg">Raport salvat cu succes!</p>}
       </>
     )}
   </div>
 );
};

export default PeakHoursReport;