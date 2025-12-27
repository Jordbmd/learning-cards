import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardService } from '../../services/cardService';
import AddIcon from '@mui/icons-material/Add';
import type { Card } from '../../domain/types';
import { getCategoryLabel } from '../../domain/types';
import Header from '../../components/Header';
import '../../styles/common.css';
import './MyCards.css';

function MyCards() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAllCards = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await cardService.getAllCards();
      setCards(data);
      if (selectedTag === null) {
        setFilteredCards(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des cartes');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCardsByTag = async (tag: string) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await cardService.getAllCards({ tags: [tag] });
      setFilteredCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des cartes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllCards();
  }, []);

  const getAllTags = (): string[] => {
    const tags = cards
      .map(card => card.tag)
      .filter((tag): tag is string => tag !== null && tag !== undefined && tag !== '');
    return Array.from(new Set(tags)).sort();
  };

  const getCardsWithoutTag = (): number => {
    return cards.filter(card => !card.tag || card.tag === '').length;
  };

  const handleTagFilter = async (tag: string | null) => {
    setSelectedTag(tag);
    if (tag === null) {
      setFilteredCards(cards);
    } else if (tag === '__NO_TAG__') {
      const cardsWithoutTag = cards.filter(card => !card.tag || card.tag === '');
      setFilteredCards(cardsWithoutTag);
    } else {
      await loadCardsByTag(tag);
    }
  };

  return (
    <>
      <Header />
      <div className="page-container-full">
        <div className="page-content-full">
          <div className="my-cards-header">
            <h1>Mes cartes</h1>
            <div className="page-actions">
              <button className="btn-add" onClick={() => navigate('/cards/create')}>
                <AddIcon />
                Nouvelle carte
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
            <>
              <div className="tags-filter-section">
                <h3>Filtrer par tag</h3>
                <div className="tags-list">
                  <button
                    className={`tag-filter ${selectedTag === null ? 'active' : ''}`}
                    onClick={() => handleTagFilter(null)}
                  >
                    Toutes les cartes ({cards.length})
                  </button>
                  {getCardsWithoutTag() > 0 && (
                    <button
                      className={`tag-filter ${selectedTag === '__NO_TAG__' ? 'active' : ''}`}
                      onClick={() => handleTagFilter('__NO_TAG__')}
                    >
                      Sans tag ({getCardsWithoutTag()})
                    </button>
                  )}
                  {getAllTags().map((tag) => {
                    const count = cards.filter(card => card.tag === tag).length;
                    return (
                      <button
                        key={tag}
                        className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
                        onClick={() => handleTagFilter(tag)}
                      >
                        {tag} ({count})
                      </button>
                    );
                  })}
                </div>
                {selectedTag && (
                  <div className="tag-selected-info">
                    <p>
                      {selectedTag === '__NO_TAG__' ? (
                        <>
                          <strong>{filteredCards.length}</strong> carte{filteredCards.length > 1 ? 's' : ''} <strong>sans tag</strong>
                        </>
                      ) : (
                        <>
                          <strong>{filteredCards.length}</strong> carte{filteredCards.length > 1 ? 's' : ''} avec le tag <strong>"{selectedTag}"</strong>
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {filteredCards.length === 0 ? (
                <div className="empty-state">
                  <p>
                    {selectedTag === '__NO_TAG__' 
                      ? 'Aucune carte sans tag trouvée.'
                      : `Aucune carte trouvée avec le tag "${selectedTag}".`}
                  </p>
                </div>
              ) : (
                <div className="cards-grid">
                  {filteredCards.map((card) => (
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
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MyCards;
