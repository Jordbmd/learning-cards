import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { cardService } from '../../services/cardService';
import { Category } from '../../domain/types';
import type { Card } from '../../domain/types';
import Header from '../../components/Header';
import '../../styles/common.css';
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
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadCards();
    }
  }, [location, user]);

  const loadCards = async () => {
    try {
      setIsLoading(true);
      const data = await cardService.getAllCards();
      setCards(data);
    } catch (err) {
      console.error('Erreur lors du chargement des cartes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    const totalCards = cards.length;
    const masteredCards = cards.filter(card => card.category === Category.DONE).length;
    const cardsToReview = totalCards - masteredCards;
    
    return {
      totalCards,
      cardsToReview,
      masteredCards
    };
  };

  if (!user) {
    return null;
  }

  const stats = getStats();

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-content">
          <div className="page-header">
            <h1>Tableau de bord</h1>
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
                    <div className="stat-number">{isLoading ? '...' : stats.totalCards}</div>
                    <div className="stat-label">Cartes créées</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{isLoading ? '...' : stats.cardsToReview}</div>
                    <div className="stat-label">Cartes à réviser</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{isLoading ? '...' : stats.masteredCards}</div>
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
                  <button className="action-btn" onClick={() => navigate('/cards')}>
                    <MenuBookIcon className="action-icon" />
                    <span className="action-text">Mes cartes</span>
                  </button>
                  <button className="action-btn" onClick={() => navigate('/quiz')}>
                    <TrackChangesIcon className="action-icon" />
                    <span className="action-text">Réviser</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

export default Dashboard;
