import { useState } from 'react'
import Navbar from './components/Navbar'
import AssetList from './components/AssetList'
import EmployeeList from './components/EmployeeList'
import Dashboard from './components/Dashboard'
import HistoryLog from './components/HistoryLog' 

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Meniul de sus */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-6xl mx-auto px-4">
        
        {/* RUTA DASHBOARD */}
        {activeTab === 'dashboard' && <Dashboard />}

        {/* RUTA ACTIVE (Assets) */}
        {activeTab === 'assets' && (
          <div className="animate-fade-in">
             <AssetList />
          </div>
        )}

        {/* RUTA ANGAJATI (Employees) */}
        {activeTab === 'employees' && (
          <div className="animate-fade-in">
             <EmployeeList />
          </div>
        )}

        {/* RUTA ISTORIC (History) - Aici trebuia pusa! */}
        {activeTab === 'history' && (
           <div className="animate-fade-in">
              <HistoryLog />
           </div>
        )}

      </div>
    </div>
  )
}

export default App