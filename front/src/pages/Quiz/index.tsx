import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardService } from '../../services/cardService';
import type { Card } from '../../domain/types';
import { getCategoryLabel } from '../../domain/types';
import Header from '../../components/Header';
import '../../styles/common.css';
import './Quiz.css';

function Quiz() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    loadQuizCards();
  }, []);

  const loadQuizCards = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [quizData, allData] = await Promise.all([
        cardService.getQuizzCards(),
        cardService.getAllCards()
      ]);
      
      setCards(quizData);
      setAllCards(allData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du quizz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (isValid: boolean) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    try {
      await cardService.answerCard(currentCard.id, isValid);
      
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
        setUserAnswer('');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réponse');
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="loading-state">Chargement du quizz...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="error-state">{error}</div>
        </div>
      </>
    );
  }

  if (cards.length === 0) {
    const hasCards = allCards.length > 0;
    
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="empty-state">
            {hasCards ? (
              <>
                <h2>Aucune carte à réviser aujourd'hui</h2>
                <p>Toutes vos cartes sont à jour ! Revenez demain pour continuer votre apprentissage.</p>
              </>
            ) : (
              <>
                <h2>Aucune carte disponible</h2>
                <p>Vous n'avez pas encore créé de cartes. Commencez par créer votre première carte !</p>
                <button className="btn-primary" onClick={() => navigate('/cards/create')}>
                  Créer ma première carte
                </button>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-content">
          <div className="page-header">
            <h1>Quizz du jour</h1>
            <div className="quiz-progress">
              Carte {currentIndex + 1} / {cards.length}
            </div>
          </div>

          <div className="quiz-card">
            <div className="category-badge">
              {getCategoryLabel(currentCard.category)}
            </div>

            <div className="quiz-section">
              <h2>Question</h2>
              <p>{currentCard.question}</p>
            </div>

            <div className="quiz-section">
              <h2>Votre réponse</h2>
              <textarea
                className="answer-input"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Tapez votre réponse ici..."
                disabled={showAnswer}
              />
            </div>

            {showAnswer && (
              <div className="answer-comparison">
                <div className="comparison-box user-response">
                  <h3>Votre réponse</h3>
                  <p>{userAnswer || '(Aucune réponse fournie)'}</p>
                </div>
                <div className="comparison-box expected-answer">
                  <h3>Réponse attendue</h3>
                  <p>{currentCard.answer}</p>
                </div>
              </div>
            )}

            <div className="quiz-actions">
              {!showAnswer ? (
                <button 
                  className="btn-show-answer"
                  onClick={() => setShowAnswer(true)}
                >
                  Voir la réponse
                </button>
              ) : (
                <div className="answer-buttons">
                  <button 
                    className="btn-wrong"
                    onClick={() => handleAnswer(false)}
                  >
                    Mauvaise réponse
                  </button>
                  <button 
                    className="btn-correct"
                    onClick={() => handleAnswer(true)}
                  >
                    Bonne réponse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Quiz;
