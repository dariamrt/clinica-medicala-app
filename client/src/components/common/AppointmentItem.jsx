import { useEffect, useState } from "react";
import { AuthService } from "@services";
import { PatientAppointmentItem, DoctorAppointmentItem, AdminAppointmentItem } from "@components";
import "@styles/components/AppointmentItem.css";

const AppointmentItem = (props) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setRole(user.role);
      } catch (error) {
        console.error("Eroare la determinarea rolului:", error);
      }
    };
    fetchRole();
  }, []);

  if (!role) return null;

  if (role === "doctor") return <DoctorAppointmentItem appointment={props.appointment} />;
  if (role === "patient") return <PatientAppointmentItem {...props} />;
  if (role === "admin") return <AdminAppointmentItem appointment={props.appointment} />;
  return null;
};

export default AppointmentItem;
