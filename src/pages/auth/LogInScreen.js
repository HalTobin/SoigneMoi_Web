import { useState } from "react";
import './LogInScreen.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { TOKEN_STORAGE_KEY } from "../../const";

function LogInScreen() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState(''); // To store login status message

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Mail:', mail);
        console.log('Password:', password);
    };

    const handleLogin = async () => {
        axios.post('http://localhost:3000/api/auth/login', {
            mail,
            password,
        })
            .then((json) => {
                if (json.status === 200) {
                    localStorage.setItem(TOKEN_STORAGE_KEY, json.data.accessToken);
                    if (json.data.role === "Visitor") { navigate(-1) }
                    if (json.data.role === "Doctor") { setLoginStatus('Please use the app dedicated to doctors.'); }
                    if (json.data.role === "Admin") { navigate('/admin', { replace: true }) }
                    //setLoginStatus('Login Successful');
                } else {
                    setLoginStatus('Login Failed');
                }
            }).catch((error) => setLoginStatus('Login Failed'));
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>SoigneMoi</h1>
                <div>
                    <h2>Connexion</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="column">
                            <input
                                type="text"
                                id="mail"
                                placeholder="Adresse mail"
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                            />
                            <input
                                type="password"
                                id="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="row">
                                <button onClick={() => navigate('/signup', { replace: true })} type="submit">Sign Up</button>
                                <button onClick={handleLogin}>Login</button>
                            </div>
                            <div>{loginStatus}</div>
                        </div>
                    </form>
                </div>
            </header>
        </div>
    );
}

export default LogInScreen;