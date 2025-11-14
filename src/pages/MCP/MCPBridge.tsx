import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import './MCPBridge.scss';

const MCPBridge: React.FC = () => {
  const [sourceServer, setSourceServer] = useState('');
  const [targetServer, setTargetServer] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSourceServer('');
    setTargetServer('');
  };

  return (
    <div className="mcp-bridge-page p-4">
      <h2 className="mb-4">MCP Bridge</h2>
      
      <Alert variant="info">
        <i className="bi bi-info-circle me-2"></i>
        MCP Bridge allows you to connect multiple endpoints and make them MCP tools.
      </Alert>

      <Card>
        <Card.Body>
          <Form onSubmit={handleConnect}>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Source Server</Form.Label>
                  <Form.Select
                    value={sourceServer}
                    onChange={(e) => setSourceServer(e.target.value)}
                    required
                    disabled={isConnected}
                  >
                    <option value="">Select source server...</option>
                    <option value="filesystem">Filesystem Server</option>
                    <option value="database">Database Server</option>
                    <option value="api">API Gateway</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2} className="d-flex align-items-center justify-content-center">
                <i className="bi bi-arrow-left-right fs-3 text-primary"></i>
              </Col>

              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Target Server</Form.Label>
                  <Form.Select
                    value={targetServer}
                    onChange={(e) => setTargetServer(e.target.value)}
                    required
                    disabled={isConnected}
                  >
                    <option value="">Select target server...</option>
                    <option value="filesystem">Filesystem Server</option>
                    <option value="database">Database Server</option>
                    <option value="api">API Gateway</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              {!isConnected ? (
                <Button type="submit" variant="primary" disabled={!sourceServer || !targetServer}>
                  <i className="bi bi-link-45deg me-2"></i>
                  Connect Bridge
                </Button>
              ) : (
                <Button type="button" variant="danger" onClick={handleDisconnect}>
                  <i className="bi bi-x-circle me-2"></i>
                  Disconnect
                </Button>
              )}
            </div>
          </Form>

          {isConnected && (
            <Alert variant="success" className="mt-4 mb-0">
              <i className="bi bi-check-circle me-2"></i>
              Bridge successfully established between {sourceServer} and {targetServer}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {isConnected && (
        <Card className="mt-4">
          <Card.Header>
            <strong>Bridge Statistics</strong>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <div className="stat-card">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Messages Bridged</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card">
                  <div className="stat-value">0ms</div>
                  <div className="stat-label">Avg Latency</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Errors</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card">
                  <div className="stat-value">Active</div>
                  <div className="stat-label">Status</div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MCPBridge;
