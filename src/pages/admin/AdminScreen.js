import { useState, useEffect } from "react";
import './AdminScreen.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import { TOKEN_STORAGE_KEY } from "../../const";
import DoctorTab from "./DoctorTab";
import DoctorVisitTab from "./DoctorVisitTab";

function AdminScreen() {

    return (
        <Tabs
            defaultActiveKey="doctor"
            className="mb-3 custom-tabs"
            fill
        >
            <Tab eventKey="doctor" title="Docteurs">
                <DoctorTab />
            </Tab>
            <Tab eventKey="doctor_visit" title="Visites">
                <DoctorVisitTab />
            </Tab>
        </Tabs>
    );

}

export default AdminScreen;