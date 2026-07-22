import { Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/NavbarTest";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home";
import Emergency from "./pages/Emergency";
import WomenSafety from "./pages/WomenSafety";
import WomenSafetyHistory from "./pages/WomenSafetyHistory";
import Police from "./pages/Police";
import PoliceDashboard from "./pages/PoliceDashboard";
import Hospital from "./pages/Hospital";
import Lawyer from "./pages/Lawyer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminEmergencies from "./pages/AdminEmergencies";
import FIR from "./pages/FIR";
import FIRHistory from "./pages/FIRHistory";
import SOSHistory from "./pages/SOSHistory";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <Navbar />

      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/police" element={<Police />} />
           <Route
  path="/police/dashboard"
  element={
    <ProtectedRoute>
      <PoliceDashboard />
    </ProtectedRoute>
  }
/>

          <Route path="/hospital" element={<Hospital />} />
          <Route path="/lawyer" element={<Lawyer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/women-safety"
            element={
              <ProtectedRoute>
                <WomenSafety />
              </ProtectedRoute>
            }
          />

          <Route
            path="/women-safety-history"
            element={
              <ProtectedRoute>
                <WomenSafetyHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
  path="/admin/emergencies"
  element={
    <ProtectedRoute>
      <AdminEmergencies />
    </ProtectedRoute>
  }
/>

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fir"
            element={
              <ProtectedRoute>
                <FIR />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/fir-history"
             element={
               <ProtectedRoute>
                 <FIRHistory />
               </ProtectedRoute>
            }
         />

          <Route
            path="/sos-history"
            element={
              <ProtectedRoute>
                <SOSHistory />
              </ProtectedRoute>
            }
          />

          {/* 404 page */}
          <Route
            path="*"
            element={
              <div className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-6 text-center text-white">
                <div>
                  <h1 className="text-6xl font-bold text-blue-500">404</h1>

                  <p className="mt-4 text-xl text-slate-300">
                    Page not found
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;