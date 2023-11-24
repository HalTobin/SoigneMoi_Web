import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import './AppointmentScreen.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

import { TOKEN_STORAGE_KEY } from "../../const";


function AppointmentScreen() {
    const [doctors, setDoctors] = useState([]);
    const [matchingDoctors, setMatchingDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);

    const [authorizedDate, setAuthorizedDate] = useState(0);
    const [authorizedEndDate, setAuthorizedEndDate] = useState(0);

    const [areDatesOk, setAreDatesOk] = useState(false);
    const [areAllFieldsOk, setAreAllFieldsOk] = useState(false);

    const [newAppointmentData, setNewAppointmentData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        specialty: '',
        doctor: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctorsAndSpecialties();
        fetchAuthorizedTimestamp();
    }, []);

    useEffect(() => {
        setMatchingDoctors(doctors.filter(doctor =>
            doctor.specialty.title == newAppointmentData.specialty
        ));
        newAppointmentData.doctor = matchingDoctors[0];
    }, [newAppointmentData.specialty]);

    useEffect(() => {
        if (newAppointmentData.startDate !== '' && newAppointmentData.endDate !== '') {
            setAreDatesOk(true);
            if (newAppointmentData.reason !== '' && newAppointmentData.specialty !== '' && newAppointmentData.doctor !== '') {
                setAreAllFieldsOk(true);
            } else { setAreAllFieldsOk(false); }
        } else {
            setAreDatesOk(false);
            setAreAllFieldsOk(false);
        }
    }, [newAppointmentData]);

    useEffect(() => {
        configureMinEndDate();
    }, [newAppointmentData.startDate, authorizedDate]);

    const fetchDoctorsAndSpecialties = async () => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
        };
        axios.get('http://localhost:3000/api/common/get_doctors', { headers })
            .then(response => {
                setDoctors(response.data.doctors);
                setSpecialties(response.data.specialties);
            })
            .catch((error) => {
                navigate('/login', { replace: true });
            });
    };

    const fetchAuthorizedTimestamp = async () => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
        };
        axios.get('http://localhost:3000/api/appointment/authorized_date', { headers })
            .then(response => {
                const minDate = formatDate(response.data.timestamp)
                setAuthorizedDate(minDate);
                console.log(`Start date ${minDate}`);
                //configureMinEndDate();
            })
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const configureMinEndDate = () => {
        const isStartDateDefined = newAppointmentData.startDate !== '';
        var date = new Date(isStartDateDefined ? newAppointmentData.startDate : authorizedDate);
        date.setDate(date.getDate() + 1);

        const endDateMin = formatDate(date.getTime()); // Use getTime() to get the full timestamp
        console.log(`End Date ${endDateMin}`);

        setAuthorizedEndDate(endDateMin);
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAppointmentData({ ...newAppointmentData, [name]: value });
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="column">
                    <form>
                        <h3>Dates du séjour</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="control-label" for="date">Arrivée</label>
                                <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={newAppointmentData.startDate}
                                    onChange={handleInputChange}
                                    min={authorizedDate} />
                            </div>
                            <div class="form-group">
                                <label class="control-label" for="date">Départ</label>
                                <Form.Control
                                    type="date"
                                    name="endDate"
                                    value={newAppointmentData.endDate}
                                    onChange={handleInputChange}
                                    min={authorizedEndDate}
                                    disabled={newAppointmentData.startDate === ''} />
                            </div>
                        </div>
                    </form>
                </div>
                {areDatesOk && (
                    <div className="column">
                        <form>
                            <h3>Informations requises</h3>
                            <div class="form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="reason"
                                    placeholder="Motif"
                                    value={newAppointmentData.reason}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div class="form-row" id="medical-data">
                                <div class="form-group col-md-6">
                                    <select
                                        className="form-control"
                                        name="specialty"
                                        value={newAppointmentData.specialty}
                                        onChange={handleInputChange}
                                    >
                                        <option value="" disabled>Spécialités</option>
                                        {specialties.map((specialty, index) => (
                                            <option key={specialty.id} value={specialty.title}>
                                                {specialty.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div class="form-group col-md-6">
                                    <select
                                        className="form-control"
                                        name="doctor"
                                        value={(newAppointmentData.doctor !== '') ? "Dr. ${newAppointmentData.doctor.name}" : "Docteurs"}
                                        onChange={handleInputChange}
                                        disabled={newAppointmentData.specialty === ''}
                                    >
                                        <option value="" disabled>Docteurs</option>
                                        {matchingDoctors.map((doctor, index) => (
                                            <option key={doctor.id} value={doctor.registrationNumber}>
                                                Dr. {doctor.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>)}
                {areAllFieldsOk && (<Button>Réserver</Button>)}
            </header>
        </div>
    );
}

export default AppointmentScreen;