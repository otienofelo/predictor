import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Dashboard
import Dashboard from "./features/dashboard/Dashboard";

// Farmers
import FarmerList from "./features/farmers/FarmerList";
import FarmerRegistration from "./features/farmers/FarmerRegistration";
import FarmerDetail from "./features/farmers/FarmerDetail";

// Animals
import AnimalTable from "./features/animals/AnimalTable";
import AnimalDetail from "./features/animals/AnimalDetail";
import AnimalForm from "./features/animals/AnimalForm";

// Diagnosis
import SymptomChecker from "./features/diagnosis/SymptomChecker";

// Health Records
import VisitHistory from "./features/health-records/VisitHistory";
import VisitDetail from "./features/health-records/VisitDetail";

// Disease Library
import DiseaseList from "./features/disease-library/DiseaseList";
import DiseaseForm from "./features/disease-library/DiseaseForm";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Farmers */}
      <Route path="farmers">
        <Route index element={<FarmerList />} />
        <Route path="new" element={<FarmerRegistration />} />
        <Route path=":farmerId" element={<FarmerDetail />} />
        <Route path=":farmerId/edit" element={<FarmerRegistration />} />
      </Route>

      {/* Animals */}
      <Route path="animals">
        <Route index element={<AnimalTable />} />
        <Route path=":animalId" element={<AnimalDetail />} />
        <Route path=":animalId/edit" element={<AnimalTable />} />
        <Route path="new" element={<AnimalForm />} />
      </Route>

      {/* Diagnosis */}
      <Route path="diagnosis">
        <Route index element={<SymptomChecker />} />
        <Route path="results" element={<SymptomChecker />} />
      </Route>

      {/* Health Records */}
      <Route path="records">
        <Route index element={<VisitHistory />} />
        <Route path=":animalId" element={<VisitHistory />} />
        <Route path=":id" element={<VisitDetail />} />
      </Route>

      {/* Disease Library */}
      <Route path="diseases">
        <Route index element={<DiseaseList />} />
        <Route path="new" element={<DiseaseForm />} />
        <Route path=":id/edit" element={<DiseaseForm />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;