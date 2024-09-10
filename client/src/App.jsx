import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MultiLevelSidebar } from './components/sideNavBar';
import { SalesRecord } from './components/salesRecord';
import { CustomerRecord } from './components/customerRecord';
import { SalesRecordBarChart } from './components/salesRecordBarChart';
import { SeasonalDemand } from './components/customerDemand';
import { SalesRecordPieChart } from './components/salesRecordPieChart';
import { CustomerRecordBarChart } from './components/customerRecordBarChart';
import { CustomerRecordPieChart } from './components/customerRecordPieChart';


function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        {/* Sidebar Component */}
        <MultiLevelSidebar className="w-64 bg-gray-100" />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route
              path="/sales-forecasting"
              element={
                <>
                  <SalesRecord />
                  <br></br>
                  <SalesRecordBarChart />
                  <br></br>
                  <SalesRecordPieChart/>
                </>
              }
            />
            <Route
              path="/customer-segmentation"
              element={
                <>
                  <CustomerRecord />
                  <br></br>
                  <CustomerRecordBarChart />
                  <br></br>
                  <CustomerRecordPieChart />
                </>
              }
            />
            <Route
              path="/customer-demand-analysis"
              element={<SeasonalDemand />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
