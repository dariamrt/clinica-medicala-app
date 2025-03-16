const { User, Specialty, Doctor, Patient, Availability, Appointment, MedicalHistory, Prescription, AdminReport, Notification } = require('./models');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

async function populateDatabase() {
    await AdminReport.destroy({ where: {} });
    await Prescription.destroy({ where: {} });
    await MedicalHistory.destroy({ where: {} });
    await Appointment.destroy({ where: {} });
    await Availability.destroy({ where: {} });
    await Doctor.destroy({ where: {} });
    await Patient.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Specialty.destroy({ where: {} });
    await Notification.destroy({ where: {} });

    const specialties = await Specialty.bulkCreate([
        { id: uuidv4(), name: "Cardiologie" },
        { id: uuidv4(), name: "Neurologie" },
        { id: uuidv4(), name: "Pediatrie" },
        { id: uuidv4(), name: "Dermatologie" },
        { id: uuidv4(), name: "Oncologie" }
    ]);

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
        id: uuidv4(),
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin"
    });

    const doctorUsers = await User.bulkCreate([
        { id: uuidv4(), email: "doctor1@example.com", password: await bcrypt.hash("password1", 10), role: "doctor" },
        { id: uuidv4(), email: "doctor2@example.com", password: await bcrypt.hash("password2", 10), role: "doctor" },
        { id: uuidv4(), email: "doctor3@example.com", password: await bcrypt.hash("password3", 10), role: "doctor" },
        { id: uuidv4(), email: "doctor4@example.com", password: await bcrypt.hash("password4", 10), role: "doctor" },
        { id: uuidv4(), email: "doctor5@example.com", password: await bcrypt.hash("password5", 10), role: "doctor" }
    ], { returning: true });

    const doctors = await Doctor.bulkCreate(doctorUsers.map((user, index) => ({
        user_id: user.id,
        first_name: `Doctor${index + 1}`,
        last_name: `Test${index + 1}`,
        specialty_id: specialties[index].id,
        phone_number: `07${Math.floor(10000000 + Math.random() * 9000000)}`,
        salary: 10000 + index * 500
    })), { returning: true });

    const patientUsers = await User.bulkCreate([
        { id: uuidv4(), email: "patient1@example.com", password: await bcrypt.hash("password1", 10), role: "patient" },
        { id: uuidv4(), email: "patient2@example.com", password: await bcrypt.hash("password2", 10), role: "patient" },
        { id: uuidv4(), email: "patient3@example.com", password: await bcrypt.hash("password3", 10), role: "patient" }
    ], { returning: true });

    const patients = await Patient.bulkCreate(patientUsers.map((user, index) => ({
        user_id: user.id,
        first_name: `Patient${index + 1}`,
        last_name: `Test${index + 1}`,
        CNP: `1990101${index}123456`,
        gender: index % 2 === 0 ? "male" : "female",
        phone_number: `07${Math.floor(10000000 + Math.random() * 9000000)}`,
        address: `Str. Exemplu ${index + 1}, București`
    })), { returning: true });

    await Availability.bulkCreate(doctors.flatMap(doctor => ([
        { id: uuidv4(), doctor_id: doctor.user_id, date: "2025-04-01", start_time: "08:00", end_time: "12:00" },
        { id: uuidv4(), doctor_id: doctor.user_id, date: "2025-04-02", start_time: "10:00", end_time: "14:00" }
    ])));

    await Appointment.bulkCreate(patients.flatMap(patient => ([
        { id: uuidv4(), patient_id: patient.user_id, doctor_id: doctors[0].user_id, date: "2025-04-01", start_time: "09:00", end_time: "09:30", status: "confirmed", reimbursed_by_CAS: true },
        { id: uuidv4(), patient_id: patient.user_id, doctor_id: doctors[1].user_id, date: "2025-04-02", start_time: "11:00", end_time: "11:30", status: "cancelled", reimbursed_by_CAS: false }
    ])));

    console.log("Database populated successfully!");
}

populateDatabase().catch(error => console.error("Error populating database:", error));
