import { useState } from "react";
import './LogInScreen.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BASE_URL, TOKEN_STORAGE_KEY } from "../../const";
import { Button } from "react-bootstrap";

function LogInScreen() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState(''); // To store login status message

    const navigate = useNavigate();

    const handleSubmit = (e) => { e.preventDefault(); };

    const handleLogin = async () => {
        axios.post(`${BASE_URL}/auth/login`, {
            mail,
            password,
        })
            .then((json) => {
                if (json.status === 200) {
                    localStorage.setItem(TOKEN_STORAGE_KEY, json.data.accessToken);
                    if (json.data.role === "Visitor") { navigate(-1) }
                    if (json.data.role === "Doctor") { setLoginStatus('Please use the app dedicated to doctors.'); }
                    if (json.data.role === "Admin") { navigate('/admin', { replace: true }) }
                } else {
                    setLoginStatus('Login Failed');
                }
            }).catch((error) => setLoginStatus('Login Failed'));
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Connexion</h1>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="column">
                            <input
                                className="form-control"
                                type="text"
                                id="mail"
                                placeholder="Adresse mail"
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                            />
                            <input
                                className="form-control password"
                                type="password"
                                id="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="button-row">
                                <Button
                                    className="col-md-6"
                                    onClick={() => navigate('/signup', { replace: true })} type="submit">Sign Up</Button>
                                <Button
                                    className="col-md-6"
                                    onClick={handleLogin}>Login</Button>
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