import { Routes, Route } from "react-router-dom"

import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import DashboardPage from "../pages/DashboardPage"

import ProtectedRoute from "./ProtectedRoute"
import GroupPage from "../pages/GroupPage"


export default function AppRoutes() {
    return (
        <Routes>

            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/groups/:groupId"
                element={
                    <ProtectedRoute>
                        <GroupPage />
                    </ProtectedRoute>
                } />

        </Routes>
    )
}