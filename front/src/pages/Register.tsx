import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    confirmEmail: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.email !== formData.confirmEmail) {
      setError('Les emails ne correspondent pas');
      return;
    }

    if (!formData.name || !formData.email) {
      setError('Tous les champs sont requis');
      return;
    }

    console.log('Register:', formData);
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h1 className="register-title">Créer un compte</h1>
        <p className="register-subtitle">Rejoignez Learning Cards</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nom complet"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Confirmer l'email"
              value={formData.confirmEmail}
              onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-submit">
            S'inscrire
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

export default Register;
