import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  // Avem nevoie de datele de la ambele tabele pentru a calcula statistici
  const [stats, setStats] = useState({
    totalAssets: 0,
    assignedAssets: 0,
    availableAssets: 0,
    totalEmployees: 0,
  });

  useEffect(() => {
    // Facem fetch la tot in paralel
    const fetchData = async () => {
      try {
        const [resAssets, resEmps] = await Promise.all([
          fetch('http://localhost:3000/api/assets'),
          fetch('http://localhost:3000/api/employees')
        ]);

        const assets = await resAssets.json();
        const emps = await resEmps.json(); 

        // Calculam statisticile
        const totalAssets = assets.length;
        const assignedAssets = assets.filter(a => a.status === 'Assigned').length;
        const availableAssets = assets.filter(a => a.status === 'Available').length;
        const totalEmployees = emps.data ? emps.data.length : emps.length;

        setStats({ totalAssets, assignedAssets, availableAssets, totalEmployees });

      } catch (error) {
        console.error("Eroare dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Panou de Control</h2>

      {/* Grid de Carduri Statistice */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1: Total Echipamente */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="text-gray-500 text-sm font-medium uppercase">Total Echipamente</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalAssets}</div>
        </div>

        {/* Card 2: Disponibile */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="text-gray-500 text-sm font-medium uppercase">Disponibile</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats.availableAssets}</div>
        </div>

        {/* Card 3: Alocate */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="text-gray-500 text-sm font-medium uppercase">Alocate</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">{stats.assignedAssets}</div>
        </div>

        {/* Card 4: Angajati */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="text-gray-500 text-sm font-medium uppercase">Total Angajați</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalEmployees}</div>
        </div>
      </div>

      {/* Sectiune informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">Bine ai venit!</h3>
        <p className="text-blue-600">
          Folosește meniul de sus pentru a naviga la secțiunea <strong>Active IT</strong> pentru a gestiona echipamentele 
          sau la <strong>Angajați</strong> pentru a gestiona personalul.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;