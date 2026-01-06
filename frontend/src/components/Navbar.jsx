import React from 'react';

// Primim ca "proprietati" (argumente) functia care schimba pagina
const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo / Titlu */}
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
               IT
             </div>
             <span className="text-xl font-bold text-gray-800">AssetManager</span>
          </div>

          {/* Butoanele de meniu */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-4 py-2 rounded-md transition-colors font-medium ${
                activeTab === 'assets' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              💻 Active IT
            </button>
            
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-4 py-2 rounded-md transition-colors font-medium ${
                activeTab === 'employees' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              👥 Angajați
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;