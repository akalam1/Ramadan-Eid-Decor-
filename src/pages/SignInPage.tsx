import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email, password);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24">
      <div className="max-w-md mx-auto px-4">
        <Link to="/checkout" className="inline-flex items-center text-gray-400 hover:text-white mb-8 group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Checkout
        </Link>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
          <h1 className="text-3xl font-light mb-8 text-center">Welcome Back</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 pl-12
                    focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Enter your email"
                />
                <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 pl-12
                    focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Enter your password"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-600 text-yellow-500 focus:ring-yellow-500" />
                <span className="ml-2 text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-yellow-500 hover:text-yellow-400">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-black py-4 rounded-xl hover:bg-yellow-400 
                transition-colors transform hover:scale-[1.02]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="text-yellow-500 hover:text-yellow-400">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage