import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';

// Layout Components
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';

// Pages
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Topology from './pages/Topology';
import AlertCenter from './pages/AlertCenter';
import Logs from './pages/Logs';
import AlertRules from './pages/AlertRules';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#3B82F6',
            colorBgBase: '#121212',
            colorBgContainer: '#1E293B',
            borderRadius: 6,
            fontFamily: "'Inter', system-ui, sans-serif",
          },
        }}
      >
        <Layout className="min-h-screen">
          <Sidebar />
          <Layout className="ml-0 lg:ml-[240px] transition-all duration-200">
            <TopNav />
            <Content className="p-0 min-h-[calc(100vh-64px)] overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/topology" element={<Topology />} />
                <Route path="/alerts" element={<AlertCenter />} />
            <Route path="/alerts/rules" element={<AlertRules />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/settings" element={
                  <div className="p-8 text-text-secondary">System Settings (Coming Soon)</div>
                } />
                {/* Fallback for legacy path */}
                <Route path="/monitoring" element={<Monitoring />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </Router>
  );
};

export default App;

