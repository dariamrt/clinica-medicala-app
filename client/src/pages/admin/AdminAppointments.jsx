import React, { useEffect, useState } from "react";
import { AppointmentService, AvailabilityService } from "@services";
import { DoctorService } from "@services";
import { Calendar } from "react-calendar";
import { ArrowLeft, Plus, Edit, Trash2, X } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import "@styles/pages/Appointments.css";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({
    doctor_id: "",
    date: "",
    start_time: "",
    end_time: "",
    reimbursed_by_CAS: false,
    new_availability_id: "",
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appts = await AppointmentService.getAllAppointments();
        setAppointments(appts);

        const doctorsData = await DoctorService.getAllDoctors();
        setDoctors(doctorsData);

        const availsData = await AvailabilityService.getAllAvailabilities();
        setAvailabilities(availsData);
      } catch (error) {
        console.error("Eroare la preluare date:", error);
        setError("Nu s-au putut încărca datele.");
      }
    };

    fetchData();
  }, []);

  const getTileClassName = ({ date }) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    const hasAppointment = appointments.some(appointment => 
      appointment.date === formattedDate
    );
    
    const hasAvailability = availabilities.some(availability => 
      availability.date === formattedDate && availability.appointment_id === null
    );
    
    if (hasAppointment && hasAvailability) {
      return "has-appointment has-availability";
    } else if (hasAppointment) {
      return "has-appointment";
    } else if (hasAvailability) {
      return "has-availability";
    }
    
    return null;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedItem(null);
  };

  const appointmentsOnSelectedDate = appointments.filter(appointment => 
    appointment.date === selectedDate.toISOString().split('T')[0]
  ).filter(appt => {
    if (!searchTerm) return true;
    
    const doctorName = `${appt?.Doctors_Datum?.first_name ?? ""} ${appt?.Doctors_Datum?.last_name ?? ""}`;
    const patientName = `${appt?.Patients_Datum?.first_name ?? ""} ${appt?.Patients_Datum?.last_name ?? ""}`;
    const status = appt?.status ?? "";
    
    return (
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const availabilitiesOnSelectedDate = availabilities.filter(availability => 
    availability.date === selectedDate.toISOString().split('T')[0] && availability.appointment_id === null
  );

  const handleItemClick = (item, type) => {
    setSelectedItem({ ...item, type });
  };

  const openCreateModal = () => {
    setFormData({
      doctor_id: "",
      date: selectedDate.toISOString().split('T')[0],
      start_time: "",
      end_time: "",
      reimbursed_by_CAS: false,
    });
    setModalType("create");
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    if (!selectedItem) return;

    if (selectedItem.type === "appointment") {
      const loadAvailableSlots = async () => {
        try {
          const doctorId = selectedItem.doctor_id || selectedItem.Doctors_Datum?.user_id;
          if (!doctorId) {
            setAvailableSlots([]);
            setError("ID-ul doctorului nu a putut fi determinat.");
            return;
          }

          const availableTimesData = await AvailabilityService.getDoctorAvailability(doctorId);
          setAvailableSlots(availableTimesData);

          
          setFormData({
            appointment_id: selectedItem.id,
            new_availability_id: "",
          });
          setModalType("edit-appointment");
          setIsModalOpen(true);
        } catch (error) {
          console.error("Error loading available slots:", error);
          setError("Nu s-au putut încărca sloturile disponibile.");
        }
      };
      
      loadAvailableSlots();
    } else if (selectedItem.type === "availability") {
      setFormData({
        availability_id: selectedItem.id,
        doctor_id: selectedItem.doctor_id,
        date: selectedItem.date,
        start_time: selectedItem.start_time.slice(0, 5),
        end_time: selectedItem.end_time.slice(0, 5),
      });
      setModalType("edit-availability");
      setIsModalOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (modalType === "create") {
        const { doctor_id, date, start_time, end_time } = formData;
        console.log("Trimitem:", { doctor_id, date, start_time, end_time });
        await AvailabilityService.addAvailability({ doctor_id, date, start_time, end_time });

        
        const availsData = await AvailabilityService.getAllAvailabilities();
        setAvailabilities(availsData);
      } else if (modalType === "edit-appointment") {
        await AppointmentService.updateAppointment(formData.appointment_id, { new_availability_id: formData.new_availability_id });
        
        const appts = await AppointmentService.getAllAppointments();
        setAppointments(appts);
        
        const availsData = await AvailabilityService.getAllAvailabilities();
        setAvailabilities(availsData);
      } else if (modalType === "edit-availability") {
        await AvailabilityService.updateAvailability(formData.availability_id, {
          date: formData.date,
          start_time: formData.start_time,
          end_time: formData.end_time,
        });
        
        const availsData = await AvailabilityService.getAllAvailabilities();
        setAvailabilities(availsData);
      }

      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || "A apărut o eroare.");
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      if (selectedItem.type === "appointment") {
        await AppointmentService.cancelAppointment(selectedItem.id);
        
        const appts = await AppointmentService.getAllAppointments();
        setAppointments(appts);
      } else if (selectedItem.type === "availability") {
        await AvailabilityService.deleteAvailability(selectedItem.id);
        
        const availsData = await AvailabilityService.getAllAvailabilities();
        setAvailabilities(availsData);
      }

      setSelectedItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      setError(error.message || "A apărut o eroare la ștergere.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
        <h2 className="page-title">Administrare programări și disponibilități</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="search-container">
          <input
            type="text"
            placeholder="Caută după pacient, doctor sau status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="calendar-layout">
          <div className="calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={getTileClassName}
            />

            <div className="date-appointments">
              <div className="appointment-header">
                <h3>Programări pe {selectedDate.toLocaleDateString('ro-RO')}</h3>
                <button 
                  className="add-btn" 
                  onClick={openCreateModal}
                  title="Adaugă disponibilitate nouă"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              {appointmentsOnSelectedDate.length === 0 ? (
                <p className="no-appointments">Nu există programări pentru această zi.</p>
              ) : (
                <ul className="appointment-list">
                  {appointmentsOnSelectedDate.map((appointment) => (
                    <li 
                      key={`appointment-${appointment.id}`} 
                      className={`appointment-list-item ${selectedItem && selectedItem.id === appointment.id && selectedItem.type === 'appointment' ? 'selected' : ''}`}
                      onClick={() => handleItemClick(appointment, 'appointment')}
                    >
                      <span className="appointment-time">
                        {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}
                      </span>
                      <span className="appointment-doctor">
                        Dr. {appointment.Doctors_Datum?.first_name} {appointment.Doctors_Datum?.last_name} | 
                        Pacient: {appointment.Patient_Datum?.first_name} {appointment.Patients_Datum?.last_name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              
              <h3 style={{ marginTop: "20px" }}>Disponibilități pe {selectedDate.toLocaleDateString('ro-RO')}</h3>
              {availabilitiesOnSelectedDate.length === 0 ? (
                <p className="no-appointments">Nu există disponibilități pentru această zi.</p>
              ) : (
                <ul className="appointment-list">
                  {availabilitiesOnSelectedDate.map((availability) => (
                    <li 
                      key={`availability-${availability.id}`} 
                      className={`appointment-list-item availability-item ${selectedItem && selectedItem.id === availability.id && selectedItem.type === 'availability' ? 'selected' : ''}`}
                      onClick={() => handleItemClick(availability, 'availability')}
                    >
                      <span className="appointment-time">
                        {availability.start_time.slice(0, 5)} - {availability.end_time.slice(0, 5)}
                      </span>
                      <span className="appointment-doctor">
                        Dr. {doctors.find(d => d.user_id === availability.doctor_id)?.first_name} {doctors.find(d => d.user_id === availability.doctor_id)?.last_name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="appointment-details">
            {selectedItem ? (
              <div className="appointment-detail-card">
                <h3>{selectedItem.type === 'appointment' ? 'Detalii programare' : 'Detalii disponibilitate'}</h3>
                
                {selectedItem.type === 'appointment' && (
                  <>
                    <p><strong>Pacient:</strong> {selectedItem.Patients_Datum?.first_name} {selectedItem.Patients_Datum?.last_name}</p>
                    <p><strong>Email pacient:</strong> {selectedItem.Patients_Datum?.User?.email}</p>
                    <p><strong>Doctor:</strong> Dr. {selectedItem.Doctors_Datum?.first_name} {selectedItem.Doctors_Datum?.last_name}</p>
                    <p><strong>Email doctor:</strong> {selectedItem.Doctors_Datum?.User?.email}</p>
                    <p><strong>Status:</strong> <span className={`status ${selectedItem.status}`}>{selectedItem.status}</span></p>
                    <p><strong>Compensat CAS:</strong> {selectedItem.reimbursed_by_CAS ? 'Da' : 'Nu'}</p>
                  </>
                )}
                
                {selectedItem.type === 'availability' && (
                  <>
                    <p><strong>Doctor:</strong> Dr. {doctors.find(d => d.user_id === selectedItem.doctor_id)?.first_name} {doctors.find(d => d.user_id === selectedItem.doctor_id)?.last_name}</p>
                  </>
                )}
                
                <p><strong>Data:</strong> {selectedItem.date}</p>
                <p><strong>Interval orar:</strong> {selectedItem.start_time?.slice(0, 5)} - {selectedItem.end_time?.slice(0, 5)}</p>
                
                <div className="action-buttons">
                  <button className="edit-btn" onClick={openEditModal}>
                    <Edit size={16} /> Editează
                  </button>
                  <button className="delete-btn" onClick={handleDelete}>
                    <Trash2 size={16} /> Șterge
                  </button>
                </div>
              </div>
            ) : (
              <div className="appointment-details-placeholder">
                <h3>Detalii</h3>
                <p className="no-selection">Selectează o programare sau disponibilitate pentru a vedea detaliile.</p>
              </div>
            )}
          </div>
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-color appointment-legend"></span>
            <span>Programare</span>
          </div>
          <div className="legend-item">
            <span className="legend-color availability-legend"></span>
            <span>Disponibilitate</span>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>
                  {modalType === "create" ? "Adaugă disponibilitate" : 
                   modalType === "edit-appointment" ? "Editează programare" : 
                   "Editează disponibilitate"}
                </h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                {modalType === "create" && (
                  <>
                    <div className="form-group">
                      <label>Doctor</label>
                      <select 
                        name="doctor_id" 
                        value={formData.doctor_id} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Selectează doctor</option>
                          {doctors.map(doctor => (
                            <option key={doctor.user_id} value={doctor.user_id}>
                              Dr. {doctor.first_name} {doctor.last_name}
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Data</label>
                      <input 
                        type="date" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Ora de început</label>
                      <input 
                        type="time" 
                        name="start_time" 
                        value={formData.start_time} 
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Ora de sfârșit</label>
                      <input 
                        type="time" 
                        name="end_time" 
                        value={formData.end_time} 
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}

                {modalType === "edit-appointment" && (
                  <div className="form-group">
                    <label>Selectează noua disponibilitate</label>
                    <select 
                      name="new_availability_id" 
                      value={formData.new_availability_id} 
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selectează disponibilitate</option>
                  {availableSlots.length === 0 ? (
                    <option disabled value="">Nu există sloturi disponibile</option>
                  ) : (
                    availableSlots.map((slot, index) => (
                      <option
                        key={`${slot.id ?? `${slot.date}-${slot.start_time}-${slot.end_time}-${index}`}`}
                        value={slot.id}
                      >
                        {slot.date} | {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)} | 
                        Dr. {doctors.find(d => d.user_id === slot.doctor_id)?.first_name} {doctors.find(d => d.user_id === slot.doctor_id)?.last_name}
                      </option>
                    ))
                  )}

                    </select>
                  </div>
                )}

                {modalType === "edit-availability" && (
                  <>
                    <div className="form-group">
                      <label>Data</label>
                      <input 
                        type="date" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Ora de început</label>
                      <input 
                        type="time" 
                        name="start_time" 
                        value={formData.start_time} 
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Ora de sfârșit</label>
                      <input 
                        type="time" 
                        name="end_time" 
                        value={formData.end_time} 
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}
                
                <div className="form-actions">
                  <button type="button" onClick={() => setIsModalOpen(false)}>Anulează</button>
                  <button type="submit" className="primary-btn">Salvează</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <button className="back-btn" onClick={() => window.history.back()}>
          <ArrowLeft size={18} /> Înapoi
        </button>
      </div>
    </div>
  );
};

export default AdminAppointments;