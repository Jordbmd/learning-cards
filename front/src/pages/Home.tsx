import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Learning Cards</h1>
        <p className="home-subtitle">Apprenez efficacement avec la répétition espacée</p>
        
        <div className="home-buttons">
          <button className="btn btn-primary">
            Se connecter
          </button>
          <button className="btn btn-secondary">
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
