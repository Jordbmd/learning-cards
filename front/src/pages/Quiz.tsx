import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardService } from '../services/cardService';
import { userService } from '../services/userService';
import type { Card } from '../domain/types';
import { getCategoryLabel } from '../domain/types';
import './Quiz.css';

function Quiz() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizBlocked, setQuizBlocked] = useState(false);

  useEffect(() => {
    checkAvailabilityAndLoadCards();
  }, []);

  const checkAvailabilityAndLoadCards = async () => {
    try {
      setIsLoading(true);
      setError('');

      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Vous devez être connecté');
        return;
      }

      const availability = await userService.checkQuizAvailability(userId);
      
      if (!availability.canDoQuiz) {
        setQuizBlocked(true);
        setIsLoading(false);
        return;
      }

      const data = await cardService.getQuizzCards();
      setCards(data);
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
      } else {
        const userId = localStorage.getItem('userId');
        if (userId) {
          await userService.markQuizCompleted(userId);
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réponse');
    }
  };

  if (isLoading) {
    return (
      <div className="quiz-container">
        <div className="loading">Chargement du quizz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error-message">{error}</div>
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          Retour
        </button>
      </div>
    );
  }

  if (quizBlocked) {
    return (
      <div className="quiz-container">
        <div className="empty-state">
          <h2>Quiz déjà effectué aujourd'hui</h2>
          <p>Vous avez déjà complété votre quiz quotidien. Revenez demain !</p>
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="quiz-container">
        <div className="empty-state">
          <h2>Aucune carte à réviser aujourd'hui</h2>
          <p>Revenez demain pour continuer votre apprentissage !</p>
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            Retour
        </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Quizz du jour</h1>
        <div className="progress">
          Carte {currentIndex + 1} / {cards.length}
        </div>
      </div>

      <div className="card-display">
        <div className="category-badge">
          {getCategoryLabel(currentCard.category)}
        </div>

        <div className="question-section">
          <h2>Question</h2>
          <p>{currentCard.question}</p>
        </div>

        {showAnswer && (
          <div className="answer-section">
            <h2>Réponse</h2>
            <p>{currentCard.answer}</p>
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
  );
}

export default Quiz;
