import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import MasterBarang from "../pages/MasterBarang/MasterBarang";
import StockOpname from "../pages/StockOpname/StockOpname";
// import barang
import ImportBarang from "../pages/ImportBarang/ImportBarang";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";



function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </PublicRoute>
          }
        />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <MainLayout title="Dashboard">
        <Dashboard />
      </MainLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/import-barang"
  element={
    <ProtectedRoute>
      <MainLayout title="Import Barang">
        <ImportBarang />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
    path="/master-barang"
    element={
        <ProtectedRoute>
            <MainLayout title="Master Barang">
                <MasterBarang/>
            </MainLayout>
        </ProtectedRoute>
    }
/>

<Route
    path="/stock-opname"
    element={
        <ProtectedRoute>
            <MainLayout title="Stock Opname">
                <StockOpname/>
            </MainLayout>
        </ProtectedRoute>
    }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;