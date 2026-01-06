import React, { useState, useEffect } from 'react';

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NOU: STATE PENTRU CAUTARE SI FILTRARE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Available', 'Assigned'

  // State Modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  // State Date
  const [formData, setFormData] = useState({
    name: '', type: 'Laptop', brand: '', serial_number: '', purchase_date: ''
  });
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  // Fetch Data
  const fetchAssets = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/assets');
      const data = await response.json();
      setAssets(data);
      setLoading(false);
    } catch (error) { console.error(error); setLoading(false); }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employees');
      const data = await response.json();
      setEmployees(data.data || data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchAssets();
    fetchEmployees();
  }, []);

  // --- LOGICA CREATE / ASSIGN / RELEASE (Ramane la fel) ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchAssets(); setIsModalOpen(false);
        setFormData({ name: '', type: 'Laptop', brand: '', serial_number: '', purchase_date: '' });
        alert("Echipament adăugat!");
      }
    } catch (error) { console.error(error); }
  };

  const openAssignModal = (asset) => {
    setSelectedAsset(asset); setSelectedEmployeeId(''); setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedEmployeeId) { alert("Selectează un angajat!"); return; }
    try {
        const response = await fetch('http://localhost:3000/api/assets/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assetId: selectedAsset.id, employeeId: selectedEmployeeId }),
        });
        if (response.ok) { fetchAssets(); setIsAssignModalOpen(false); alert("Alocat!"); }
    } catch (error) { console.error(error); }
  };

  const handleRelease = async (assetId) => {
      if(!confirm("Eliberezi echipamentul?")) return;
      try {
        const response = await fetch('http://localhost:3000/api/assets/release', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assetId }),
        });
        if(response.ok) fetchAssets();
      } catch (error) { console.error(error); }
  }

  // --- NOU: LOGICA DE FILTRARE ---
  // Aici se intampla magia: filtram lista inainte sa o desenam pe ecran
  const filteredAssets = assets.filter((asset) => {
      // 1. Filtrare dupa status
      if (filterStatus !== 'All' && asset.status !== filterStatus) return false;

      // 2. Filtrare dupa cautare (Nume, Brand, Serial sau Nume Angajat)
      const searchLower = searchTerm.toLowerCase();
      const matchName = asset.name.toLowerCase().includes(searchLower);
      const matchBrand = asset.brand ? asset.brand.toLowerCase().includes(searchLower) : false;
      const matchSerial = asset.serial_number ? asset.serial_number.toLowerCase().includes(searchLower) : false;
      const matchHolder = asset.holder_name ? asset.holder_name.toLowerCase().includes(searchLower) : false;

      return matchName || matchBrand || matchSerial || matchHolder;
  });

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      
      {/* HEADER + CAUTARE + BUTON */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">📦 Lista Echipamente</h2>
            
            {/* NOU: Zona de Filtre */}
            <div className="flex flex-1 max-w-lg space-x-2">
                <input 
                    type="text"
                    placeholder="Caută (nume, serial, angajat)..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">Toate</option>
                    <option value="Available">Disponibile</option>
                    <option value="Assigned">Alocate</option>
                </select>
            </div>

            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm flex items-center whitespace-nowrap"
            >
                <span className="mr-2 text-lg">+</span> Adaugă
            </button>
        </div>
      </div>

      {/* TABEL - FOLOSIM filteredAssets IN LOC DE assets */}
      <div className="p-0 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Se încarcă activele...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="py-3 px-6 border-b">Echipament</th>
                <th className="py-3 px-6 border-b">Tip</th>
                <th className="py-3 px-6 border-b">Data</th>
                <th className="py-3 px-6 border-b">Status</th>
                <th className="py-3 px-6 border-b">Deținător</th>
                <th className="py-3 px-6 border-b text-center">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 transition-colors border-b">
                    <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{asset.name}</div>
                        <div className="text-xs text-gray-400">{asset.brand} - {asset.serial_number}</div>
                    </td>
                    <td className="py-4 px-6">{asset.type}</td>
                    <td className="py-4 px-6 text-gray-500">{asset.purchase_date || '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        asset.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {asset.status === 'Available' ? 'Disponibil' : 'Alocat'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                        {asset.holder_name ? (
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800">{asset.holder_name}</span>
                                <span className="text-xs text-gray-500">{asset.department}</span>
                            </div>
                        ) : ( <span className="text-gray-400 italic">-</span> )}
                    </td>
                    <td className="py-4 px-6 text-center">
                        {asset.status === 'Available' ? (
                            <button onClick={() => openAssignModal(asset)} className="bg-indigo-500 text-white px-3 py-1 rounded text-xs hover:bg-indigo-600 shadow-sm">Alocă ➡️</button>
                        ) : (
                            <button onClick={() => handleRelease(asset.id)} className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 shadow-sm">⬅️ Returnează</button>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center p-8 text-gray-400">Nu s-au găsit rezultate.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL ADAUGARE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Nou Echipament</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" placeholder="Nume" required className="border p-2 w-full rounded" onChange={handleChange} value={formData.name}/>
                <select name="type" className="border p-2 w-full rounded" onChange={handleChange} value={formData.type}>
                    <option>Laptop</option><option>Monitor</option><option>Licenta</option><option>Periferice</option><option>Telefon</option>
                </select>
                <input name="brand" placeholder="Brand" className="border p-2 w-full rounded" onChange={handleChange} value={formData.brand}/>
                <input name="serial_number" placeholder="Serial Number" className="border p-2 w-full rounded" onChange={handleChange} value={formData.serial_number}/>
                <input name="purchase_date" type="date" className="border p-2 w-full rounded" onChange={handleChange} value={formData.purchase_date}/>
                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Anulează</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvează</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ALOCARE */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Alocare Echipament</h3>
                <p className="text-gray-600 text-sm mb-4">Cui vrei să atribui: <span className="font-semibold">{selectedAsset?.name}</span>?</p>
                <div className="mb-4">
                    <select className="w-full border border-gray-300 rounded-md p-2" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
                        <option value="">-- Alege un angajat --</option>
                        {employees.map(emp => (<option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>))}
                    </select>
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setIsAssignModalOpen(false)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">Anulează</button>
                    <button onClick={handleAssignSubmit} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Confirmă</button>
                </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AssetList;