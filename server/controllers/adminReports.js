const { predictNoShow } = require('../utils/noShowPredictor');
const { Appointment, Availability, MedicalHistory, Doctor, Specialty } = require("../models");
const { Sequelize } = require("sequelize");

// Appointment Cancellation Rate Report
const getAppointmentCancellationRate = async (req, res) => {
    try {
        const totalAppointments = await Appointment.count();
        const canceledAppointments = await Appointment.count({ where: { status: "canceled" } });

        const cancellationRate = totalAppointments === 0 
            ? 0 
            : ((canceledAppointments / totalAppointments) * 100).toFixed(2);

        return res.status(200).json({
            totalAppointments,
            canceledAppointments,
            cancellationRate: `${cancellationRate}%`
        });
    } catch (error) {
        console.error("Error fetching cancellation rate:", error);
        res.status(500).json({ message: "Error fetching cancellation rate!" });
    }
};

// Peak Hours for Appointments
const getPeakAppointmentHours = async (req, res) => {
    try {
        const peakHours = await Availability.findAll({
            attributes: [
                [Sequelize.fn("HOUR", Sequelize.col("start_time")), "hour"],
                [Sequelize.fn("COUNT", Sequelize.col("id")), "total_appointments"]
            ],
            group: [Sequelize.fn("HOUR", Sequelize.col("start_time"))],
            order: [[Sequelize.literal("total_appointments"), "DESC"]]
        });

        return res.status(200).json({ peakHours });
    } catch (error) {
        console.error("Error fetching peak hours:", error);
        res.status(500).json({ message: "Error fetching peak hours!" });
    }
};

// Most Common Diagnoses Report
const getCommonDiagnoses = async (req, res) => {
    try {
        const diagnosesReport = await MedicalHistory.findAll({
            attributes: [
                [Sequelize.fn("JSON_UNQUOTE", Sequelize.fn("JSON_EXTRACT", Sequelize.col("diagnosis"), "$")), "diagnosis"],
                [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
            ],
            group: ["diagnosis"],
            order: [[Sequelize.literal("count"), "DESC"]],
            limit: 10 // get the most frequent 10 diagnoses
        });

        return res.status(200).json({ diagnosesReport });
    } catch (error) {
        console.error("Error fetching common diagnoses:", error);
        res.status(500).json({ message: "Error fetching common diagnoses!" });
    }
};

// Doctor Performance Report
const getDoctorPerformanceReport = async (req, res) => {
    try {
        const performanceReport = await Doctor.findAll({
            attributes: [
                "id",
                "first_name",
                "last_name",
                [Sequelize.fn("COUNT", Sequelize.col("Appointments.id")), "total_appointments"],
                [Sequelize.fn("AVG", Sequelize.literal("TIMESTAMPDIFF(MINUTE, `Availabilities`.`start_time`, `Availabilities`.`end_time`)")), "avg_duration"]
            ],
            include: [
                { model: Specialty, attributes: ["name"] },
                { model: Appointment, attributes: [] },
                { model: Availability, attributes: [] }
            ],
            group: ["Doctor.id"],
            order: [[Sequelize.literal("total_appointments"), "DESC"]]
        });

        return res.status(200).json({ performanceReport });
    } catch (error) {
        console.error("Error fetching doctor performance report:", error);
        res.status(500).json({ message: "Error fetching doctor performance report!" });
    }
};

// generate a report and save if needed 
const generateReport = async (req, res) => {
    try {
        const { report_type, save, format } = req.body;
        let reportData;

        switch (report_type) {
            case "cancellation-rate":
                reportData = await getAppointmentCancellationRate();
                break;
            case "peak-hours":
                reportData = await getPeakAppointmentHours();
                break;
            case "common-diagnoses":
                reportData = await getCommonDiagnoses();
                break;
            case "doctor-performance":
                reportData = await getDoctorPerformanceReport();
                break;
            default:
                return res.status(400).json({ message: "Invalid report type" });
        }

        if (save) {
            const savedReport = await Admin_Reports.create({
                report_type,
                content: reportData,
                created_by_user_id: req.user.id,
                format: format || "json",
            });

            return res.status(201).json({ message: "Report saved successfully", report: savedReport });
        }

        res.status(200).json({ message: "Report generated", report: reportData });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Error generating report" });
    }
};

// get all the stored reports
const getStoredReports = async (req, res) => {
    try {
        const reports = await Admin_Reports.findAll({
            include: [{ model: User, attributes: ["email"] }],
            order: [["generated_at", "DESC"]],
        });

        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Error fetching reports" });
    }
};

// download Report as JSON or csv
const downloadReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Admin_Reports.findByPk(id);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        if (report.format === "json") {
            res.setHeader("Content-Disposition", `attachment; filename=report-${id}.json`);
            res.json(report.content);
        } else if (report.format === "csv") {
            const parser = new Parser();
            const csv = parser.parse(report.content);
            res.setHeader("Content-Disposition", `attachment; filename=report-${id}.csv`);
            res.setHeader("Content-Type", "text/csv");
            res.send(csv);
        }
    } catch (error) {
        console.error("Error downloading report:", error);
        res.status(500).json({ message: "Error downloading report" });
    }
};

// Controller for the AI algorithm
const predictAppointmentNoShow = async (req, res) => {
    try {
        const { patientAge, gender, date } = req.body;
        const risk = await predictNoShow(patientAge, gender, date);

        return res.status(200).json({ risk });
    } catch (error) {
        console.error('Error predicting no-show:', error);
        return res.status(500).json({ message: 'Error processing request' });
    }
};

module.exports = {
    generateReport, 
    getStoredReports,
    downloadReport,
    getAppointmentCancellationRate,
    getPeakAppointmentHours,
    getCommonDiagnoses,
    getDoctorPerformanceReport,
    predictAppointmentNoShow
};


