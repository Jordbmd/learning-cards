import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Learning Cards</h1>
        <p className="home-subtitle">Apprenez efficacement avec la répétition espacée</p>
        
        <div className="home-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Se connecter
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/register')}
          >
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
