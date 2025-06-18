import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ isLoggedIn, onLogout }) {
  const location = useLocation();

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          {isLoggedIn && (
            <>
            <p className="text-white text-lg font-bold"> IdeaManager</p>
              <Link
                to="/dashboard"
                className={`text-white hover:text-gray-300 px-3 py-2 rounded-md ${
                  location.pathname === "/dashboard" ? "bg-gray-900" : ""
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/idealist"
                className={`text-white hover:text-gray-300 px-3 py-2 rounded-md ${
                  location.pathname === "/idealist" ? "bg-gray-900" : ""
                }`}
              >
                Browse Ideas
              </Link>
              <Link
                to="/your-ideas"
                className={`text-white hover:text-gray-300 px-3 py-2 rounded-md ${
                  location.pathname === "/your-ideas" ? "bg-gray-900" : ""
                }`}
              >
                Your Ideas
              </Link>
            </>
          )}
        </div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md "
            >
              Logout
            </button>
          ) : (
           <div className="text-white space-x-4 hover:text-gray-300 px-3 py-2 rounded-md"> IdeaManager</div>
          )}
        </div>
      </div>
    </nav>
  );
}
