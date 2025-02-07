import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
          <h1 className="text-4xl font-light mb-4">Complete Your Purchase</h1>
          <p className="text-gray-400">Please sign in or create an account to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sign In Option */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300 group">
            <h2 className="text-2xl font-light mb-4">Sign In</h2>
            <p className="text-gray-400 mb-6">Already have an account? Sign in to continue your purchase</p>
            <button
              onClick={() => navigate('/auth/signin')}
              className="w-full bg-yellow-500 text-black py-4 rounded-xl flex items-center justify-center gap-2 
                group-hover:bg-yellow-400 transition-colors"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Create Account Option */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300 group">
            <h2 className="text-2xl font-light mb-4">Create Account</h2>
            <p className="text-gray-400 mb-6">New to our store? Create an account for a better shopping experience</p>
            <button
              onClick={() => navigate('/auth/signup')}
              className="w-full border-2 border-yellow-500 text-yellow-500 py-4 rounded-xl flex items-center justify-center gap-2
                hover:bg-yellow-500 hover:text-black transition-all group-hover:scale-[1.02]"
            >
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage