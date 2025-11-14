import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Chat from './pages/Chat/Chat';
import Agents from './pages/Agents/Agents';
import AgentBuilder from './pages/Agents/AgentBuilder';
import MCPRegistry from './pages/MCP/MCPRegistry';
import MCPInspector from './pages/MCP/MCPInspector';
import MCPClient from './pages/MCP/MCPClient';
import MCPBridge from './pages/MCP/MCPBridge';
import MCPBridgeRegistry from './pages/MCP/MCPBridgeRegistry';
import './App.scss';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<Chat />} />
          <Route path="agents" element={<Agents />} />
          <Route path="agents/builder" element={<AgentBuilder />} />
          <Route path="mcp/registry" element={<MCPRegistry />} />
          <Route path="mcp/inspector" element={<MCPInspector />} />
          <Route path="mcp/client" element={<MCPClient />} />
          <Route path="mcp/bridge" element={<MCPBridge />} />
          <Route path="mcp/bridge-registry" element={<MCPBridgeRegistry />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
