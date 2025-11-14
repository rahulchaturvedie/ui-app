import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import './Layout.scss';

const Layout: React.FC = () => {
  const [show, setShow] = useState(false);
  const [mcpExpanded, setMcpExpanded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isMcpActive = location.pathname.startsWith('/mcp');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Auto-expand MCP section if on an MCP route, collapse if not
  useEffect(() => {
    if (isMcpActive) {
      setMcpExpanded(true);
    } else {
      setMcpExpanded(false);
    }
  }, [isMcpActive]);

  const handleMcpClick = () => {
    if (!mcpExpanded) {
      // If MCP is not expanded, expand it and navigate to MCP Registry
      setMcpExpanded(true);
      if (!isMcpActive) {
        navigate('/mcp/registry');
      }
    } else {
      // If MCP is already expanded, just toggle it
      setMcpExpanded(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const NavigationItems = () => (
    <Nav className="flex-column">
      <Nav.Link as={Link} to="/chat" className={isActive('/chat') ? 'active' : ''} onClick={handleClose}>
        <i className="bi bi-chat-dots me-2"></i>
        Chat
      </Nav.Link>
      <Nav.Link as={Link} to="/agents" className={isActive('/agents') ? 'active' : ''} onClick={handleClose}>
        <i className="bi bi-robot me-2"></i>
        Agents
      </Nav.Link>
      <div className="nav-section">
        <div className="nav-section-title">
          <i className="bi bi-diagram-3 me-2"></i>
          MCP
        </div>
        <Nav className="flex-column ms-3">
          <Nav.Link as={Link} to="/mcp/registry" className={isActive('/mcp/registry') ? 'active' : ''} onClick={handleClose}>
            MCP Registry
          </Nav.Link>
          <Nav.Link as={Link} to="/mcp/inspector" className={isActive('/mcp/inspector') ? 'active' : ''} onClick={handleClose}>
            MCP Inspector
          </Nav.Link>
          <Nav.Link as={Link} to="/mcp/client" className={isActive('/mcp/client') ? 'active' : ''} onClick={handleClose}>
            MCP Client
          </Nav.Link>
          <Nav.Link as={Link} to="/mcp/bridge" className={isActive('/mcp/bridge') ? 'active' : ''} onClick={handleClose}>
            MCP Bridge
          </Nav.Link>
          <Nav.Link as={Link} to="/mcp/bridge-registry" className={isActive('/mcp/bridge-registry') ? 'active' : ''} onClick={handleClose}>
            MCP Bridge Registry
          </Nav.Link>
        </Nav>
      </div>
    </Nav>
  );

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <Navbar bg="light" variant="light" className="d-lg-none border-bottom">
        <Container fluid>
          <Navbar.Brand className="fw-semibold text-dark">MCP App</Navbar.Brand>
          <button className="btn btn-light" onClick={handleShow}>
            <i className="bi bi-list"></i>
          </button>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Sidebar */}
      <Offcanvas show={show} onHide={handleClose} className="d-lg-none bg-light">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-semibold">Navigation</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <NavigationItems />
        </Offcanvas.Body>
      </Offcanvas>

      <Container fluid className="h-100">
        <Row className="h-100">
          {/* Primary Sidebar - First Level */}
          <div className="primary-sidebar d-none d-lg-flex flex-column">
            <div className="sidebar-header">
              <div className="p-3 text-center fw-bold">GS</div>
            </div>
            <Nav className="flex-column flex-grow-1">
              <Nav.Link 
                as={Link} 
                to="/chat" 
                className={`primary-nav-item ${isActive('/chat') ? 'active' : ''}`}
                title="Chat"
              >
                <i className="bi bi-chat-dots"></i>
                <span className="nav-label">Chat</span>
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/agents" 
                className={`primary-nav-item ${isActive('/agents') ? 'active' : ''}`}
                title="Agents"
              >
                <i className="bi bi-robot"></i>
                <span className="nav-label">Agents</span>
              </Nav.Link>
              <button
                className={`primary-nav-item ${isMcpActive ? 'active' : ''}`}
                onClick={handleMcpClick}
                title="MCP"
              >
                <i className="bi bi-diagram-3"></i>
                <span className="nav-label">MCP</span>
                <i className={`bi bi-chevron-${mcpExpanded ? 'left' : 'right'} chevron-icon`}></i>
              </button>
            </Nav>
            
            {/* Theme Toggle at Bottom */}
            <div className="theme-toggle-container">
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                <i className={`bi bi-${theme === 'light' ? 'moon-stars' : 'sun'}`}></i>
                <span className="nav-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>

          {/* Secondary Sidebar - Second Level (MCP submenu) */}
          <div className={`secondary-sidebar d-none d-lg-block ${mcpExpanded ? 'expanded' : ''}`}>
            <div className="sidebar-header">
              <h6 className="p-3 mb-0">MCP Options</h6>
            </div>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/mcp/registry" className={isActive('/mcp/registry') ? 'active' : ''}>
                <i className="bi bi-journal-text me-2"></i>
                MCP Registry
              </Nav.Link>
              <Nav.Link as={Link} to="/mcp/inspector" className={isActive('/mcp/inspector') ? 'active' : ''}>
                <i className="bi bi-search me-2"></i>
                MCP Inspector
              </Nav.Link>
              <Nav.Link as={Link} to="/mcp/client" className={isActive('/mcp/client') ? 'active' : ''}>
                <i className="bi bi-chat-square-dots me-2"></i>
                MCP Client
              </Nav.Link>
              <Nav.Link as={Link} to="/mcp/bridge" className={isActive('/mcp/bridge') ? 'active' : ''}>
                <i className="bi bi-arrow-left-right me-2"></i>
                MCP Bridge
              </Nav.Link>
              <Nav.Link as={Link} to="/mcp/bridge-registry" className={isActive('/mcp/bridge-registry') ? 'active' : ''}>
                <i className="bi bi-database me-2"></i>
                Bridge Registry
              </Nav.Link>
            </Nav>
          </div>

          {/* Main Content */}
          <div className={`main-content-wrapper ${mcpExpanded ? 'mcp-expanded' : ''}`}>
            <Outlet />
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;
