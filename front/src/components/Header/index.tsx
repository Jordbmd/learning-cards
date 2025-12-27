import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LogoutIcon from '@mui/icons-material/Logout';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-logo" onClick={() => navigate('/dashboard')}>
          Learning Cards
        </h1>

        <nav className="header-nav">
          <button 
            className={`nav-btn ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <HomeIcon />
            <span>Accueil</span>
          </button>

          <button 
            className={`nav-btn ${isActive('/cards/create') ? 'active' : ''}`}
            onClick={() => navigate('/cards/create')}
          >
            <AddIcon />
            <span>Créer</span>
          </button>

          <button 
            className={`nav-btn ${isActive('/cards') ? 'active' : ''}`}
            onClick={() => navigate('/cards')}
          >
            <MenuBookIcon />
            <span>Mes cartes</span>
          </button>

          <button 
            className={`nav-btn ${isActive('/quiz') ? 'active' : ''}`}
            onClick={() => navigate('/quiz')}
          >
            <TrackChangesIcon />
            <span>Réviser</span>
          </button>

          <button 
            className="nav-btn logout-btn"
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span>Déconnexion</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

