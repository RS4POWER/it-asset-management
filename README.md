# IT Asset Management Web Application

O aplicație web completă pentru gestionarea activelor IT dintr-o organizație (Laptopuri, Monitoare, Licențe, etc.), inclusiv alocarea acestora către angajați și urmărirea istoricului (Audit Log).

## 🚀 Funcționalități Principale
1.  **Dashboard:** Statistici în timp real despre echipamente și disponibilitate.
2.  **Gestiune Active (CRUD):** Adăugare, Modificare, Ștergere, Căutare și Filtrare echipamente.
3.  **Gestiune Angajați:** Administrarea personalului și a departamentelor.
4.  **Alocare & Returnare:** Flux complet de atribuire a unui echipament către un angajat.
5.  **Audit Log (Istoric):** Jurnal detaliat al tuturor acțiunilor (cine, ce, când), inclusiv Serial Number.
6.  **Export Date:** Posibilitatea de a exporta istoricul în format CSV.

## 🛠️ Tehnologii Folosite
* **Frontend:** React.js + Tailwind CSS (Vite)
* **Backend:** Node.js + Express
* **Bază de Date:** SQLite (Persistentă local)

## 📥 Instalare și Rulare

Ai nevoie de [Node.js](https://nodejs.org/) instalat.

### 1. Configurare Backend (Server)
Deschide un terminal în folderul `backend`:

```bash
cd backend
npm install
npm run dev
```
### 1. Configurare Frontend (interfata)
```bash
cd frontend
npm install
npm run dev
```

### 📝 Notă
Pentru a testa funcționalitățile:

Adăugați mai întâi un angajat din secțiunea "Angajați".

Adăugați un echipament din secțiunea "Active IT".

Folosiți butonul "Alocă" pentru a atribui echipamentul angajatului.