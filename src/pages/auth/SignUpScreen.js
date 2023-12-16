import React, { useState } from 'react';
import axios from 'axios';
import "./SignUpScreen.css"
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function SignUp() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [postCode, setPostCode] = useState('');
    const [signupStatus, setSignupStatus] = useState('');

    const navigate = useNavigate();

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
                    navigate('/', { replace: true });
                } else {
                    setSignupStatus('Erreur');
                }
            } catch (error) {
                setSignupStatus('Erreur');
            }
        }


    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Inscription</h1>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div div className="column">
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Nom"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Prénom"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                    />
                                </div>
                            </div>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Adresse mail"
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                            />
                            <input
                                className="form-control"
                                type="number"
                                placeholder="Code postal"
                                value={postCode}
                                onChange={(e) => setPostCode(e.target.value)}
                            />
                            <input
                                className={(password != passwordCheck) ? 'error form-control' : 'form-control'}
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                className={(password != passwordCheck) ? 'error form-control' : 'form-control'}
                                type="password"
                                placeholder="Confirmer le mot de passe"
                                value={passwordCheck}
                                onChange={(e) => setPasswordCheck(e.target.value)}
                            />
                            <Button onClick={handleSignup}>Créer un compte</Button>
                        </div>
                        <div>{signupStatus}</div>
                    </form>
                </div>
            </header>
        </div>
    );
}

export default SignUp;