import React from 'react';
import logo from './logo.svg';
import './App.css';
import EditPurchaseOrder from './components/purchaseOrder/editPurchaseOrder';

function App() {
  return (
    <div className="App">
      <EditPurchaseOrder purchaseOrder={undefined} />
    </div>
  );
}

export default App;
