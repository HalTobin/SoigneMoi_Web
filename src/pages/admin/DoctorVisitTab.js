import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatResponseDate, getHeader } from "../../Utils";
import axios from 'axios';
import './AdminScreen.css';
import { Modal, Button, Card, Badge } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function DoctorVisitTab() {
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleCardClick = () => {
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
        axios.get('http://localhost:3000/api/doctor_visit/today_appointments', { headers })
            .then(response => {
                setAppointments(response.data);
            })
            .catch((error) => {
                //navigate('/login', { replace: true });
            });
    }

    return (
        <>
            <div className="doctor_visit_tab_main">
                {appointments.map((appointment, index) => (
                    <Card
                        key={index}
                        className={`mb-3 ${appointment.visitForToday ? 'bg-success' : 'bg-warning'} rounded`}
                        onClick={handleCardClick} // Open the modal on card click
                    >
                        <Card.Body>
                            <Card.Title>{`Patient : ${appointment.visitor.name} ${appointment.visitor.surname}, Motif : ${appointment.appointment.reason}`}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{`Dr. ${appointment.doctor.name}, Spécialité : ${appointment.appointment.specialty}`}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">{`Arrivée du patient ${formatResponseDate(appointment.appointment.startDate)}, départ : ${formatResponseDate(appointment.appointment.endDate)}`}</Card.Subtitle>
                            {!appointment.visitForToday && (
                                <div>
                                    <Card.Text>
                                        {`Dernière visite: ${appointment.lastVisit === -1 ? 'Aucune' : `Il y a ${appointment.lastVisit}`}`}
                                    </Card.Text>
                                </div>
                            )}
                        </Card.Body>
                        <div className="position-absolute top-0 end-0 p-2">
                            {/* Edit option at the top right corner */}
                            <a className="clickable"
                                href={handleCardClick}>Ajouter une visite</a>
                        </div>
                    </Card>
                ))}
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Add your form or content for editing */}
                    {/* Example: */}
                    <p>Appointment details editing form goes here.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

export default DoctorVisitTab;