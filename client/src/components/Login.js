import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', credentials);
      onLogin(response.data.token);
      navigate('/admin');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card auth-card border-0">
        <div className="auth-card-header">
          <i className="bi bi-shield-lock-fill d-block mb-2"></i>
          <h2 className="h4 fw-bold mb-1">Admin Login</h2>
          <p className="mb-0 small opacity-75">管理員登入</p>
        </div>

        <div className="auth-card-body">
          {error && (
            <div className="alert alert-danger d-flex align-items-center py-2 mb-3" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-person"></i></span>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-lock"></i></span>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Logging in...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-2"></i>Login</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;