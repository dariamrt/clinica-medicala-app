const {
  User, Doctor, Patient, Specialty,
  Appointment, Availability, MedicalHistory,
  Prescription, Notification, AdminReport, connection
} = require('./models');

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const specialtyNames = [
  'Cardiologie',
  'Ortopedie', 
  'Dermatologie',
  'Psihiatrie',
  'Ginecologie',
  'Oncologie',
  'Reumatologie',
  'Pneumologie'
];

const firstNames = [
  'Ion', 'Marian', 'Teodor', 'Alin', 'Andrei', 'Elena', 'Andreea', 'Ioana', 
  'Vlad', 'Radu', 'Nicolae', 'Florin', 'Laura', 'Cristina', 'Sorin', 'Camelia', 
  'Roxana', 'Bianca', 'Larisa', 'Denisa', 'Denis', 'Valeriu', 'Valentin', 
  'Iulian', 'Iulia', 'Viorel', 'Violeta', 'Evelina', 'Crina', 'Georgiana', 'George'
];

const lastNames = [
  'Popescu', 'Popa', 'Ionescu', 'Marinescu', 'Dumitru', 'Radu', 'Stan', 
  'Dobre', 'Stoica', 'Enache', 'Sandu', 'Neagu', 'Toma', 'Mocanu'
];

const diagnoses = [
  'Hipertensiune arteriala',
  'Diabet zaharat tip 2',
  'Astm bronsic',
  'Gastrita cronica',
  'Migrena',
  'Artrita reumatoida',
  'Depresie',
  'Anxietate generalizata',
  'Otita media',
  'Pneumonie',
  'Insuficienta cardiaca',
  'Fractura',
  'Dermatita atopica',
  'Sindrom colon iritabil'
];

const medications = [
  'Aspirina 75mg',
  'Paracetamol 500mg',
  'Ibuprofen 400mg',
  'Amoxicilina 500mg',
  'Metformin 500mg',
  'Losartan 50mg',
  'Simvastatina 20mg',
  'Omeprazol 20mg',
  'Diazepam 5mg',
  'Cetirizina 10mg'
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTimeSlot() {
  const hour = 8 + Math.floor(Math.random() * 10);
  const start = `${hour.toString().padStart(2, '0')}:00:00`;
  const end = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
  return [start, end];
}

function randomFutureDate(minDaysAhead = 3, maxDaysAhead = 60) {
  const date = new Date();
  const daysAhead = minDaysAhead + Math.floor(Math.random() * (maxDaysAhead - minDaysAhead));
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

function randomPastDate(maxDaysBack = 180) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * maxDaysBack));
  return date.toISOString().split('T')[0];
}

function randomPastDateInLast6Months() {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 180));
  return date.toISOString().split('T')[0];
}

function generatePhoneNumber() {
  return `07${Math.floor(10000000 + Math.random() * 89999999)}`;
}

function generateCNP(index) {
  const baseNumber = 1000000000000 + index;
  return baseNumber.toString().padStart(13, '0');
}

function generateEmail(firstName, lastName, role, index) {
  const cleanFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLastName = lastName.toLowerCase().replace(/[^a-z]/g, '');
  return `${cleanFirstName}.${cleanLastName}${index}@${role === 'doctor' ? 'medaria' : 'gmail'}.ro`;
}

function generateStrongPassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  password += getRandomItem('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  password += getRandomItem('abcdefghijklmnopqrstuvwxyz');
  password += getRandomItem('!@#$%^&*');
  
  for (let i = 0; i < 5; i++) {
    password += getRandomItem(chars);
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

function generatePrescriptionContent() {
  const numMeds = 1 + Math.floor(Math.random() * 3);
  const meds = [];
  for (let i = 0; i < numMeds; i++) {
    meds.push(getRandomItem(medications));
  }
  
  const instructions = [
    'Administrare o data pe zi dimineata',
    'Administrare de 2 ori pe zi la mese',
    'Administrare de 3 ori pe zi',
    'Administrare seara inainte de culcare',
    'Administrare la nevoie, maxim 3 doze pe zi'
  ];
  
  return {
    meds: meds,
    instructions: getRandomItem(instructions)
  };
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
  for (const name of specialtyNames) {
    specialties.push(await Specialty.create({
      id: uuidv4(),
      name: name
    }));
  }

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const adminUser = await User.create({
    id: uuidv4(),
    email: 'admin@medaria.ro',
    password: adminPassword,
    role: 'admin'
  });

  const doctors = [];
  let doctorIndex = 1;
  for (const specialty of specialties) {
    for (let i = 0; i < 3; i++) {
      const userId = uuidv4();
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      const plainPassword = generateStrongPassword();
      const doctorPassword = await bcrypt.hash(plainPassword, 10);
      
      const user = await User.create({
        id: userId,
        email: generateEmail(firstName, lastName, 'doctor', doctorIndex),
        password: doctorPassword,
        role: 'doctor'
      });

      const doctor = await Doctor.create({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        specialty_id: specialty.id,
        phone_number: generatePhoneNumber(),
        salary: 5000 + Math.floor(Math.random() * 5000)
      });

      doctors.push({ user, doctor, specialty, plainPassword });
      doctorIndex++;
    }
  }

  const patients = [];
  for (let i = 1; i <= 150; i++) {
    const userId = uuidv4();
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const plainPassword = generateStrongPassword();
    const patientPassword = await bcrypt.hash(plainPassword, 10);
    
    const user = await User.create({
      id: userId,
      email: generateEmail(firstName, lastName, 'patient', i),
      password: patientPassword,
      role: 'patient'
    });

    const patient = await Patient.create({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      CNP: generateCNP(i),
      gender: getRandomItem(['male', 'female', 'other']),
      phone_number: generatePhoneNumber(),
      address: `Strada ${getRandomItem(lastNames)} nr. ${i}`
    });

    patients.push({ user, patient, plainPassword });
  }

  const chosenPatientIndex = Math.floor(Math.random() * patients.length);
  const chosenPatient = patients[chosenPatientIndex];
  const chosenDoctorIndex = Math.floor(Math.random() * doctors.length);
  const chosenDoctor = doctors[chosenDoctorIndex];
  
  const availabilities = [];
  const usedSlots = new Set();

  for (let i = 0; i < 50; i++) {
    let doctor, date, start_time, end_time, key;
    let attempts = 0;
    
    do {
      doctor = getRandomItem(doctors);
      date = randomFutureDate();
      [start_time, end_time] = randomTimeSlot();
      key = `${doctor.doctor.user_id}-${date}-${start_time}-${end_time}`;
      attempts++;
      if (attempts > 100) break;
    } while (usedSlots.has(key));
    
    if (attempts <= 100) {
      usedSlots.add(key);
      const availability = await Availability.create({
        id: uuidv4(),
        doctor_id: doctor.doctor.user_id,
        date,
        start_time,
        end_time,
        appointment_id: null
      });
      availabilities.push(availability);
    }
  }

  let appointmentCount = 0;
  const appointments = [];

  for (let i = 0; i < 15; i++) {
    const patient = i < 2 ? chosenPatient : getRandomItem(patients);
    let doctor = getRandomItem(doctors);
    
    if (i < 7) {
      doctor = chosenDoctor;
    }
    
    let date, start_time, end_time, key;
    let attempts = 0;
    
    do {
      date = randomFutureDate();
      [start_time, end_time] = randomTimeSlot();
      key = `${doctor.doctor.user_id}-${date}-${start_time}-${end_time}`;
      attempts++;
      if (attempts > 100) break;
    } while (usedSlots.has(key));
    
    if (attempts <= 100) {
      usedSlots.add(key);
      
      const appointmentId = uuidv4();
      const appointment = await Appointment.create({
        id: appointmentId,
        patient_id: patient.patient.user_id,
        doctor_id: doctor.doctor.user_id,
        date,
        start_time,
        end_time,
        status: 'confirmed',
        reimbursed_by_CAS: Math.random() < 0.5
      });

      const availability = await Availability.create({
        id: uuidv4(),
        doctor_id: doctor.doctor.user_id,
        date,
        start_time,
        end_time,
        appointment_id: appointmentId
      });

      appointments.push(appointment);
      appointmentCount++;
    }
  }

  for (let i = 0; i < 150; i++) {
    const patient = getRandomItem(patients);
    const doctor = getRandomItem(doctors);
    
    let date, start_time, end_time, key;
    let attempts = 0;
    
    do {
      date = randomPastDateInLast6Months();
      [start_time, end_time] = randomTimeSlot();
      key = `${doctor.doctor.user_id}-${date}-${start_time}-${end_time}`;
      attempts++;
      if (attempts > 100) break;
    } while (usedSlots.has(key));
    
    if (attempts <= 100) {
      usedSlots.add(key);
      
      const appointmentId = uuidv4();
      const status = Math.random() < 0.8 ? 'confirmed' : 'cancelled';
      const appointment = await Appointment.create({
        id: appointmentId,
        patient_id: patient.patient.user_id,
        doctor_id: doctor.doctor.user_id,
        date,
        start_time,
        end_time,
        status,
        reimbursed_by_CAS: Math.random() < 0.5
      });

      const availability = await Availability.create({
        id: uuidv4(),
        doctor_id: doctor.doctor.user_id,
        date,
        start_time,
        end_time,
        appointment_id: appointmentId
      });

      appointments.push(appointment);
      appointmentCount++;
    }
  }

  const medicalHistories = [];
  for (let i = 0; i < 3; i++) {
    const historyId = uuidv4();
    const history = await MedicalHistory.create({
      id: historyId,
      patient_id: chosenPatient.patient.user_id,
      doctor_id: chosenDoctor.doctor.user_id,
      diagnosis: getRandomItem(diagnoses),
      notes: 'Pacient prezentat pentru consultatie. Examinare clinica completa efectuata.'
    });
    medicalHistories.push(history);
  }

  for (let i = 0; i < 22; i++) {
    const patient = i < 22 ? getRandomItem(patients) : chosenPatient;
    const doctor = getRandomItem(doctors);
    
    const historyId = uuidv4();
    const history = await MedicalHistory.create({
      id: historyId,
      patient_id: patient.patient.user_id,
      doctor_id: doctor.doctor.user_id,
      diagnosis: getRandomItem(diagnoses),
      notes: 'Consultatie medicala de rutina. Evolutie favorabila.'
    });
    medicalHistories.push(history);
  }

  for (let i = 0; i < 2; i++) {
    await Prescription.create({
      id: uuidv4(),
      medical_history_id: medicalHistories[i].id,
      content: generatePrescriptionContent()
    });
  }

  for (let i = 0; i < 18; i++) {
    const historyIndex = 3 + i;
    if (historyIndex < medicalHistories.length) {
      await Prescription.create({
        id: uuidv4(),
        medical_history_id: medicalHistories[historyIndex].id,
        content: generatePrescriptionContent()
      });
    }
  }

  console.log(`Scriptul a fost executat cu succes`);
  console.log(`Au fost adaugati ${patients.length} pacienti, ${doctors.length} doctori`);
  console.log(`Au fost create ${specialties.length} specializari`);
  console.log(`Au fost create ${availabilities.length} disponibilitati libere`);
  console.log(`Au fost create ${appointmentCount} programari`);
  console.log(`Au fost create ${medicalHistories.length} istorii medicale`);
  console.log(`Au fost create 20 retete`);
  console.log(`\n=== DATE DE CONECTARE ===`);
  console.log(`ADMIN:`);
  console.log(`Email: admin@medaria.ro`);
  console.log(`Parola: Admin123!`);
  console.log(`\nPACIENTUL ALES:`);
  console.log(`Nume: ${chosenPatient.patient.first_name} ${chosenPatient.patient.last_name}`);
  console.log(`Email: ${chosenPatient.user.email}`);
  console.log(`Parola: ${chosenPatient.plainPassword}`);
  console.log(`\nDOCTORUL ALES:`);
  console.log(`Nume: ${chosenDoctor.doctor.first_name} ${chosenDoctor.doctor.last_name}`);
  console.log(`Specializare: ${chosenDoctor.specialty.name}`);
  console.log(`Email: ${chosenDoctor.user.email}`);
  console.log(`Parola: ${chosenDoctor.plainPassword}`);
  
  await connection.close();
})();