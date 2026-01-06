import React, { useState, useEffect } from 'react';

const HistoryLog = () => {
  const [logs, setLogs] = useState([]);

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

  // Helper pentru formatarea datei
  const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString('ro-RO');
  };

  // Helper pentru culori in functie de actiune
  const getActionColor = (action) => {
      switch(action) {
          case 'ALOCARE': return 'text-blue-600 font-bold';
          case 'RETURNARE': return 'text-orange-600 font-bold';
          case 'ADAUGARE': return 'text-green-600 font-bold';
          case 'STERGERE': return 'text-red-600 font-bold';
          default: return 'text-gray-600';
      }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">📜 Istoric Acțiuni (Audit)</h2>
        </div>
        
        <div className="p-0 overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold sticky top-0">
                    <tr>
                        <th className="py-3 px-6 border-b">Data / Ora</th>
                        <th className="py-3 px-6 border-b">Acțiune</th>
                        <th className="py-3 px-6 border-b">Echipament</th>
                        <th className="py-3 px-6 border-b">Angajat Implicat</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 border-b">
                            <td className="py-3 px-6">{formatDate(log.date)}</td>
                            <td className={`py-3 px-6 ${getActionColor(log.action)}`}>{log.action}</td>
                            <td className="py-3 px-6 font-medium">{log.asset_name}</td>
                            <td className="py-3 px-6">{log.employee_name || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {logs.length === 0 && <div className="p-6 text-center text-gray-500">Nicio activitate recentă.</div>}
        </div>
    </div>
  );
};

export default HistoryLog;