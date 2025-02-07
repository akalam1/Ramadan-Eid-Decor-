import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserMenu = ({ isOpen, onClose }: UserMenuProps) => {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div
        ref={menuRef}
        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg py-2 z-50"
      >
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium mb-2">Welcome</h3>
          <p className="text-gray-600 mb-4">Sign in to manage your account</p>
          <button
            onClick={() => {
              onClose();
              navigate('/auth/signin');
            }}
            className="w-full bg-yellow-500 text-white py-3 rounded-xl mb-2 hover:bg-yellow-400 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/auth/signup');
            }}
            className="w-full border-2 border-yellow-500 text-yellow-500 py-3 rounded-xl
              hover:bg-yellow-500 hover:text-white transition-all"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg py-2 z-50"
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <User className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="py-2">
        <button
          onClick={() => {
            signOut();
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu