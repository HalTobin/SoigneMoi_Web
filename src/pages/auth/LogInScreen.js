import { useState } from "react";
import './LogInScreen.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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
                    localStorage.setItem('accessToken', json.data.accessToken);

                    const headers = {
                        Authorization: `Bearer ${json.data.accessToken}`,
                    };
                    axios.get('http://localhost:3000/api/visitor/profile', { headers })
                        .then((response) => setLoginStatus(`Welcome ${response.data.name}!`))
                        .catch((error) => setLoginStatus('Login Failed'));

                    setLoginStatus('Login Successful');
                } else {
                    setLoginStatus('Login Failed');
                }
            }).catch((error) => setLoginStatus('Login Failed'));
    };

    return (
        <div>
            <h2>Connection</h2>
            <form onSubmit={handleSubmit}>
                <div className="column">
                    <input
                        type="text"
                        id="mail"
                        placeholder="Enter your mail"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                    />
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="row">
                        <button onClick={() => navigate('signup')} type="submit">Sign Up</button>
                        <button onClick={handleLogin}>Login</button>
                    </div>
                    <div>{loginStatus}</div>
                </div>
            </form>
        </div>
    );
}


export default LogInScreen;