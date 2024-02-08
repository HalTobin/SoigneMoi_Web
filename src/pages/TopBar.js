import axios from 'axios';
import './TopBar.css';
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { TOKEN_STORAGE_KEY, BASE_URL } from '../const';
import { Button } from 'react-bootstrap';
import { LogoutOutlined } from '@mui/icons-material';

function TopBar() {
    const [isConnected, setIsConnected] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState("");
    const [isLoginPage, setIsLoginPage] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsLoginPage(location.pathname === '/login');

        const headers = {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
        };

        axios.get(`${BASE_URL}/home/current_user`, { headers })
            .then((response) => {
                setUserName(response.data.name);
                setIsAdmin(response.data.role === "Admin");
                setIsConnected(true);
            })
            .catch((error) => {
                setIsConnected(false);
                setIsAdmin(false);
            });
    }, [location]);

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
                    <NavLink className="home-nav" to="/">SoigneMoi</NavLink>
                </div>
                <div className="user-profile">
                    {isConnected && (
                        <Button onClick={() => navigate(isAdmin ? "/admin" : "/new_appointment", { replace: true })}>
                            {isAdmin ? 'Panel administrateur' : 'Prendre RDV'}
                        </Button>
                    )}
                    {/* Conditionally render the "Connexion" link based on the current page */}
                    {!isLoginPage && (
                        <a href={isConnected ? '/me' : '/login'}>{isConnected ? userName : 'Connexion'}</a>
                    )}
                    {isConnected && (
                        <span
                            className="disconnect"
                            style={{ cursor: 'pointer' }}
                            onClick={handleLogout}
                        >
                            <LogoutOutlined />
                        </span>
                    )}
                </div>
            </div >
        </div>
    );
}

export default TopBar;