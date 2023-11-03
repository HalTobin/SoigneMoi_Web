import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogInScreen from './pages/auth/LogInScreen';
import SignUpScreen from './pages/auth/SignUpScreen';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SoigneMoi</h1>
        {/* <LogInScreen /> */}
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<LogInScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
