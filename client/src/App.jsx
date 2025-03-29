import React from "react";
import { Routes, Route } from "react-router-dom";
import "@styles/base/Index.css";

import {
  AuthPage,
  TermsAndConditions,
} from "./pages/general";

import {
  DashboardDoctor,
  DoctorAppointments,
  MedicalRecords,
  PatientsList,
  PatientDetails,
} from "./pages/doctor";

import { DashboardPatient } from "./pages/patient";

import { DashboardAdmin } from "./pages/admin";

import {
  MyNotifications,
  DoctorsBySpecialty,
  SpecialtyList,
} from "./pages/common";

import RedirectToRoleDashboard from "./components/RedirectToRoleDashboard";

const App = () => {
  return (
    <Routes>
      {/* General */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<RedirectToRoleDashboard />} />
      <Route path="/terms" element={<TermsAndConditions />} />

      {/* Doctor */}
      <Route path="/dashboard-doctor" element={<DashboardDoctor />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/doctor/patient/:id/records" element={<MedicalRecords />} />
      <Route path="/doctor/patients" element={<PatientsList />} />
      <Route path="/doctor/patient/:id" element={<PatientDetails />} />

      {/* Patient */}
      <Route path="/dashboard-patient" element={<DashboardPatient />} />

      {/* Admin */}
      <Route path="/dashboard-admin" element={<DashboardAdmin />} />

      {/* Common */}
      <Route path="/notifications" element={<MyNotifications />} />
      <Route path="/specialties" element={<SpecialtyList />} />
      <Route path="/doctor/specialties/:specialtyId" element={<DoctorsBySpecialty />} />
      </Routes>
  );
};

export default App;
