import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import './Dashboard.css';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Tableau de bord</h1>
          <button onClick={handleLogout} className="btn-logout">
            Déconnexion
          </button>
        </div>

        <div className="user-info">
          <h2>Bienvenue, {user.name} !</h2>
          <p className="user-email">{user.email}</p>
        </div>

        <div className="dashboard-content">
          <div className="stats-section">
            <h3>Mes statistiques</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">0</div>
                <div className="stat-label">Cartes créées</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">0</div>
                <div className="stat-label">Cartes à réviser</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">0</div>
                <div className="stat-label">Cartes maîtrisées</div>
              </div>
            </div>
          </div>

          <div className="actions-section">
            <h3>Actions rapides</h3>
            <div className="actions-grid">
              <button className="action-btn" onClick={() => navigate('/cards/create')}>
                <AddIcon className="action-icon" />
                <span className="action-text">Créer une carte</span>
              </button>
              <button className="action-btn" disabled>
                <MenuBookIcon className="action-icon" />
                <span className="action-text">Mes cartes</span>
              </button>
              <button className="action-btn" disabled>
                <TrackChangesIcon className="action-icon" />
                <span className="action-text">Réviser</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
