import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatResponseDate, getHeader } from "../../Utils";
import axios from 'axios';
import './AdminScreen.css';
import { Modal, Button, Card, Badge } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BASE_URL } from "../../const";

function DoctorVisitTab() {
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalAppointment, setModalAppointment] = useState({
        appointment: { id: -1, },
        doctor: {
            name: '',
            visitToday: 0,
        },
    });

    const handleCardClick = (modalAppointment) => {
        setModalAppointment(modalAppointment);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const navigate = useNavigate();

    useEffect(() => {
        headers = getHeader();
        fetchAppointmentOfTheDay();
    }, []);

    var headers;

    const fetchAppointmentOfTheDay = async () => {
        axios.get(`${BASE_URL}/doctor_visit/today_appointments`, { headers })
            .then(response => {
                setAppointments(response.data);
            })
            .catch((error) => {
                //navigate('/login', { replace: true });
            });
    }

    const createVisit = async (appointmentId) => {
        axios.post(`${BASE_URL}/doctor_visit/new`, {
            appointmentId: appointmentId,
        }, {
            headers: getHeader(),
        })
            .then(response => {
                handleCloseModal();
                fetchAppointmentOfTheDay();
            });
    }

    return (
        <>
            <div className="doctor_visit_tab_main">
                <h2>Visites pour aujourd'hui</h2>
                {appointments.sort((a, b) => a.visitForToday - b.visitForToday).map((appointment, index) => (
                    <Card
                        key={index}
                        className={`mb-3 ${appointment.visitForToday ? 'bg-success' : 'bg-warning'} rounded`}
                    >
                        <Card.Body>
                            <Card.Title>{`Patient : ${appointment.visitor.name} ${appointment.visitor.surname}, Motif : ${appointment.appointment.reason}`}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{`Dr. ${appointment.doctor.name} - ${appointment.appointment.specialty}`}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">{`Arrivée du patient le ${formatResponseDate(appointment.appointment.startDate)}, départ : ${formatResponseDate(appointment.appointment.endDate)}`}</Card.Subtitle>
                            {!appointment.visitForToday && (
                                <div>
                                    <Card.Text>
                                        {`Dernière visite: ${appointment.lastVisit === -1 ? 'Aucune' : `Il y a ${appointment.lastVisit}`}`}
                                    </Card.Text>
                                </div>
                            )}
                        </Card.Body>
                        <div className="position-absolute top-0 end-0 p-2">
                            <a className="clickable"
                                onClick={() => handleCardClick(appointment)}>Ajouter une visite</a>
                        </div>
                    </Card>
                ))}
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalAppointment.doctor.visitToday === 0 ? (
                        <p>{`Le Dr. ${modalAppointment.doctor.name} n'a pas encore de visite pour aujourd'hui. Souhaitez-vous l'associer à cette visite ?`}</p>
                    ) : modalAppointment.doctor.visitToday < 5 ? (
                        <p>{`Le Dr. ${modalAppointment.doctor.name} a déjà ${modalAppointment.doctor.visitToday} visite${modalAppointment.doctor.visitToday > 1 ? 's' : ''} de prévue${modalAppointment.doctor.visitToday > 1 ? 's' : ''} pour aujourd'hui. Souhaitez-vous l'associer à cette visite ?`}</p>
                    ) : (
                        <p>{`Le Dr. ${modalAppointment.doctor.name} a déjà 5 visites de prévues pour aujourd'hui. Vous ne pouvez pas lui en attribuer une de plus pour le moment.`}</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Non
                    </Button>
                    {(modalAppointment.doctor.visitToday < 5) && (<Button variant="primary" onClick={() => createVisit(modalAppointment.appointment.id)}>
                        Oui
                    </Button>)}
                </Modal.Footer>
            </Modal>
        </>
    );

}

export default DoctorVisitTab;