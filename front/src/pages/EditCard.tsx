import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cardService } from '../services/cardService';
import type { Card } from '../domain/types';
import './EditCard.css';

function EditCard() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCard = async () => {
      if (!id) {
        setError('ID de carte manquant');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const cardData = await cardService.getCardById(id);
        setCard(cardData);
        setFormData({
          question: cardData.question,
          answer: cardData.answer,
          tags: cardData.tags.join(', ')
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la carte');
      } finally {
        setIsLoading(false);
      }
    };

    loadCard();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.question || !formData.answer) {
      setError('La question et la réponse sont requises');
      return;
    }

    if (!id) {
      setError('ID de carte manquant');
      return;
    }

    setIsSaving(true);

    try {
      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      await cardService.updateCard(id, {
        question: formData.question,
        answer: formData.answer,
        tags
      });

      navigate('/cards');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification de la carte');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="edit-card-container">
        <div className="edit-card-card">
          <div className="loading">Chargement de la carte...</div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="edit-card-container">
        <div className="edit-card-card">
          <div className="error-message">{error || 'Carte non trouvée'}</div>
          <button className="btn-back" onClick={() => navigate('/cards')}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-card-container">
      <div className="edit-card-card">
        <h1>Modifier la carte</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="question">Question</label>
            <textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Entrez votre question"
              rows={4}
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="answer">Réponse</label>
            <textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Entrez la réponse"
              rows={4}
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (optionnel)</label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ex: javascript, react, frontend (séparés par des virgules)"
              disabled={isSaving}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="submit" className="btn-submit" disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button type="button" className="btn-back" onClick={() => navigate('/cards')}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCard;
