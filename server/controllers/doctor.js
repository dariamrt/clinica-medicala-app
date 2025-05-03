const { Doctor, Specialty, Patient, Appointment, User } = require("../models");

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      attributes: ["user_id", "first_name", "last_name", "phone_number", "salary"],
      include: [
        {
          model: User,
          attributes: ["email"]
        },
        {
          model: Specialty,
          attributes: ["name"]
        }
      ]
    });

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors!" });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id, {
      attributes: ["user_id", "first_name", "last_name", "phone_number", "salary", "specialty_id"],
      include: [
        {
          model: User,
          attributes: ["email"]
        },
        {
          model: Specialty,
          attributes: ["name"]
        }
      ]
    });

    if (!doctor) return res.status(404).json({ message: "Doctor not found!" });

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor!" });
  }
};

const getDoctorsBySpecialty = async (req, res) => {
    try {
      const { specialty_id } = req.params;
      const isAdmin = req.user?.role === "admin";
  
      const doctors = await Doctor.findAll({
        where: { specialty_id },
        attributes: isAdmin
          ? ["user_id", "first_name", "last_name", "phone_number", "salary"]
          : ["user_id", "first_name", "last_name", "phone_number"],
        include: [
          {
            model: Specialty,
            attributes: ["name"],
          },
          {
            model: User,
            attributes: ["email"],
          },
        ],
      });
  
      if (!doctors.length) {
        return res.status(404).json({ message: "No doctors found for this specialty!" });
      }
  
      const formatted = doctors.map((doc) => ({
        ...doc.toJSON(),
        specialty_name: doc.Specialty?.name || "Nespecificat",
        email: doc.User?.email || null,
      }));
  
      res.status(200).json(formatted);
    } catch (error) {
      console.error("Error fetching doctors by specialty:", error);
      res.status(500).json({ message: "Error fetching doctors by specialty!" });
    }
};

const getDoctorAppointments = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid doctor ID format!" });
        }

        const doctor = await Doctor.findOne({ where: { user_id: id } });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found!" });
        }

        const appointments = await Appointment.findAll({
            where: { doctor_id: id },
            attributes: ["id", "patient_id", "date", "start_time", "end_time", "status"],
            include: [
                {
                    model: Patient,
                    as: "Patients_Datum",
                    attributes: ["first_name", "last_name"],
                    include: [
                        {
                            model: User,
                            attributes: ["email"],
                        }
                    ]
                }
            ],
        });
            

        res.status(200).json(appointments);
    } catch (error) {
        // console.error("Error fetching doctor's appointments:", error);
        res.status(500).json({ message: "Error fetching doctor's appointments!" });
    }
};

const getAppointmentsForCurrentDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const appointments = await Appointment.findAll({
      where: { doctor_id: doctorId },
      include: [
        {
          model: Patient,
          attributes: ["first_name", "last_name"],
          include: {
            model: User,
            attributes: ["email"],
          }
        }
      ],
      order: [["date", "DESC"]]
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Doctor appointment error:", error);
    res.status(500).json({ message: "Error fetching doctor's appointments!" });
  }
};
  
module.exports = { 
    getAllDoctors, 
    getDoctorById, 
    getDoctorsBySpecialty,
    getDoctorAppointments,
    getAppointmentsForCurrentDoctor 
};
