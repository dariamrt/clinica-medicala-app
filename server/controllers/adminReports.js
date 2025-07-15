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

// appt cancellation rate 
const getAppointmentCancellationRate = async (req, res) => {
    try {
        const { period = '3months', doctor_id, specialty_id } = req.query;

        if (doctor_id && specialty_id) {
            return res.status(400).json({
                message: "Trebuie să selectezi fie un doctor, fie o specializare, nu ambele!"
            });
        }

        const endDate = new Date();
        const startDate = new Date();

        switch (period) {
            case '1month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case '3months':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case '6months':
                startDate.setMonth(startDate.getMonth() - 6);
                break;
            default:
                startDate.setMonth(startDate.getMonth() - 3);
        }

        const where = {
            date: {
                [Sequelize.Op.between]: [startDate, endDate]
            }
        };

        if (doctor_id) where.doctor_id = doctor_id;

        const totalAppointments = await Appointment.count({ where });
        const canceledAppointments = await Appointment.count({ where: { ...where, status: "cancelled" } });
        
        const noShowAppointments = await Appointment.count({ 
            where: { 
                ...where, 
                status: {
                    [Sequelize.Op.in]: ["no_show", "cancelled"]
                }
            } 
        });
        
        const currentDateTime = new Date();
        const completedAppointments = await Appointment.count({ 
            where: { 
                ...where, 
                [Sequelize.Op.or]: [
                    { status: "completed" },
                    {
                        status: "confirmed",
                        [Sequelize.Op.and]: [
                            Sequelize.where(
                                Sequelize.fn('TIMESTAMP', 
                                    Sequelize.col('date'), 
                                    Sequelize.col('end_time')
                                ),
                                {
                                    [Sequelize.Op.lt]: currentDateTime
                                }
                            )
                        ]
                    }
                ]
            } 
        });

        const cancellationRate = totalAppointments === 0 ? 0 : (canceledAppointments / totalAppointments) * 100;
        const noShowRate = totalAppointments === 0 ? 0 : (noShowAppointments / totalAppointments) * 100;
        const completionRate = totalAppointments === 0 ? 0 : (completedAppointments / totalAppointments) * 100;

        const response = {
            period,
            dateRange: {
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0]
            },
            overview: {
                totalAppointments,
                canceledAppointments,
                noShowAppointments,
                completedAppointments,
                cancellationRate: Math.round(cancellationRate * 100) / 100,
                noShowRate: Math.round(noShowRate * 100) / 100,
                completionRate: Math.round(completionRate * 100) / 100
            }
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching cancellation rate:", error);
        return res.status(500).json({ message: "Error fetching cancellation rate!" });
    }
};

// Peak hours for appts
const getPeakAppointmentHours = async (req, res) => {
    try {
        const { includeByDay } = req.query;

        const peakHoursData = await Appointment.findAll({
            attributes: [
                [Sequelize.fn('HOUR', Sequelize.col('start_time')), 'hour'],
                [Sequelize.fn('COUNT', Sequelize.col('start_time')), 'count']
            ],
            group: [Sequelize.fn('HOUR', Sequelize.col('start_time'))],
            order: [[Sequelize.fn('COUNT', Sequelize.col('start_time')), 'DESC']],
            raw: true
        });

        console.log("Debug - Peak Hours Data:", peakHoursData);

        const peakHours = peakHoursData.map(entry => ({
            hour: String(entry.hour).padStart(2, '0'),
            count: parseInt(entry.count)
        }));

        let response = { peakHours };

        if (includeByDay === 'true') {
            const peakHoursByDayData = await Appointment.findAll({
                attributes: [
                    [Sequelize.fn('DAYNAME', Sequelize.col('date')), 'day_name'],
                    [Sequelize.fn('WEEKDAY', Sequelize.col('date')), 'day_number'],
                    [Sequelize.fn('HOUR', Sequelize.col('start_time')), 'hour'],
                    [Sequelize.fn('COUNT', Sequelize.col('start_time')), 'count']
                ],
                group: [
                    Sequelize.fn('WEEKDAY', Sequelize.col('date')),
                    Sequelize.fn('HOUR', Sequelize.col('start_time'))
                ],
                order: [
                    [Sequelize.fn('WEEKDAY', Sequelize.col('date')), 'ASC'],
                    [Sequelize.fn('COUNT', Sequelize.col('start_time')), 'DESC']
                ],
                raw: true
            });

            const dayMapping = {
                0: 'monday',  
                1: 'tuesday',
                2: 'wednesday',
                3: 'thursday',
                4: 'friday',
                5: 'saturday',
                6: 'sunday'
            };

            const peakHoursByDay = {};
            
            Object.values(dayMapping).forEach(day => {
                peakHoursByDay[day] = [];
            });

            peakHoursByDayData.forEach(entry => {
                const dayKey = dayMapping[entry.day_number];
                if (dayKey) {
                    peakHoursByDay[dayKey].push({
                        hour: String(entry.hour).padStart(2, '0'),
                        count: parseInt(entry.count)
                    });
                }
            });

            Object.keys(peakHoursByDay).forEach(day => {
                peakHoursByDay[day].sort((a, b) => b.count - a.count);
            });

            response.peakHoursByDay = peakHoursByDay;
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching peak appointment hours:", error);
        res.status(500).json({ message: "Error fetching peak appointment hours!" });
    }
};

const getPeakAppointmentHoursByDay = async (req, res) => {
    try {
        const { day } = req.params; 
        
        const dayMapping = {
            'monday': 0,
            'tuesday': 1,
            'wednesday': 2,
            'thursday': 3,
            'friday': 4,
            'saturday': 5,
            'sunday': 6
        };

        const dayNumber = dayMapping[day.toLowerCase()];
        if (dayNumber === undefined) {
            return res.status(400).json({ message: "Invalid day. Use: monday, tuesday, wednesday, thursday, friday, saturday, sunday" });
        }

        const peakHoursData = await Appointment.findAll({
            attributes: [
                [Sequelize.fn('HOUR', Sequelize.col('start_time')), 'hour'],
                [Sequelize.fn('COUNT', Sequelize.col('start_time')), 'count']
            ],
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('WEEKDAY', Sequelize.col('date')), dayNumber)
                ]
            },
            group: [Sequelize.fn('HOUR', Sequelize.col('start_time'))],
            order: [[Sequelize.fn('COUNT', Sequelize.col('start_time')), 'DESC']],
            raw: true
        });

        const peakHours = peakHoursData.map(entry => ({
            hour: String(entry.hour).padStart(2, '0'),
            count: parseInt(entry.count)
        }));

        return res.status(200).json({ 
            day: day.toLowerCase(),
            peakHours 
        });
    } catch (error) {
        console.error(`Error fetching peak appointment hours for ${day}:`, error);
        res.status(500).json({ message: `Error fetching peak appointment hours for ${day}!` });
    }
};

// Most common diagnoses 
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

// Dr performance 
const getDoctorPerformanceReport = async (req, res) => {
    try {
        const { period = '3months' } = req.query;
        
        const endDate = new Date();
        const startDate = new Date();
        switch (period) {
            case '1month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case '3months':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case '6months':
                startDate.setMonth(startDate.getMonth() - 6);
                break;
            case '1year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(startDate.getMonth() - 3);
        }

        const doctorPerformanceData = await Doctor.findAll({
            attributes: [
                'user_id',
                'first_name',
                'last_name',
                'specialty_id'
            ],
            include: [
                {
                    model: Appointment,
                    where: {
                        date: {
                            [Sequelize.Op.between]: [startDate, endDate]
                        }
                    },
                    required: false,
                    attributes: ['id', 'status', 'date', 'patient_id', 'end_time']
                },
                {
                    model: Specialty,
                    attributes: ['id', 'name']
                }
            ],
            raw: false
        });

        const currentDateTime = new Date();

        const performanceReport = await Promise.all(
            doctorPerformanceData.map(async (doctor) => {
                const appointments = doctor.Appointments || [];
                
                const totalAppointments = appointments.length;
                const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;
                
                const completedAppointments = appointments.filter(apt => {
                    if (apt.status === 'completed') return true;
                    if (apt.status === 'confirmed') {
                        const appointmentEndTime = new Date(apt.date + 'T' + apt.end_time);
                        return appointmentEndTime < currentDateTime;
                    }
                    return false;
                }).length;

                const noShowAppointments = appointments.filter(apt => 
                    apt.status === 'no_show' || apt.status === 'cancelled'
                ).length;

                const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
                const cancellationRate = totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0;
                const noShowRate = totalAppointments > 0 ? (noShowAppointments / totalAppointments) * 100 : 0;

                const availabilityData = await Availability.findAll({
                    where: {
                        doctor_id: doctor.user_id,
                        date: {
                            [Sequelize.Op.between]: [startDate, endDate]
                        }
                    }
                });

                const totalAvailableSlots = availabilityData.length;
                const utilizationRate = totalAvailableSlots > 0 ? (totalAppointments / totalAvailableSlots) * 100 : 0;

                const patientIds = appointments.map(apt => apt.patient_id);
                const uniquePatients = [...new Set(patientIds)];
                const repeatPatients = patientIds.length - uniquePatients.length;
                const patientRetentionRate = uniquePatients.length > 0 ? (repeatPatients / uniquePatients.length) * 100 : 0;

                const revenueGenerated = completedAppointments * 150;

                const performanceScore = calculateOverallScore({
                    completionRate,
                    utilizationRate,
                    patientRetentionRate,
                    cancellationRate,
                    noShowRate
                });

                const performanceTier = getPerformanceTier(performanceScore);

                return {
                    user_id: doctor.user_id,
                    first_name: doctor.first_name,
                    last_name: doctor.last_name,
                    specialty: {
                        id: doctor.Specialty?.id,
                        name: doctor.Specialty?.name
                    },
                    total_appointments: totalAppointments,
                    completed_appointments: completedAppointments,
                    cancelled_appointments: cancelledAppointments,
                    no_show_appointments: noShowAppointments,
                    unique_patients: uniquePatients.length,
                    completion_rate: Math.round(completionRate * 100) / 100,
                    cancellation_rate: Math.round(cancellationRate * 100) / 100,
                    no_show_rate: Math.round(noShowRate * 100) / 100,
                    utilization_rate: Math.round(utilizationRate * 100) / 100,
                    patient_retention_rate: Math.round(patientRetentionRate * 100) / 100,
                    revenue_generated: revenueGenerated,
                    performance_score: Math.round(performanceScore * 100) / 100,
                    performance_tier: performanceTier,
                    ranking: 0
                };
            })
        );

        performanceReport.sort((a, b) => b.performance_score - a.performance_score);
        performanceReport.forEach((doctor, index) => {
            doctor.ranking = index + 1;
        });

        return res.status(200).json({
            doctorPerformanceReport: performanceReport,
            period,
            totalDoctors: performanceReport.length,
            averageScore: performanceReport.length > 0 ? Math.round((performanceReport.reduce((sum, doctor) => sum + doctor.performance_score, 0) / performanceReport.length) * 100) / 100 : 0
        });

    } catch (error) {
        console.error("Error fetching doctor performance report:", error);
        res.status(500).json({ message: "Error fetching doctor performance report!" });
    }
};

const calculateOverallScore = (metrics) => {
    const {
        completionRate,
        utilizationRate,
        patientRetentionRate,
        cancellationRate,
        noShowRate
    } = metrics;

    const positiveScore = (completionRate * 0.4) + (utilizationRate * 0.3) + (patientRetentionRate * 0.2);
    const negativeScore = (cancellationRate * 0.05) + (noShowRate * 0.05);

    return Math.max(0, Math.min(100, positiveScore - negativeScore));
};

const getPerformanceTier = (score) => {
    if (score >= 85) return 'Excelent';
    if (score >= 70) return 'Bun';
    if (score >= 55) return 'Mediu';
    if (score >= 40) return 'Sub medie';
    return 'Necesita imbunatatire';
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
    getPeakAppointmentHoursByDay,
    getCommonDiagnoses,
    getDoctorPerformanceReport,
    predictAppointmentNoShow,
    predictAppointmentNoShowByPatientId,
    calculateAgeFromPatientId
};


