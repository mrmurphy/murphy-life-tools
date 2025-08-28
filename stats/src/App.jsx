import React from 'react';
import { Route, Routes } from 'wouter';
import './App.css';

// Import components
import Home from './components/Home';
import StatsList from './components/StatsList';
import AddStat from './components/AddStat';
import EditStat from './components/EditStat';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Stats Tracker</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/stats" component={StatsList} />
          <Route path="/add-stat" component={AddStat} />
          <Route path="/edit-stat/:id" component={EditStat} />
        </Routes>
      </main>
    </div>
  );
}

export default App;