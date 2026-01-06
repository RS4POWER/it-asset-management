import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
  // Helper pentru stilizarea butoanelor
  const getButtonClass = (tabName) => `px-4 py-2 rounded-md transition-colors font-medium ${
      activeTab === tabName ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
  }`;

  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">IT</div>
             <span className="text-xl font-bold text-gray-800">AssetManager</span>
          </div>

          <div className="flex space-x-2">
            <button onClick={() => setActiveTab('dashboard')} className={getButtonClass('dashboard')}>
              📊 Dashboard
            </button>
            <button onClick={() => setActiveTab('assets')} className={getButtonClass('assets')}>
              💻 Active IT
            </button>
            <button onClick={() => setActiveTab('employees')} className={getButtonClass('employees')}>
              👥 Angajați
            </button>
            <button onClick={() => setActiveTab('history')} className={getButtonClass('history')}>
            📜 Istoric
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;