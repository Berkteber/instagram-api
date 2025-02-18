import React from 'react';
import AggregatedMetrics from './components/AggregatedMetrics';
import Fetchdata from './components/fetchInsightsData'

function App() {
  return (
    <div className="App">
      <h1>Instagram Performans Verileri</h1>
      <AggregatedMetrics />
      <Fetchdata/>
    </div>
  );
}

export default App;
