import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password); 
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 bg-cover bg-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1728665392221-d4525559b83f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGxpdmVzdG9ja3xlbnwwfHwwfHx8MA%3D%3D)`,
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-lg shadow-lg p-6 sm:p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Livestock DMS</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;