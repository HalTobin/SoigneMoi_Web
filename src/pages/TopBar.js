import axios from 'axios';
import './TopBar.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TOKEN_STORAGE_KEY } from '../const';
import { Button } from 'react-bootstrap';
import { LogoutOutlined } from '@mui/icons-material';

function TopBar() {
    const [isConnected, setIsConnected] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
        };
        axios.get('http://localhost:3000/api/home/current_user', { headers })
            .then((response) => {
                setUserName(response.data.name);
                setIsAdmin(response.data.role === "Admin");
                setIsConnected(true);
            })
            .catch((error) => {
                setIsConnected(false);
                setIsAdmin(false);
            });
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        navigate(-1);
        window.location.reload();
    };

    return (
        <div>
            {/* Top Bar */}
            <div className="top-bar" >
                <div className="logo">
                    <h1>SoigneMoi</h1>
                </div>
                <div className="user-profile">
                    {isConnected && (
                        <Button onClick={() => navigate(isAdmin ? "/admin" : "/new_appointment", { replace: true })}>
                            {isAdmin ? 'Panel administrateur' : 'Prendre RDV'}
                        </Button>
                    )}
                    <a href={isConnected ? "/profile" : "/login"}>{isConnected ? userName : 'Connexion'}</a>
                    {isConnected && (
                        <span className='disconnect'
                            style={{ cursor: 'pointer' }}
                            onClick={handleLogout}>
                            <LogoutOutlined />
                        </span>
                    )}
                </div>
            </div >
        </div>
    );
}

export default TopBar;