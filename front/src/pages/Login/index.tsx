import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('L\'email est requis');
      return;
    }

    setIsLoading(true);

    try {
      const user = await userService.getUserByEmail(email);

      if (!user) {
        setError('Aucun utilisateur trouvé avec cet email');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userId', user.id);
      console.log('Utilisateur connecté:', user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <button 
          type="button" 
          className="btn-back-chevron"
          onClick={() => navigate('/')}
          aria-label="Retour"
        >
          <ArrowBackIcon />
        </button>
        
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

          <div className="button-group">
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
            <button 
              type="button" 
              className="btn-register"
              onClick={() => navigate('/register')}
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
