import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Agents.scss';

interface Agent {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  type: string;
}

const Agents: React.FC = () => {
  const navigate = useNavigate();

  const agents: Agent[] = [
    {
      id: 1,
      name: 'Customer Support Agent',
      description: 'Handles customer inquiries and support tickets',
      status: 'active',
      type: 'Support',
    },
    {
      id: 2,
      name: 'Data Analysis Agent',
      description: 'Analyzes data and generates insights',
      status: 'active',
      type: 'Analytics',
    },
    {
      id: 3,
      name: 'Content Generator',
      description: 'Creates content based on prompts',
      status: 'inactive',
      type: 'Content',
    },
    {
      id: 4,
      name: 'Code Review Agent',
      description: 'Reviews code and suggests improvements',
      status: 'active',
      type: 'Development',
    },
  ];

  return (
    <div className="agents-page p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Agents</h2>
        <Button variant="primary" onClick={() => navigate('/agents/builder')}>
          <i className="bi bi-plus-circle me-2"></i>
          Add Agent
        </Button>
      </div>
      <Row>
        {agents.map((agent) => (
          <Col md={6} lg={4} key={agent.id} className="mb-4">
            <Card className="agent-card h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <Card.Title>{agent.name}</Card.Title>
                    <Badge bg={agent.status === 'active' ? 'success' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                  <Badge bg="info">{agent.type}</Badge>
                </div>
                <Card.Text>{agent.description}</Card.Text>
                <div className="d-flex gap-2 mt-3">
                  <Button variant="outline-primary" size="sm">
                    Configure
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    View Logs
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

export default Agents;
