const { predictNoShow } = require('../utils/noShowPredictor');
const { User, Appointment, Availability, MedicalHistory, Doctor, Specialty, AdminReport, Patient } = require("../models");
const { Sequelize } = require("sequelize");

// generate a report and save if needed 
const saveReport = async (req, res) => {
    try {
        const { report_type, content, format = "json" } = req.body;

        const user_id = req.user?.id || req.cookies?.user_id || "system";

        const formattedContent = JSON.stringify(content, (key, value) => {
            if (value && typeof value === "object" && "_previousDataValues" in value) {
                return { ...value.dataValues };
            }
            return value;
        });

        const savedReport = await AdminReport.create({
            report_type,
            content: formattedContent,
            created_by_user_id: user_id,
            format,
        });

        return res.status(201).json({ message: "Report saved successfully", report: savedReport });
    } catch (error) {
        console.error("Error saving report to database:", error);
        res.status(500).json({ message: "Error saving report!" });
    }
};

// get all the stored reports
const getStoredReports = async (req, res) => {
    try {
        const reports = await AdminReport.findAll({
            include: [{ model: User, attributes: ["email"] }],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Error fetching reports" });
    }
};

// get reports by id
const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await AdminReport.findByPk(id);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.status(200).json({
            id: report.id,
            report_type: report.report_type,
            content: JSON.parse(report.content),  
            created_by_user_id: report.created_by_user_id,
            format: report.format,
            createdAt: report.createdAt
        });
    } catch (error) {
        console.error("Error fetching report:", error);
        res.status(500).json({ message: "Error fetching report" });
    }
};

// delete report by id
const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await AdminReport.findByPk(id);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        await report.destroy();
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ message: "Error deleting report" });
    }
};

// Appointment Cancellation Rate Report
const getAppointmentCancellationRate = async (req, res) => {
    try {
        const totalAppointments = await Appointment.count();
        const canceledAppointments = await Appointment.count({ where: { status: "cancelled" } });

        const cancellationRate = totalAppointments === 0 
            ? "0.00%" 
            : ((canceledAppointments / totalAppointments) * 100).toFixed(2) + "%";

        return res.status(200).json({
            totalAppointments,
            canceledAppointments,
            cancellationRate
        });
    } catch (error) {
        console.error("Error fetching cancellation rate:", error);
        res.status(500).json({ message: "Error fetching cancellation rate!" });
    }
};

// Peak Hours for Appointments
const getPeakAppointmentHours = async (req, res) => {
    try {
        const peakHoursData = await Appointment.findAll({
            attributes: ['start_time', [Sequelize.fn('COUNT', Sequelize.col('start_time')), 'numAppointments']],
            group: ['start_time'],
            order: [[Sequelize.fn('COUNT', Sequelize.col('start_time')), 'DESC']],
            raw: true
        });

        console.log("Debug - Peak Hours Data:", peakHoursData);

        if (peakHoursData.length === 0) {
            return res.status(200).json({ message: "No peak hours found.", peakHours: [] });
        }

        const peakHours = peakHoursData.map(entry => ({
            hour: entry.start_time,
            count: entry.numAppointments
        }));

        return res.status(200).json({ peakHours });
    } catch (error) {
        console.error("Error fetching peak appointment hours:", error);
        res.status(500).json({ message: "Error fetching peak appointment hours!" });
    }
};

// Most Common Diagnoses 
const getCommonDiagnoses = async (req, res) => {
    try {
        const diagnosesData = await MedicalHistory.findAll({
            attributes: [
                [Sequelize.col('diagnosis'), 'diagnosis'],
                [Sequelize.fn('COUNT', Sequelize.col('diagnosis')), 'count']
            ],
            where: {
                diagnosis: { [Sequelize.Op.ne]: null }
            },
            group: ['diagnosis'],
            order: [[Sequelize.fn('COUNT', Sequelize.col('diagnosis')), 'DESC']],
            raw: true
        });

        console.log("Debug - Diagnoses Data:", diagnosesData);

        const diagnosesReport = diagnosesData.map(entry => ({
            diagnosis: entry.diagnosis,
            count: parseInt(entry.count)
        }));

        return res.status(200).json({ diagnosesReport });
    } catch (error) {
        console.error("Error fetching common diagnoses:", error);
        res.status(500).json({ message: "Error fetching common diagnoses!" });
    }
};

// Doctor Performance Report
const getDoctorPerformanceReport = async (req, res) => {
    try {
        const doctorPerformanceData = await Doctor.findAll({
            attributes: [
                'user_id',
                'first_name',
                'last_name',
                [Sequelize.fn('COUNT', Sequelize.col('Appointments.id')), 'total_appointments'],
                [Sequelize.fn('IFNULL', Sequelize.literal(
                    "CASE WHEN COUNT(Appointments.id) > 0 THEN AVG(TIMESTAMPDIFF(MINUTE, Availabilities.start_time, Availabilities.end_time)) ELSE 0 END"
                ), 0), 'avg_duration'],
                [Sequelize.fn('IFNULL', Sequelize.col('Appointments.status'), 'No Appointments'), 'appointment_status']
            ],
            include: [
                {
                    model: Appointment,
                    attributes: ['id', 'status'],
                    required: false
                },
                {
                    model: Availability,
                    attributes: [],
                    required: false
                },
                {
                    model: Specialty,
                    attributes: ['id', 'name']
                }
            ],
            group: ['user_id', 'Specialty.id'],
            order: [[Sequelize.literal('total_appointments'), 'DESC']],
            raw: true
        });

        const formattedData = doctorPerformanceData.map(doctor => ({
            user_id: doctor.user_id,
            first_name: doctor.first_name,
            last_name: doctor.last_name,
            total_appointments: doctor.total_appointments,
            avg_duration: doctor.avg_duration,
            appointment_status: doctor.appointment_status || "No Appointments",
            specialty: {
                id: doctor["Specialty.id"],
                name: doctor["Specialty.name"]
            }
        }));

        console.log("Debug - Formatted Doctor Performance Data:", formattedData);

        return res.status(200).json({ doctorPerformanceReport: formattedData });
    } catch (error) {
        console.error("Error fetching doctor performance report:", error);
        res.status(500).json({ message: "Error fetching doctor performance report!" });
    }
};

// No show
const calculateAgeFromPatientId = async (userId) => {
    try {
        const patient = await Patient.findOne({ 
            where: { user_id: userId }, 
            attributes: ['CNP'] 
        });
        
        if (!patient || !patient.CNP) return 0;

        const centuryPrefix = patient.CNP[0] === '1' || patient.CNP[0] === '2' ? "19" : "20";
        const birthYear = parseInt(centuryPrefix + patient.CNP.substring(1, 3));
        return new Date().getFullYear() - birthYear;
    } catch (error) {
        console.error('Error calculating age:', error);
        return 0;
    }
};

const predictAppointmentNoShow = async (req, res) => {
    try {
        const { age, gender, date, start_time } = req.body;
        if (!age || !gender || !date) {
            return res.status(400).json({ message: "Age, gender, and date are required!" });
        }

        const appointmentTime = start_time || "08:00";

        const risk = await predictNoShow(age, gender, date, appointmentTime);

        return res.status(200).json({ risk });
    } catch (error) {
        console.error('Error predicting no-show:', error);
        return res.status(500).json({ message: 'Error processing request' });
    }
};

const predictAppointmentNoShowByPatientId = async (req, res) => {
    try {
        const { patient_id, date, start_time } = req.body;
        if (!patient_id || !date || !start_time) {
            return res.status(400).json({ message: "patient_id, date, start_time are required" });
        }

        const patient = await Patient.findOne({ where: { user_id: patient_id } });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const age = await calculateAgeFromPatientId(patient_id);
        const gender = patient.gender;

        const previousCancellations = await Appointment.count({
            where: { patient_id: patient_id, status: "cancelled" }
        });

        const risk = await predictNoShow(age, gender, date, start_time, previousCancellations);

        return res.status(200).json({ risk });
    } catch (error) {
        console.error('Error predicting no-show by patient_id:', error);
        return res.status(500).json({ message: 'Error processing request' });
    }
};

module.exports = {
    saveReport, 
    getStoredReports,
    getReportById,
    deleteReport,
    getAppointmentCancellationRate,
    getPeakAppointmentHours,
    getCommonDiagnoses,
    getDoctorPerformanceReport,
    predictAppointmentNoShow,
    predictAppointmentNoShowByPatientId,
    calculateAgeFromPatientId
};


