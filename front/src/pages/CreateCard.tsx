import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardService } from '../services/cardService';
import Header from '../components/Header';
import '../styles/common.css';
import './CreateCard.css';

function CreateCard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    tag: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.question || !formData.answer) {
      setError('La question et la réponse sont requises');
      return;
    }

    setIsLoading(true);

    try {
      await cardService.createCard({
        question: formData.question,
        answer: formData.answer,
        tag: formData.tag || undefined
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la carte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-content">
          <div className="page-header">
            <h1>Créer une carte</h1>
          </div>

          <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="question">Question</label>
                <textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Entrez votre question"
                  rows={4}
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tag">Tag (optionnel)</label>
                <input
                  type="text"
                  id="tag"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="Ex: javascript"
                  disabled={isLoading}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="button-group">
                <button type="submit" className="btn-submit" disabled={isLoading}>
                  {isLoading ? 'Création...' : 'Créer la carte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }

export default CreateCard;
