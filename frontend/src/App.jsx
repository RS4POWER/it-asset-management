import { useState } from 'react'
import Navbar from './components/Navbar'
import AssetList from './components/AssetList'
import EmployeeList from './components/EmployeeList' 


function App() {
  // Starea pentru a sti ce pagina vedem: 'assets' sau 'employees'
  const [activeTab, setActiveTab] = useState('assets');

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Meniul de sus */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-6xl mx-auto px-4">
        
        {/* Logica conditionala: Daca tab-ul e 'assets', arata lista de active */}
        {activeTab === 'assets' && (
          <div className="animate-fade-in">
             <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Management Active IT</h1>
                <p className="text-gray-500">Gestionează echipamentele, licențele și perifericele.</p>
             </div>
             <AssetList />
          </div>
        )}

       {/* Daca tab-ul e 'employees', arata lista reala */}
{activeTab === 'employees' && (
  <div className="animate-fade-in">
     <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestiune Angajați</h1>
        <p className="text-gray-500">Administrează personalul și departamentele.</p>
     </div>
     <EmployeeList />
  </div>
)}

      </div>
    </div>
  )
}

export default App