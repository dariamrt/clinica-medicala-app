const {
  User, Doctor, Patient, Specialty,
  Appointment, Availability, MedicalHistory,
  Prescription, Notification, AdminReport, connection
} = require('./models');

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

function randomTimeSlot() {
  const hour = 8 + Math.floor(Math.random() * 10);
  const start = `${hour.toString().padStart(2, '0')}:00:00`;
  const end = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
  return [start, end];
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAhead = 30) {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
  return date.toISOString().split('T')[0];
}

(async () => {
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

  const specialties = [];
  for (let i = 0; i < 5; i++) {
    specialties.push(await Specialty.create({
      id: uuidv4(),
      name: `Specialty_${i + 1}`
    }));
  }

  const hashedPassword = await bcrypt.hash('adminpass', 10);
  const adminUser = await User.create({
    id: uuidv4(),
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin'
  });

  const doctors = [];
  for (let i = 1; i <= 10; i++) {
    const userId = uuidv4();
    const doctorPassword = await bcrypt.hash('pass', 10);
    const user = await User.create({
      id: userId,
      email: `doctor${i}@example.com`,
      password: doctorPassword,
      role: 'doctor'
    });

    const doctor = await Doctor.create({
      user_id: userId,
      first_name: `Doctor${i}`,
      last_name: `Last${i}`,
      specialty_id: getRandomItem(specialties).id,
      phone_number: `07${Math.floor(10000000 + Math.random() * 89999999)}`,
      salary: 5000
    });

    doctors.push({ user, doctor });
  }

  const patients = [];
  for (let i = 1; i <= 49; i++) {
    const userId = uuidv4();
    const patientPassword = await bcrypt.hash('pass', 10);
    const user = await User.create({
      id: userId,
      email: `patient${i}@example.com`,
      password: patientPassword,
      role: 'patient'
    });

    const patient = await Patient.create({
      user_id: userId,
      first_name: `Patient${i}`,
      last_name: `Last${i}`,
      CNP: (1000000000000 + i).toString(),
      gender: getRandomItem(['male', 'female', 'other']),
      phone_number: `07${Math.floor(10000000 + Math.random() * 89999999)}`,
      address: `Strada ${i}`
    });

    patients.push({ user, patient });
  }

  const uniqueAvailabilities = new Set();
  let totalPrescriptions = 0;

  for (const { patient } of patients) {
    const numberOfAppointments = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numberOfAppointments; i++) {
      const { doctor } = getRandomItem(doctors);
      let date, start_time, end_time, key;
      let attempts = 0;
      do {
        date = randomDate();
        [start_time, end_time] = randomTimeSlot();
        key = `${doctor.user_id}-${date}-${start_time}-${end_time}`;
        attempts++;
        if (attempts > 20) break;
      } while (uniqueAvailabilities.has(key));
      uniqueAvailabilities.add(key);

      const appointmentId = uuidv4();
      await Appointment.create({
        id: appointmentId,
        patient_id: patient.user_id,
        doctor_id: doctor.user_id,
        date,
        start_time,
        end_time,
        status: getRandomItem(['pending', 'confirmed', 'cancelled']),
        reimbursed_by_CAS: Math.random() < 0.5
      });

      await Availability.create({
        id: uuidv4(),
        doctor_id: doctor.user_id,
        date,
        start_time,
        end_time,
        appointment_id: appointmentId
      });

      const historyId = uuidv4();
      await MedicalHistory.create({
        id: historyId,
        patient_id: patient.user_id,
        doctor_id: doctor.user_id,
        diagnosis: `Diagnostic ${i + 1}`,
        notes: 'Note sample'
      });

      await Prescription.create({
        id: uuidv4(),
        medical_history_id: historyId,
        content: {
          meds: ['Med1', 'Med2'],
          instructions: 'Take 1 daily'
        }
      });

      totalPrescriptions++;
    }
  }

  console.log(`Scriptul a fost executat cu succes`);
  console.log(`Au fost ad ${patients.length} pacienti, ${doctors.length} doctori si ${totalPrescriptions} retete`);
  await connection.close();
})();
