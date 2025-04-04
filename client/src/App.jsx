import React from "react";
import { Routes, Route } from "react-router-dom";

import "@styles/base/Index.css";

import {
  AuthPage,
  TermsAndConditions,
  ContactPage,
  GdprPage,
} from "@pages/general";

import {
  DashboardDoctor,
  DoctorAppointments,
  MedicalRecords,
  PatientsList,
  PatientDetails,
} from "@pages/doctor";

import {
  DashboardPatient,
  AppointmentsCreate,
  PatientAppointments,
  PatientMedicalHistory,
  PatientPrescriptions,
} from "@pages/patient";

import {
  MyNotifications,
  DoctorsBySpecialty,
  SpecialtyList,
} from "@pages/common";

import { DashboardAdmin } from "@pages/admin";
import { RedirectToRoleDashboard, ProtectedRoute, Footer } from "@components";
import MainLayout from "./layouts/MainLayout";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/gdpr" element={<GdprPage />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<RedirectToRoleDashboard />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Doctor */}
        <Route path="/dashboard-doctor" element={<DashboardDoctor />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/patient/:id/records" element={<MedicalRecords />} />
        <Route path="/doctor/patients" element={<PatientsList />} />
        <Route path="/doctor/patient/:id" element={<PatientDetails />} />

        {/* Patient */}
        <Route path="/dashboard-patient" element={<DashboardPatient />} />
        <Route path="/patient/appointments/create" element={<AppointmentsCreate />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/patient/medical-history" element={<PatientMedicalHistory />} />
        <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />

        {/* Admin */}
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />

        {/* Common */}
        <Route path="/notifications" element={<MyNotifications />} />
        <Route path="/specialties" element={<SpecialtyList />} />
        <Route path="/doctor/specialties/:specialtyId" element={<DoctorsBySpecialty />} />
      </Route>
    </Routes>
  );
};

export default App;
