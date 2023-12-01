// CardAppointment.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import { formatResponseDate } from '../../Utils';

function CardAppointment({ appointment }) {
    if (!appointment) {
        return <div>Error: Appointment data is missing.</div>;
    }

    return (
        <Card key={appointment.id} style={{ borderRadius: '15px', margin: '10px', padding: '10px' }}>
            <Card.Title>Dr. {appointment.doctor}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
                {formatResponseDate(appointment.startDate)} - {formatResponseDate(appointment.endDate)}
            </Card.Subtitle>
            <Card.Text>
                <strong>Raison:</strong> {appointment.reason}
                <strong> Spécialité :</strong> {appointment.specialty}
            </Card.Text>
        </Card>
    );
}

export default CardAppointment;
