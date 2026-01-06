import { useState } from 'react'
import Navbar from './components/Navbar'
import AssetList from './components/AssetList'
// O sa facem si componenta EmployeeList separat data viitoare, 
// dar momentan lasam un placeholder simplu sau o mutam.
// Pentru simplitate acum, hai sa folosim logica de comutare.

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

        {/* Daca tab-ul e 'employees', arata un mesaj temporar (urmeaza sa facem componenta) */}
        {activeTab === 'employees' && (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Secțiunea Angajați</h2>
            <p className="text-gray-500">Aici vom muta tabelul cu angajați pe care l-am făcut anterior.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default App