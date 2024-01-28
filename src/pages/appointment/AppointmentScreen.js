import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import './AppointmentScreen.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatResponseDate, formatDate, getHeader } from '../../Utils';
import { TOKEN_STORAGE_KEY } from "../../const";


function AppointmentScreen() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const [modalAppointment, setModalAppointment] = useState({
        startDate: '',
        endDate: '',
        reason: '',
    });

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

    var headers = '';

    const navigate = useNavigate();

    const openModal = () => { setIsModalOpen(true); };

    const closeModal = () => { setIsModalOpen(false); };

    useEffect(() => {
        headers = getHeader()
        fetchDoctorsAndSpecialties();
        fetchAuthorizedTimestamp();
    }, []);

    useEffect(() => {
        setMatchingDoctors(doctors.filter(doctor =>
            doctor.specialty.title == newAppointmentData.specialty
        ));
        if (matchingDoctors.length > 0) {
            newAppointmentData.doctor = matchingDoctors[0].registrationNumber;
        }
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

    const goToLogin = () => {
        closeModal();
        navigate("/login", { replace: true });
    }

    const goToProfile = () => {
        closeModal();
        navigate("/me", { replace: true });
    }

    const fetchDoctorsAndSpecialties = async () => {
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
        axios.get('http://localhost:3000/api/appointment/authorized_date', { headers })
            .then(response => {
                const minDate = formatDate(response.data.timestamp)
                setAuthorizedDate(minDate);
                console.log(`Start date ${minDate}`);
            })
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

    const bookAppointment = () => {
        headers = getHeader();
        axios.post('http://localhost:3000/api/appointment/book', {
            startDate: newAppointmentData.startDate,
            endDate: newAppointmentData.endDate,
            reason: newAppointmentData.reason,
            specialty: newAppointmentData.specialty,
            doctor: newAppointmentData.doctor,
        }, { headers: headers, })
            .then(response => {
                setIsBookingSuccess(true);
                setModalAppointment(response.data.appointmentData)
                openModal();
            })
            .catch(error => {
                if (error.response.data.status === 'NOT_AVAILABLE') {
                    console.log("Appointment not available");
                    setModalAppointment(error.response.data.appointmentData);
                    setIsBookingSuccess(false);
                    openModal();
                }
                console.log(error.response.data.toString());
            })
    };

    return (
        <div className="App">
            <header className="App-header">
                <Modal show={isModalOpen} onHide={closeModal} centered>
                    <Modal.Header>
                        {(isBookingSuccess) && (<Modal.Title>Rendez-vous confirmé</Modal.Title>)}
                        {(!isBookingSuccess) && (<Modal.Title>Impossible de réserver un rendez-vous</Modal.Title>)}
                    </Modal.Header>
                    {(!isBookingSuccess) && (<Modal.Body>
                        {(modalAppointment.startDate != '') && (
                            <p>Il semblerait que vous ayez déjà un rendez-vous du {formatResponseDate(modalAppointment.startDate)} au {formatResponseDate(modalAppointment.endDate)} pour le motif suivant : "
                                {modalAppointment.reason}"
                            </p>
                        )}
                        {(modalAppointment.startDate === '') && (
                            <p>Il semblerait que votre session a expiré...</p>
                        )}
                    </Modal.Body>)}
                    {(isBookingSuccess) && (<Modal.Body>
                        <p>Rendez-vous réserver du {formatResponseDate(modalAppointment.startDate)} au {formatResponseDate(modalAppointment.endDate)} pour le motif : {modalAppointment.reason}</p>
                    </Modal.Body>
                    )}
                    <Modal.Footer>
                        {(modalAppointment.startDate !== '') && (
                            <Button onClick={isBookingSuccess ? goToProfile : closeModal}>Continuer</Button>
                        )}
                        {(modalAppointment.startDate === '') && (
                            <Button onClick={goToLogin}>Se connecter</Button>
                        )}
                    </Modal.Footer>
                </Modal>
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
                                        value={newAppointmentData.doctor}
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
                {areAllFieldsOk && (<Button onClick={bookAppointment}>Réserver</Button>)}
            </header>
        </div>
    );
}

export default AppointmentScreen;