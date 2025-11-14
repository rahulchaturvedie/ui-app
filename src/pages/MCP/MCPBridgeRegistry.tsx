import React, { useState } from 'react';
import { Card, Table, Button, Form, InputGroup, Badge, Modal } from 'react-bootstrap';
import './MCPBridgeRegistry.scss';

interface Bridge {
  id: number;
  name: string;
  sourceServer: string;
  targetServer: string;
  status: 'active' | 'inactive' | 'error';
  messagesCount: number;
  createdAt: Date;
}

const MCPBridgeRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [bridges] = useState<Bridge[]>([
    {
      id: 1,
      name: 'FS to DB Bridge',
      sourceServer: 'Filesystem Server',
      targetServer: 'Database Server',
      status: 'active',
      messagesCount: 1523,
      createdAt: new Date('2025-11-10'),
    },
    {
      id: 2,
      name: 'API to FS Bridge',
      sourceServer: 'API Gateway',
      targetServer: 'Filesystem Server',
      status: 'inactive',
      messagesCount: 0,
      createdAt: new Date('2025-11-12'),
    },
    {
      id: 3,
      name: 'DB to API Bridge',
      sourceServer: 'Database Server',
      targetServer: 'API Gateway',
      status: 'error',
      messagesCount: 342,
      createdAt: new Date('2025-11-13'),
    },
  ]);

  const filteredBridges = bridges.filter((bridge) =>
    bridge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bridge.sourceServer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bridge.targetServer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'error':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="mcp-bridge-registry-page p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>MCP Bridge Registry</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Create Bridge
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
              placeholder="Search bridges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Source Server</th>
                <th>Target Server</th>
                <th>Status</th>
                <th>Messages</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBridges.map((bridge) => (
                <tr key={bridge.id}>
                  <td className="fw-semibold">{bridge.name}</td>
                  <td>{bridge.sourceServer}</td>
                  <td>{bridge.targetServer}</td>
                  <td>
                    <Badge bg={getStatusVariant(bridge.status)}>
                      {bridge.status}
                    </Badge>
                  </td>
                  <td>{bridge.messagesCount.toLocaleString()}</td>
                  <td>{bridge.createdAt.toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm">
                        View
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Bridge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Bridge Name</Form.Label>
              <Form.Control type="text" placeholder="Enter bridge name" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Source Server</Form.Label>
              <Form.Select>
                <option value="">Select source server...</option>
                <option value="filesystem">Filesystem Server</option>
                <option value="database">Database Server</option>
                <option value="api">API Gateway</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Target Server</Form.Label>
              <Form.Select>
                <option value="">Select target server...</option>
                <option value="filesystem">Filesystem Server</option>
                <option value="database">Database Server</option>
                <option value="api">API Gateway</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Create Bridge
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MCPBridgeRegistry;
