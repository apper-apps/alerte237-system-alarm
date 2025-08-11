import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Home from "@/components/pages/Home"
import ReportForm from "@/components/pages/ReportForm"
import UserProfile from "@/components/pages/UserProfile"
import AdminDashboard from "@/components/pages/AdminDashboard"
import MapView from "@/components/pages/MapView"
import Community from "@/components/pages/Community"
import { ThemeProvider } from "@/hooks/useTheme"

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="report" element={<ReportForm />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="map" element={<MapView />} />
              <Route path="community" element={<Community />} />
            </Route>
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{ zIndex: 9999 }}
          />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App