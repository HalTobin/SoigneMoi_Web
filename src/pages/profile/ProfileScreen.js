import { useNavigate } from "react-router-dom";
import { TOKEN_STORAGE_KEY } from "../../const";
import axios from 'axios';
import { useEffect, useState } from 'react';
import CardAppointment from './CardAppointment.js';
import './ProfileScreen.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProfileScreen() {
    const [pastAppointments, setPastAppointments] = useState([]);
    const [futureAppointments, setFutureAppointments] = useState([]);
    const [currentAppointment, setCurrentAppointment] = useState();

    useEffect(() => {
        configureHeader();
        fetchAppointments();
    }, []);

    var headers = {
        Authorization: `Bearer `,
    };

    const navigate = useNavigate();

    const configureHeader = () => {
        headers = {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
        };
    }

    const fetchAppointments = () => {
        axios.get('http://localhost:3000/api/appointment/my_appointments', { headers })
            .then(response => {
                setCurrentAppointment(response.data.currentAppointment);
                setPastAppointments(response.data.pastAppointments);
                setFutureAppointments(response.data.futureAppointments);
            })
            .catch((error) => {
                //navigate('/login', { replace: true });
            });
    }

    return (
        <>
            <h2>Mes rendez-vous</h2>
            {((currentAppointment !== null) && (
                <>
                    <h3>Rendez-vous en cours</h3>
                    <CardAppointment appointment={currentAppointment} />
                </>
            ))}
            {((futureAppointments.length > 0) && (
                <>
                    <h3>Prochain rendez-vous</h3>
                    <div>{futureAppointments.map((appointment, index) => (
                        <CardAppointment key={appointment.id} appointment={appointment} />
                    ))}
                    </div>
                </>
            ))}
            {((pastAppointments.length > 0) && (
                <>
                    <h3>Rendez-vous passés</h3>
                    <div>{pastAppointments.map((appointment, index) => (
                        <CardAppointment key={appointment.id} appointment={appointment} />
                    ))}
                    </div>
                </>
            ))}
        </>
    );
}

export default ProfileScreen;