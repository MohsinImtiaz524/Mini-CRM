import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } else {
      const result = await register(formData.username, formData.email, formData.password);
      if (result.success) {
        setSuccess(result.message);
        setIsLogin(true); // Switch to login mode
        setFormData({ ...formData, password: '' }); // Clear password for security
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-bg-subtle text-text-main">
      <div className="card w-full max-w-[400px] p-8 bg-bg-card">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl inline-flex items-center justify-center mb-4 text-white text-2xl font-bold">
            M
          </div>
          <h1 className="text-2xl font-bold text-text-main">Mini CRM</h1>
          <p className="text-text-subtle mt-2">
            {isLogin ? 'Welcome back, please login' : 'Create your account to get started'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-5 border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-5 border border-green-100">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-5">
              <label className="label">Username</label>
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="mb-5">
            <label className="label">Email address</label>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full h-11" 
            disabled={loading}
          >
            {loading ? (
              <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full inline-block animate-spin"></span>
            ) : (
              isLogin ? 'Sign in' : 'Create account'
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <span className="text-text-subtle">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary font-semibold bg-transparent p-0 text-sm hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
