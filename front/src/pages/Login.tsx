import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('L\'email est requis');
      return;
    }

    console.log('Login:', email);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">Connexion</h1>
        <p className="login-subtitle">Accédez à votre compte Learning Cards</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-submit">
            Se connecter
          </button>

          <button 
            type="button" 
            className="btn-back"
            onClick={() => navigate('/')}
          >
            Retour
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
