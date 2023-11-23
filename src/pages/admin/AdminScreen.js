import { useState, useEffect } from "react";
import './AdminScreen.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

import { TOKEN_STORAGE_KEY } from "../../const";

function AdminScreen() {
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDoctorData, setNewDoctorData] = useState({
        name: '',
        surname: '',
        registrationNumber: '',
        password: '',
        specialty: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctorsAndSpecialties();
    }, []);

    const fetchDoctorsAndSpecialties = async () => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
        };
        axios.get('http://localhost:3000/api/admin/get_doctors', { headers })
            .then(response => {
                setDoctors(response.data.doctors);
                setSpecialties(response.data.specialties);
            })
            .catch((error) => {
                navigate('/login', { replace: true });
            });
    };

    const openModal = () => { setIsModalOpen(true); };

    const closeModal = () => { setIsModalOpen(false); };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDoctorData({ ...newDoctorData, [name]: value });
    };

    const handleAddDoctor = async () => {
        // Make an API call to add a new doctor
        const headers = {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
        };
        axios.post('http://localhost:3000/api/admin/create_doctor', {
            name: newDoctorData.name,
            surname: newDoctorData.surname,
            registrationNumber: newDoctorData.registrationNumber,
            specialtyId: specialties.find((specialty) => specialty.title === newDoctorData.specialty)?.id,
            password: newDoctorData.password,
        }, {
            headers: headers,
        })
            .then(response => {
                closeModal();
                fetchDoctorsAndSpecialties();
            });
    };

    return (
        <>
            <div className="container my-3">
                <div className="row">
                    <div className="col-md-6">
                        <h2>Docteurs</h2>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <Button onClick={openModal}>Ajouter un médecin</Button>
                    </div>
                </div>
            </div>
            <ul>
                {doctors.map((doctor) => (
                    <li key={doctor.id}>
                        <strong>({doctor.registrationNumber})</strong> {doctor.name} {doctor.surname} <br />
                        <strong>Spécialité :</strong> {doctor.specialty.title} <br />
                        <hr />
                    </li>
                ))}
            </ul>
            <Modal show={isModalOpen} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un médecin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-row">
                        <input
                            className="modal-input"
                            type="text"
                            name="name"
                            placeholder="Nom"
                            value={newDoctorData.name}
                            onChange={handleInputChange}
                        />
                        <input
                            className="modal-input"
                            type="text"
                            name="surname"
                            placeholder="Prénom"
                            value={newDoctorData.surname}
                            onChange={handleInputChange}
                        />
                    </div>
                    <input
                        className="modal-input"
                        type="text"
                        name="registrationNumber"
                        placeholder="Matricule"
                        value={newDoctorData.registrationNumber}
                        onChange={handleInputChange}
                    />
                    <input
                        className="modal-input"
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        value={newDoctorData.password}
                        onChange={handleInputChange}
                    />
                    <select
                        className="modal-input"
                        name="specialty"
                        value={newDoctorData.specialty}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled>
                            Sélectionnez une spécialité
                        </option>
                        {specialties.map((specialty, index) => (
                            <option key={specialty.id} value={specialty.title}>
                                {specialty.title}
                            </option>
                        ))}
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleAddDoctor}>Ajouter</Button>
                    <Button onClick={closeModal}>Annuler</Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

export default AdminScreen;