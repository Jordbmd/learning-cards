import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardService } from '../services/cardService';
import AddIcon from '@mui/icons-material/Add';
import type { Card } from '../domain/types';
import { getCategoryLabel } from '../domain/types';
import './MyCards.css';

function MyCards() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCards = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await cardService.getAllCards();
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des cartes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <div className="my-cards-container">
      <div className="my-cards-content">
        <div className="my-cards-header">
          <h1>Mes cartes</h1>
          <div className="header-actions">
            <button className="btn-add" onClick={() => navigate('/cards/create')}>
              <AddIcon />
              Nouvelle carte
            </button>
            <button className="btn-back" onClick={() => navigate('/dashboard')}>
              Retour
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading">Chargement des cartes...</div>
        ) : cards.length === 0 ? (
          <div className="empty-state">
            <p>Vous n'avez pas encore de cartes.</p>
            <button className="btn-create" onClick={() => navigate('/cards/create')}>
              Créer ma première carte
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {cards.map((card) => (
              <div key={card.id} className="card-item">
                <div className="card-header">
                  <span className={`category-badge category-${card.category}`}>
                    {getCategoryLabel(card.category)}
                  </span>
                </div>

                <div className="card-content">
                  <div className="card-section">
                    <h3>Question</h3>
                    <p>{card.question}</p>
                  </div>

                  <div className="card-section">
                    <h3>Réponse</h3>
                    <p>{card.answer}</p>
                  </div>

                  {card.tag && (
                    <div className="card-tags">
                      <span className="tag">{card.tag}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCards;
