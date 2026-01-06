import { useState } from 'react'
import Navbar from './components/Navbar'
import AssetList from './components/AssetList'
import EmployeeList from './components/EmployeeList'
import Dashboard from './components/Dashboard' // Importam dashboard-ul

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // Pornim direct pe Dashboard

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-6xl mx-auto px-4">
        
        {/* RUTA DASHBOARD */}
        {activeTab === 'dashboard' && <Dashboard />}

        {/* RUTA ASSETS */}
        {activeTab === 'assets' && (
          <div className="animate-fade-in">
             <AssetList />
          </div>
        )}

        {/* RUTA EMPLOYEES */}
        {activeTab === 'employees' && (
          <div className="animate-fade-in">
             <EmployeeList />
          </div>
        )}

      </div>
    </div>
  )
}

export default App