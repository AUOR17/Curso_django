import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiDjango } from '../../api/client';
import { error } from 'console';

export default function BotonSalida() {
    const { logout } = useAuth(); 
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apiDjango.post('/logout/');
        }
        catch{
            console.error("Error al salir de la app", error);
        }
        finally{
            logout();
            navigate('/login');
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="text-rpg-parchment/70 hover:text-rpg-blood transition-colors text-sm font-serif underline"
        >
            Cerrar Sesion
        </button>
    );
}