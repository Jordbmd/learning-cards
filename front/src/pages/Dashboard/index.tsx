import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { cardService } from '../../services/cardService';
import { notificationService } from '../../services/notificationService';
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
  const [notificationTime, setNotificationTime] = useState<string>(notificationService.getNotificationTime() || '09:00');
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(!!notificationService.getNotificationTime());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(Notification.permission);

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

  useEffect(() => {
    setNotificationPermission(Notification.permission);
    
    if (Notification.permission === 'granted' && notificationService.getNotificationTime()) {
      notificationService.scheduleNotification();
    }
  }, []);

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

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationPermission(Notification.permission);
    if (granted && notificationEnabled) {
      notificationService.setNotificationTime(notificationTime);
    }
  };

  const handleToggleNotification = () => {
    if (!notificationEnabled) {
      if (notificationPermission === 'granted') {
        notificationService.setNotificationTime(notificationTime);
        setNotificationEnabled(true);
      } else if (notificationPermission === 'default') {
        handleRequestPermission();
      }
    } else {
      notificationService.clearNotification();
      setNotificationEnabled(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setNotificationTime(newTime);
    if (notificationEnabled && notificationPermission === 'granted') {
      notificationService.setNotificationTime(newTime);
    }
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

              <div className="notifications-section">
                <h3>Notifications</h3>
                <div className="notification-settings">
                  {notificationPermission === 'denied' ? (
                    <div className="notification-error">
                      <p>Les notifications sont bloquées par votre navigateur.</p>
                      <p>Veuillez les autoriser dans les paramètres de votre navigateur.</p>
                    </div>
                  ) : (
                    <>
                      <div className="notification-time">
                        <label htmlFor="notification-time">
                          <NotificationsIcon className="notification-icon" />
                          Heure de notification :
                        </label>
                        <input
                          type="time"
                          id="notification-time"
                          value={notificationTime}
                          onChange={handleTimeChange}
                          disabled={!notificationEnabled}
                        />
                      </div>
                      <div className="notification-controls">
                        {notificationPermission !== 'granted' ? (
                          <button 
                            className="btn-notification-request"
                            onClick={handleRequestPermission}
                          >
                            Autoriser les notifications
                          </button>
                        ) : (
                          <button
                            className={`btn-notification-toggle ${notificationEnabled ? 'enabled' : 'disabled'}`}
                            onClick={handleToggleNotification}
                          >
                            {notificationEnabled ? 'Notifications activées' : 'Activer les notifications'}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

export default Dashboard;
