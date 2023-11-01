import { useState } from "react";
import './LogInScreen.css'
import axios from 'axios';

function LogInScreen() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState(''); // To store login status message

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Mail:', mail);
        console.log('Password:', password);
    };

    const handleLogin = async () => {
        axios.get('http://localhost:3000/api/visitor/login', {
            params: { mail, password },
        })
            //.then((result) => result.json())
            .then((json) => {

                if (json.data === 'login') {
                    setLoginStatus('Login Successful');
                } else {
                    setLoginStatus('Login Failed');
                }

            })//.catch((error) => setLoginStatus('Login Failed'));

        // try {
        //     const response = await axios.get('http://localhost:9091/visitor/login', {
        //         params: { mail, password },
        //     });

        //     if (response.data === 'login') {
        //         setLoginStatus('Login Successful');
        //     } else {
        //         setLoginStatus('Login Failed');
        //     }
        // } catch (error) {
        //     setLoginStatus('Login Failed');
        // }
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
                        <button type="submit">Sign Up</button>
                        <button onClick={handleLogin}>Login</button>
                    </div>
                    <div>{loginStatus}</div>
                </div>
            </form>
        </div>
    );
}


export default LogInScreen;