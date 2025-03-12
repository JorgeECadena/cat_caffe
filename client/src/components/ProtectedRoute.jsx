import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

async function validateToken(token) {   
    try {
        const response = await fetch(`${API_URL}/admin/validate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "token": token,
            }),
        });

        if (!response.ok) {
            console.log("Response not OK:", response.status, await response.text());
            return false;
        }

        if(response.status === 404) {
            console.log("User unauthorized: ", await response.json());
            return false;
        }
        
        return true;
    } catch (e) {
        console.log("Exception caught: ", e);
    }
}

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setIsAuthenticated(false);
                return;
            }
            const isValid = await validateToken(token);
            setIsAuthenticated(isValid);
        };
        checkAuth();
    }, [token]);

    if (isAuthenticated === null) return <p>Loading...</p>

    return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

export default ProtectedRoute;