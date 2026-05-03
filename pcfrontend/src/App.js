import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MarkerMap from "./Components/MarkerMap";
import Home from "./Components/Home";
import Basic from "./Components/Basic";
import DrawMap from "./Components/DrawMap";
import AdminCrimes from "./Components/AdminPage";
import CrimeHeatmap from "./Components/CrimeHeatmap";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import LoadingBar from "react-top-loading-bar";
import News from "./Components/News_Components/News";
import React, { useState } from "react";
import Announcements from "./Components/Announcement_Components/Announcements";
import AnnouncementPage from "./Components/Announcement_Components/AnnouncementPage";
import ChatPage from "./Components/Chat_Components/ChatPage";
import Weather from "./Components/Weather_Components/Weather";
import AboutUs from "./Components/AboutUs";

const App = () => {
  
  const [progress, setProgress] = useState(0);          // useState instead of this.state

  return (
    <AuthProvider>
      <Router>
        <LoadingBar color="#f11946" progress={progress} />  {/* use hook state */}

        <Navbar />

        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><MarkerMap /></ProtectedRoute>} />
          <Route path="/BasicMap" element={<ProtectedRoute><Basic /></ProtectedRoute>} />
          <Route path="/DrawMap" element={<DrawMap />} />
          <Route path="/AdminPage" element={<ProtectedRoute><AdminCrimes /></ProtectedRoute>} />
          <Route path="/CrimeHeatmap" element={<ProtectedRoute><CrimeHeatmap /></ProtectedRoute>} />

           <Route path="/Announcements" element={<Announcements />} />

           <Route path="/ManageAnnouncements" element={<AnnouncementPage />} />

            <Route path="/Chat" element={<ChatPage />} />

            <Route path="/Weather" element={<Weather />} />

            <Route path="/AboutUs" element={<AboutUs />} />

          <Route
            path="/News"
            element={
              <News
                setProgress={setProgress}
                apikey={process.env.REACT_APP_NEWS_API}
                key="general"
                pageSize={6}
                country="us"
                category="general"
              />
            }
          />

          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
