import React, { useState, useEffect } from 'react';

const HistoryLog = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (nou -> vechi) sau 'asc'

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/history');
        const data = await res.json();
        setLogs(data);
      } catch (e) { console.error(e); }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString('ro-RO');

  const getActionColor = (action) => {
      switch(action) {
          case 'ALOCARE': return 'text-blue-600 font-bold';
          case 'RETURNARE': return 'text-orange-600 font-bold';
          case 'ADAUGARE': return 'text-green-600 font-bold';
          case 'STERGERE': return 'text-red-600 font-bold';
          default: return 'text-gray-600';
      }
  };

  // --- LOGICA FILTRARE SI SORTARE ---
  const filteredLogs = logs
    .filter(log => {
        const search = searchTerm.toLowerCase();
        return (
            log.asset_name.toLowerCase().includes(search) ||
            (log.asset_serial && log.asset_serial.toLowerCase().includes(search)) ||
            (log.employee_name && log.employee_name.toLowerCase().includes(search)) ||
            log.action.toLowerCase().includes(search)
        );
    })
    .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // --- LOGICA EXPORT CSV ---
  const exportCSV = () => {
      const headers = "Data,Actiune,Echipament,Serial,Angajat\n";
      const rows = filteredLogs.map(log => 
          `"${formatDate(log.date)}","${log.action}","${log.asset_name}","${log.asset_serial || '-'}","${log.employee_name || '-'}"`
      ).join("\n");
      
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'istoric_audit.csv';
      a.click();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 animate-fade-in">
        
        {/* HEADER CU TOOLBAR */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">📜 Istoric Audit</h2>
            
            <div className="flex space-x-2 w-full md:w-auto">
                {/* Search */}
                <input 
                    type="text" 
                    placeholder="Caută (nume, serial, angajat)..." 
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-64 focus:outline-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                {/* Sort Button */}
                <button 
                    onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="border border-gray-300 bg-white px-3 py-2 rounded text-sm hover:bg-gray-50 font-medium"
                    title="Schimbă ordinea (Dată)"
                >
                    {sortOrder === 'desc' ? '⬇️ Noi' : '⬆️ Vechi'}
                </button>

                {/* Export CSV */}
                <button 
                    onClick={exportCSV}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 font-medium flex items-center shadow-sm"
                >
                    📥 Export
                </button>
            </div>
        </div>
        
        {/* TABEL */}
        <div className="p-0 overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold sticky top-0">
                    <tr>
                        <th className="py-3 px-6 border-b">Data / Ora</th>
                        <th className="py-3 px-6 border-b">Acțiune</th>
                        <th className="py-3 px-6 border-b">Echipament</th>
                        <th className="py-3 px-6 border-b">Serial Number</th> {/* Coloana NOUA */}
                        <th className="py-3 px-6 border-b">Angajat Implicat</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 border-b">
                                <td className="py-3 px-6 whitespace-nowrap">{formatDate(log.date)}</td>
                                <td className={`py-3 px-6 ${getActionColor(log.action)}`}>{log.action}</td>
                                <td className="py-3 px-6 font-medium">{log.asset_name}</td>
                                <td className="py-3 px-6 font-mono text-gray-500">{log.asset_serial || '-'}</td>
                                <td className="py-3 px-6">{log.employee_name || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" className="text-center p-6 text-gray-500">Niciun rezultat găsit.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default HistoryLog;