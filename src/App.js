import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogInScreen from './pages/auth/LogInScreen';
import SignUpScreen from './pages/auth/SignUpScreen';
import HomeScreen from './pages/HomeScreen';
import AdminScreen from './pages/admin/AdminScreen'
import TopBar from './pages/TopBar';
import AppointmentScreen from './pages/appointment/AppointmentScreen';
import ProfileScreen from './pages/profile/ProfileScreen';

function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route exact path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LogInScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/new_appointment" element={<AppointmentScreen />} />
        <Route path="/me" element={<ProfileScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
