import React, { useState, useEffect } from 'react';
import homeImage from '../images/home_image.jpg';
import './HomeScreen.css';

function Homepage() {
    const [specialties, setSpecialties] = useState([]);

    useEffect(() => {
        // Make an API call to fetch data from the "public/specialties" endpoint
        fetch('http://localhost:3000/api/public/specialties')
            .then(response => response.json())
            .then(data => setSpecialties(data.specialties))
            .catch(error => console.error('API call error:', error));
    }, []);

    return (
        <div>
            {/* Top Bar */}
            <div className="top-bar">
                <div className="logo">
                    <h1>SoigneMoi</h1>
                </div>
                <div className="user-profile">
                    <a href="/login">Profile</a>
                </div>
            </div>

            {/* Image */}
            <div className="header-image-container">
                <div className="header-image" style={{ backgroundImage: `url(${homeImage})` }} />
            </div>

            {/* Presentation */}
            <div className="brief-presentation">
                <h2>Bienvenue chez SoigneMoi</h2>
                <p>
                    L'Hôpital SoigneMoi est un établissement de santé de renom situé dans le nord de la région lilloise, offrant des soins de qualité aux résidents de la région et au-delà depuis plus de cinquante ans. Notre engagement envers l'excellence médicale, le bien-être des patients et l'innovation continue a fait de nous un pilier essentiel de la communauté médicale locale.
                </p>
                <p>
                    Notre mission principale est de fournir des soins de santé complets et compatissants à nos patients, en veillant à ce que chacun reçoive des soins de la plus haute qualité. En tant qu'hôpital de soins tertiaires, nous offrons une gamme complète de services médicaux, de la médecine générale aux spécialités de pointe, en passant par la chirurgie, la réadaptation et les soins palliatifs.
                </p>
                <p>
                    Notre hôpital est fier de compter sur une équipe médicale hautement qualifiée et dévouée, composée de médecins, d'infirmières, de techniciens et de professionnels de la santé. Leur expertise et leur engagement envers le bien-être des patients sont les piliers de notre succès.
                </p>
            </div>

            {/* Specialties */}
            {specialties.length > 0 && (
                <div className="specialties">
                    <h2>Nos services et spécialités</h2>
                    <div className="cards">
                        {specialties.map((specialty, index) => (
                            <div key={index} className="specialty-card">
                                <h3>{specialty.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Homepage;