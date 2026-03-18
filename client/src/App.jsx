import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout & Route components
import ProtectedRoute from './routes/PrivateRoute';
import Authenticated from './components/layout/Authenticated';

// Public pages
import Landing from "./features/landing/Landing";
import SignIn from './features/auth/SignIn';
import SignUp from './features/auth/SignUp';

// Protected pages
import Dashboard from './features/dashboard/Dashboard';
import FarmerList from './features/farmers/FarmerList';
import FarmerDetail from './features/farmers/FarmerDetail';
import FarmerRegistration from './features/farmers/FarmerRegistration';
import AnimalTable from './features/animals/AnimalTable';
import AnimalForm from './features/animals/AnimalForm';
import SymptomChecker from './features/diagnosis/SymptomChecker';
import VisitHistory from './features/health-records/VisitHistory';
import VisitDetail from './features/health-records/VisitDetail';
import DiseaseList from './features/disease-library/DiseaseList_RBAC';
import DiseaseForm from './features/disease-library/DiseaseForm';
import RoleProtectedRoute from './routes/RoleProtectedRoute';
import AdminUserManager from './features/admin/AdminUserManager';
import VaccinationPage from './features/Vaccinations/VaccinationPage';
import FeedingPage from './features/feeding/FeedingPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />

      {/* All protected routes inside Authenticated layout */}
      <Route
        element={
          <ProtectedRoute>
            <Authenticated />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="farmers">
          <Route index element={<FarmerList />} />
          <Route path="new" element={<FarmerRegistration />} />
          <Route path=":farmerId" element={<FarmerDetail />} />
          <Route path=":farmerId/edit" element={<FarmerRegistration />} />
        </Route>
        <Route path="animals">
          <Route index element={<AnimalTable />} />
          <Route path="new" element={<AnimalForm />} />
          <Route path=":animalId" element={<AnimalDetail />} />  {/* ← ADD THIS */}
          <Route path=":animalId/edit" element={<AnimalForm />} />
        </Route>

        <Route path="diagnosis" element={<SymptomChecker />} />

        <Route path="records">
          <Route index element={<VisitHistory />} />
          <Route path=":id" element={<VisitDetail />} />
        </Route>

        <Route path="diseases">
          <Route index element={<DiseaseList />} />
          <Route path="new" element={<DiseaseForm />} />
          <Route path=":id/edit" element={<DiseaseForm />} />
        </Route>

        <Route path="vaccinations" element={<VaccinationPage />} />
        <Route path="feeding" element={<FeedingPage />} />

        <Route
          path="admin/users"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminUserManager />
            </RoleProtectedRoute>
          }
        />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;