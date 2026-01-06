import React, { useState, useEffect } from 'react';

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]); // NOU: Lista de angajati pentru dropdown
  const [loading, setLoading] = useState(true);
  
  // Stare pentru Modalul de Adaugare
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Laptop',
    brand: '',
    serial_number: '',
    purchase_date: ''
  });

  // NOU: Stare pentru Modalul de Alocare
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null); // Ce echipament alocam?
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(''); // Cui il dam?

  // 1. Functia care aduce ACTIVELE
  const fetchAssets = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/assets');
      const data = await response.json();
      setAssets(data);
      setLoading(false);
    } catch (error) {
      console.error("Eroare active:", error);
      setLoading(false);
    }
  };

  // 2. NOU: Functia care aduce ANGAJATII (ca sa avem ce pune in select)
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employees');
      const data = await response.json();
      setEmployees(data.data || data); // Backend-ul trimite {data: [...]} sau [...]
    } catch (error) {
      console.error("Eroare angajati:", error);
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchEmployees(); // Luam si angajatii cand se incarca pagina
  }, []);

  // --- LOGICA FORMULAR ADAUGARE (CREATE) ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchAssets();
        setIsModalOpen(false);
        setFormData({ name: '', type: 'Laptop', brand: '', serial_number: '', purchase_date: '' });
        alert("Echipament adăugat!");
      }
    } catch (error) { console.error(error); }
  };

  // --- NOU: LOGICA DE ALOCARE (ASSIGN) ---
  const openAssignModal = (asset) => {
    setSelectedAsset(asset);
    setSelectedEmployeeId(''); // Resetam selectia anterioara
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedEmployeeId) {
      alert("Te rog selectează un angajat!");
      return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/assets/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                assetId: selectedAsset.id, 
                employeeId: selectedEmployeeId 
            }),
        });

        if (response.ok) {
            fetchAssets(); // Refresh la tabel
            setIsAssignModalOpen(false); // Inchidem modalul
            alert("Echipament alocat cu succes!");
        } else {
            alert("Eroare la alocare");
        }
    } catch (error) {
        console.error(error);
    }
  };

  // --- NOU: LOGICA DE ELIBERARE (RETURN) ---
  const handleRelease = async (assetId) => {
      if(!confirm("Sigur vrei să eliberezi acest echipament?")) return;

      try {
        const response = await fetch('http://localhost:3000/api/assets/release', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assetId }),
        });
        if(response.ok) {
            fetchAssets();
        }
      } catch (error) { console.error(error); }
  }


  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      
      {/* HEADER + BUTON ADAUGARE */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">📦 Lista Echipamente</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm flex items-center"
        >
          <span className="mr-2 text-lg">+</span> Adaugă
        </button>
      </div>

      {/* TABEL */}
      <div className="p-0 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Se încarcă activele...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="py-3 px-6 border-b">Echipament</th>
                <th className="py-3 px-6 border-b">Tip</th>
                <th className="py-3 px-6 border-b">Data Achiziției</th> {/* NOU: Am adaugat coloana */}
                <th className="py-3 px-6 border-b">Status</th>
                <th className="py-3 px-6 border-b">Deținător</th>
                <th className="py-3 px-6 border-b text-center">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 transition-colors border-b">
                    <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{asset.name}</div>
                        <div className="text-xs text-gray-400">{asset.brand} - {asset.serial_number}</div>
                    </td>
                    <td className="py-4 px-6">{asset.type}</td>
                    
                    {/* NOU: Afisam Data */}
                    <td className="py-4 px-6 text-gray-500">
                        {asset.purchase_date || '-'}
                    </td>

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
                        ) : (
                            <span className="text-gray-400 italic">-</span>
                        )}
                    </td>
                    <td className="py-4 px-6 text-center">
                        {/* NOU: Butoane conditionale */}
                        {asset.status === 'Available' ? (
                            <button 
                                onClick={() => openAssignModal(asset)}
                                className="bg-indigo-500 text-white px-3 py-1 rounded text-xs hover:bg-indigo-600 shadow-sm"
                            >
                                Alocă ➡️
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleRelease(asset.id)}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 shadow-sm"
                            >
                                ⬅️ Returnează
                            </button>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center p-4">Nu sunt date.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL ADAUGARE (vechiul modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Nou Echipament</h3>
            <form onSubmit={handleSubmit}>
                {/* ... (Campurile formularului sunt la fel, am scurtat codul aici ca e identic cu ce aveai) ... */}
                {/* Daca dai copy paste, asigura-te ca ai pus tot formularul aici sau pastreaza-l pe cel vechi */}
                 <div className="space-y-4">
                    <input name="name" placeholder="Nume" required className="border p-2 w-full rounded" onChange={handleChange}/>
                    <select name="type" className="border p-2 w-full rounded" onChange={handleChange}>
                        <option>Laptop</option><option>Monitor</option><option>Licenta</option>
                    </select>
                    <input name="brand" placeholder="Brand" className="border p-2 w-full rounded" onChange={handleChange}/>
                    <input name="serial_number" placeholder="Serial Number" className="border p-2 w-full rounded" onChange={handleChange}/>
                    <input name="purchase_date" type="date" className="border p-2 w-full rounded" onChange={handleChange}/>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Anulează</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvează</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* NOU: MODAL ALOCARE */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Alocare Echipament</h3>
                <p className="text-gray-600 text-sm mb-4">
                    Cui vrei să atribui: <span className="font-semibold">{selectedAsset?.name}</span>?
                </p>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selectează Angajat</label>
                    <select 
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    >
                        <option value="">-- Alege un angajat --</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} ({emp.department})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button 
                        onClick={() => setIsAssignModalOpen(false)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        Anulează
                    </button>
                    <button 
                        onClick={handleAssignSubmit}
                        className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Confirmă Alocarea
                    </button>
                </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AssetList;