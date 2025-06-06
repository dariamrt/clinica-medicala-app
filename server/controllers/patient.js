const { Patient, MedicalHistory, Prescription, Doctor, User, Appointment } = require("../models");

const getAllPatients = async (req, res) => {
    try {
      const patients = await Patient.findAll({
        attributes: ["user_id", "first_name", "last_name", "CNP", "gender", "phone_number", "address"],
        include: {
          model: User,
          attributes: ["email"]
        }
      });
  
      const formatted = patients.map((p) => ({
        ...p.toJSON(),
        email: p.User?.email || null
      }));
  
      res.status(200).json(formatted);
    } catch (error) {
      res.status(500).json({ message: "Error fetching patients!" });
    }
  };
  

const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const patient = await Patient.findByPk(id, {
            attributes: ["user_id", "first_name", "last_name", "CNP", "gender", "phone_number", "address"],
            include: {
              model: User,
              attributes: ["email"]
            }
          });          

        if (!patient) {
            return res.status(404).json({ message: "Patient not found!" });
        }

        res.status(200).json({
            ...patient.toJSON(),
            email: patient.User?.email || null
          });          
    } catch (error) {
        res.status(500).json({ message: "Error fetching patient!" });
    }
};

const getPatientMedicalHistory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const history = await MedicalHistory.findAll({
            where: { patient_id: id },
            attributes: ["id", "diagnosis", "doctor_id", "notes", "createdAt", "updatedAt"],
            include: {
                model: Doctor,
                attributes: ["first_name", "last_name"]
            },
            order: [["createdAt", "DESC"]]
        });

        const formattedHistory = history.map(record => ({
            id: record.id,
            diagnosis: record.diagnosis,
            description: record.notes || '',
            date: record.createdAt,
            doctor_id: record.doctor_id,
            doctor_name: record.Doctors_Datum ? `${record.Doctors_Datum.first_name} ${record.Doctors_Datum.last_name}` : 'Necunoscut'
        }));

        res.status(200).json(formattedHistory);
    } catch (error) {
        console.error("Error fetching medical history: ", error);
        res.status(500).json({ message: "Error fetching medical history!", error: error.message });
    }
};

const getPatientPrescriptions = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid patient ID format!" });
        }

        const prescriptions = await Prescription.findAll({
            include: {
                model: MedicalHistory,
                where: { patient_id: id },
                attributes: ["id", "diagnosis", "doctor_id"],
            },
        });

        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patient's prescriptions!" });
    }
};

const addMedicalNote = async (req, res) => {
    try {
        const { patient_id, doctor_id, diagnosis, prescription_id, notes } = req.body;

        if (!patient_id || !doctor_id || !diagnosis) {
            return res.status(400).json({ message: "All required fields must be filled!" });
        }

        const patientExists = await Patient.findByPk(patient_id);
        if (!patientExists) return res.status(404).json({ message: "Patient not found!" });

        const doctorExists = await Doctor.findByPk(doctor_id);
        if (!doctorExists) return res.status(404).json({ message: "Doctor not found!" });

        const newRecord = await MedicalHistory.create({
            patient_id,
            doctor_id,
            diagnosis,
            prescription_id: prescription_id || null,
            record_date: new Date(),
            notes,
        });

        res.status(201).json({ message: "Medical note added!", record: newRecord });
    } catch (error) {
        res.status(500).json({ message: "Error adding medical note!" });
    }
};

const addPrescription = async (req, res) => {
    try {
        const { medical_history_id, content } = req.body;

        if (!medical_history_id || !content) {
            return res.status(400).json({ message: "Medical history ID and prescription content are required!" });
        }

        const medicalHistory = await MedicalHistory.findByPk(medical_history_id);
        if (!medicalHistory) {
            return res.status(404).json({ message: "Medical history record not found!" });
        }

        const newPrescription = await Prescription.create({
            content,
            medical_history_id,
        });

        res.status(201).json({ message: "Prescription successfully added!", prescription: newPrescription });
    } catch (error) {
        res.status(500).json({ message: "Error creating prescription!" });
    }
};

const getPatientAppointments = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid patient ID format!" });
        }

        const patient = await Patient.findOne({ where: { user_id: id } });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found!" });
        }

        const appointments = await Appointment.findAll({
            where: { patient_id: id },
            attributes: ["id", "doctor_id", "date", "start_time", "end_time", "status"],
            include: [
                {
                    model: Doctor,
                    attributes: ["user_id", "first_name", "last_name"], 
                }
            ],
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patient's appointments!" });
    }
};

const getAppointmentsForCurrentPatient = async (req, res) => {
    try {
      const patientId = req.user.id;
  
      const appointments = await Appointment.findAll({
        where: { patient_id: patientId },
        include: [
          {
            model: Doctor,
            attributes: ["first_name", "last_name"]
          }
        ],
        order: [["date", "DESC"]]
      });
  
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching patient's appointments!" });
    }
};
  
 
const getMyMedicalHistory = async (req, res) => {
  try {
    const patientId = req.user.id;

    const history = await MedicalHistory.findAll({
      where: { patient_id: patientId },
      attributes: ["id", "diagnosis", "doctor_id", "notes", "createdAt", "updatedAt"],
      include: [
        {
          model: Prescription,
          attributes: ["id", "content"]
        }
      ],
      raw: true,
      nest: true
    });

    const doctorIds = [...new Set(history.map(h => h.doctor_id))];

    const doctors = await Doctor.findAll({
      where: { user_id: doctorIds },
      attributes: ["user_id", "first_name", "last_name"]
    });

    const doctorMap = Object.fromEntries(
      doctors.map(doc => [doc.user_id, { first_name: doc.first_name, last_name: doc.last_name }])
    );

    const enrichedHistory = history.map(h => ({
      ...h,
      Doctor: doctorMap[h.doctor_id] || null
    }));

    res.status(200).json(enrichedHistory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your medical history.", error: error.message });
  }
};


const getMyPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.id;

    const prescriptions = await Prescription.findAll({
      include: {
        model: MedicalHistory,
        where: { patient_id: patientId },
        attributes: ["id", "diagnosis", "doctor_id"],
        include: [
          {
            model: Doctor,
            attributes: ["first_name", "last_name"]
          },
          {
            model: Patient,
            attributes: ["first_name", "last_name", "address", "CNP"]
          }
        ]
      },
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Error fetching your prescriptions.", error: error.message });
  }
};

  
module.exports = { 
    getAllPatients, 
    getPatientById, 
    getPatientMedicalHistory, 
    getPatientPrescriptions,
    addMedicalNote,
    addPrescription,
    getPatientAppointments,
    getAppointmentsForCurrentPatient,
    getMyMedicalHistory,
    getMyPrescriptions
};
