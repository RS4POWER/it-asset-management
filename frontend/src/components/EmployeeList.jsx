import React, { useState, useEffect } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stare pentru Modal Adaugare
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'IT'
  });

  // 1. Citire Angajati
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employees');
      const data = await response.json();
      setEmployees(data.data || data); // Tratare flexibila a raspunsului
      setLoading(false);
    } catch (error) {
      console.error("Eroare:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. Adaugare Angajat
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchEmployees();
        setIsModalOpen(false);
        setFormData({ name: '', email: '', department: 'IT' });
        alert("Angajat adăugat!");
      }
    } catch (error) { console.error(error); }
  };

  // 3. Stergere Angajat
  const handleDelete = async (id) => {
      if(!confirm("Ești sigur că vrei să ștergi acest angajat?")) return;

      try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
            method: 'DELETE',
        });
        if(response.ok) fetchEmployees();
      } catch (error) { console.error(error); }
  }

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">👥 Lista Angajați</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm flex items-center"
        >
          <span className="mr-2 text-lg">+</span> Adaugă Angajat
        </button>
      </div>

      {/* Tabel */}
      <div className="p-0">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Se încarcă...</div>
        ) : (
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
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors border-b">
                    <td className="py-4 px-6 font-medium text-gray-900">{emp.name}</td>
                    <td className="py-4 px-6 text-blue-600">{emp.email}</td>
                    <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">
                            {emp.department}
                        </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                        <button 
                            onClick={() => handleDelete(emp.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                        >
                            🗑️ Șterge
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center p-4">Nu există angajați.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Adaugare */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Angajat Nou</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nume și Prenume</label>
                  <input name="name" required placeholder="Ex: Ion Popescu" 
                         className="border p-2 w-full rounded mt-1" 
                         value={formData.name} onChange={handleChange}/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input name="email" type="email" required placeholder="ion@firma.com" 
                         className="border p-2 w-full rounded mt-1" 
                         value={formData.email} onChange={handleChange}/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Departament</label>
                  <select name="department" className="border p-2 w-full rounded mt-1" 
                          value={formData.department} onChange={handleChange}>
                      <option>IT</option>
                      <option>HR</option>
                      <option>Sales</option>
                      <option>Management</option>
                      <option>Finance</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Anulează</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Salvează</button>
                </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeList;