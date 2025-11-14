import React, { useState } from 'react';
import { Card, Button, Form, InputGroup, Badge, Row, Col } from 'react-bootstrap';
import './MCPRegistry.scss';

interface MCPServer {
  id: number;
  name: string;
  url: string;
  status: 'online' | 'offline';
  version: string;
  description: string;
}

const MCPRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [servers] = useState<MCPServer[]>([
    {
      id: 1,
      name: 'Filesystem Server',
      url: 'mcp://localhost:3000',
      status: 'online',
      version: '1.0.0',
      description: 'Provides filesystem access capabilities',
    },
    {
      id: 2,
      name: 'Database Server',
      url: 'mcp://localhost:3001',
      status: 'online',
      version: '1.2.0',
      description: 'Database query and management',
    },
    {
      id: 3,
      name: 'API Gateway',
      url: 'mcp://localhost:3002',
      status: 'offline',
      version: '2.0.0',
      description: 'REST API integration',
    },
  ]);

  const filteredServers = servers.filter((server) =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mcp-registry-page p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>MCP Registry</h2>
        <Button variant="primary">
          <i className="bi bi-plus-circle me-2"></i>
          Register Server
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search MCP servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Body>
      </Card>

      <Row>
        {filteredServers.map((server) => (
          <Col md={6} lg={4} key={server.id} className="mb-4">
            <Card className="server-card h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <Card.Title className="mb-2">{server.name}</Card.Title>
                    <Badge bg={server.status === 'online' ? 'success' : 'danger'}>
                      {server.status}
                    </Badge>
                  </div>
                  <Badge bg="secondary">{server.version}</Badge>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted">URL</small>
                  <div>
                    <code className="d-block text-break">{server.url}</code>
                  </div>
                </div>

                <Card.Text className="text-muted mb-3">
                  {server.description}
                </Card.Text>

                <div className="d-flex gap-2 mt-auto">
                  <Button variant="primary" size="sm" className="flex-grow-1">
                    <i className="bi bi-link-45deg me-1"></i>
                    Connect
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    <i className="bi bi-pencil"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MCPRegistry;
