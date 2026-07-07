import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          JobBoard
        </Link>
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="nav-link">
              Browse Jobs
            </Link>
          </li>
          {user ? (
            <>
              {user.role === 'employer' ? (
                <li>
                  <Link to="/employer-dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/candidate-dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <button className="nav-link btn-logout" onClick={logout}>
                  Logout ({user.name})
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="nav-link btn btn-primary">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
