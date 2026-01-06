import React, { useState, useEffect } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtrare
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  // Modale & Editare
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Stim daca editam
  const [editId, setEditId] = useState(null);          // ID-ul celui pe care il editam

  const [formData, setFormData] = useState({ name: '', email: '', department: 'IT' });

  // Fetch
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employees');
      const data = await response.json();
      setEmployees(data.data || data);
      setLoading(false);
    } catch (error) { console.error(error); setLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  // --- LOGICA MODAL ---
  const openAddModal = () => {
      setFormData({ name: '', email: '', department: 'IT' });
      setIsEditMode(false);
      setEditId(null);
      setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
      setFormData({ name: emp.name, email: emp.email, department: emp.department });
      setIsEditMode(true);
      setEditId(emp.id);
      setIsModalOpen(true);
  };

  // --- LOGICA SUBMIT (Create vs Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = isEditMode 
        ? `http://localhost:3000/api/employees/${editId}` 
        : 'http://localhost:3000/api/employees';
    
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchEmployees();
        setIsModalOpen(false);
        setFormData({ name: '', email: '', department: 'IT' });
        alert(isEditMode ? "Angajat modificat!" : "Angajat adăugat!");
      }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
      if(!confirm("Sigur ștergi acest angajat?")) return;
      try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`, { method: 'DELETE' });
        if(response.ok) fetchEmployees();
      } catch (error) { console.error(error); }
  }

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  // Filtrare
  const filteredEmployees = employees.filter(emp => {
      if(filterDept !== 'All' && emp.department !== filterDept) return false;
      const searchLower = searchTerm.toLowerCase();
      return emp.name.toLowerCase().includes(searchLower) || emp.email.toLowerCase().includes(searchLower);
  });

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">👥 Lista Angajați</h2>
        
        <div className="flex flex-1 max-w-lg space-x-2">
            <input 
                type="text" placeholder="Caută..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                <option value="All">Toate Dept.</option><option value="IT">IT</option><option value="HR">HR</option><option value="Sales">Sales</option><option value="Management">Management</option>
            </select>
        </div>

        <button onClick={openAddModal} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm flex items-center">
          <span className="mr-2 text-lg">+</span> Adaugă
        </button>
      </div>

      {/* Tabel */}
      <div className="p-0">
        {loading ? ( <div className="p-8 text-center text-gray-500">Se încarcă...</div> ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="py-3 px-6 border-b">Nume</th>
                <th className="py-3 px-6 border-b">Email</th>
                <th className="py-3 px-6 border-b">Departament</th>
                <th className="py-3 px-6 border-b text-center">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors border-b">
                    <td className="py-4 px-6 font-medium text-gray-900">{emp.name}</td>
                    <td className="py-4 px-6 text-blue-600">{emp.email}</td>
                    <td className="py-4 px-6"><span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">{emp.department}</span></td>
                    <td className="py-4 px-6 text-center">
                        <div className="flex justify-center space-x-2">
                            {/* Buton EDIT */}
                            <button onClick={() => openEditModal(emp)} className="text-blue-500 hover:text-blue-700 font-medium text-xs border border-blue-200 px-2 py-1 rounded hover:bg-blue-50" title="Editează">
                                ✏️
                            </button>
                            {/* Buton DELETE */}
                            <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 px-2 py-1 rounded hover:bg-red-50" title="Șterge">
                                🗑️
                            </button>
                        </div>
                    </td>
                  </tr>
                ))
              ) : ( <tr><td colSpan="4" className="text-center p-4">Nu s-au găsit angajați.</td></tr> )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal UNIFICAT (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{isEditMode ? 'Editează Angajat' : 'Angajat Nou'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" required placeholder="Nume" className="border p-2 w-full rounded" value={formData.name} onChange={handleChange}/>
                <input name="email" required placeholder="Email" className="border p-2 w-full rounded" value={formData.email} onChange={handleChange}/>
                <select name="department" className="border p-2 w-full rounded" value={formData.department} onChange={handleChange}>
                      <option>IT</option><option>HR</option><option>Sales</option><option>Management</option><option>Finance</option>
                </select>
                <div className="mt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Anulează</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                        {isEditMode ? 'Actualizează' : 'Salvează'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;