import React, { useState } from 'react';
import axios from 'axios';
import "./SignUpScreen.css"

function SignUp() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [postCode, setPostCode] = useState('');
    const [signupStatus, setSignupStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Mail:', mail);
        //console.log('Password:', password);
    };

    const handleSignup = async () => {

        if (password == passwordCheck) {
            try {
                const response = await axios.post('http://localhost:3000/api/auth/register', {
                    name,
                    surname,
                    mail,
                    password,
                    postCode,
                });

                if (response.status === 200) {
                    setSignupStatus('Welcome!');
                } else {
                    setSignupStatus('Signup Failed');
                }
            } catch (error) {
                setSignupStatus('Signup Failed');
            }
        }


    };

    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <div div className="column">
                    <div className="row">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Mail"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Postal Code"
                        value={postCode}
                        onChange={(e) => setPostCode(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={(password != passwordCheck) ? 'error' : ''}
                    />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                        className={(password != passwordCheck) ? 'error' : ''}
                    />
                    <button onClick={handleSignup}>Signup</button>
                </div>
                <div>{signupStatus}</div>
            </form>
        </div>
    );
}

export default SignUp;