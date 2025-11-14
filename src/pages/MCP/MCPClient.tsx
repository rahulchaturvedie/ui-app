import React, { useState } from 'react';
import { Card, Form, Button, ListGroup, Row, Col, Badge } from 'react-bootstrap';
import './MCPClient.scss';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'mcp';
  timestamp: Date;
  metadata?: {
    server?: string;
    tool?: string;
  };
}

const MCPClient: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'MCP Client connected. You can interact with MCP servers here.',
      sender: 'mcp',
      timestamp: new Date(),
      metadata: { server: 'Filesystem Server' },
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedServer, setSelectedServer] = useState('filesystem');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate MCP response
    setTimeout(() => {
      const mcpMessage: Message = {
        id: messages.length + 2,
        text: 'Processing request through MCP server...',
        sender: 'mcp',
        timestamp: new Date(),
        metadata: {
          server: selectedServer === 'filesystem' ? 'Filesystem Server' : 'Database Server',
          tool: 'query',
        },
      };
      setMessages((prev) => [...prev, mcpMessage]);
    }, 1000);
  };

  return (
    <div className="mcp-client-page p-4">
      <h2 className="mb-4">MCP Client</h2>
      
      <Row>
        <Col lg={3} className="mb-4">
          <Card>
            <Card.Header>
              <strong>Connected Servers</strong>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item
                action
                active={selectedServer === 'filesystem'}
                onClick={() => setSelectedServer('filesystem')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span>Filesystem Server</span>
                  <Badge bg="success">Online</Badge>
                </div>
              </ListGroup.Item>
              <ListGroup.Item
                action
                active={selectedServer === 'database'}
                onClick={() => setSelectedServer('database')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span>Database Server</span>
                  <Badge bg="success">Online</Badge>
                </div>
              </ListGroup.Item>
              <ListGroup.Item
                action
                active={selectedServer === 'api'}
                onClick={() => setSelectedServer('api')}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span>API Gateway</span>
                  <Badge bg="danger">Offline</Badge>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col lg={9}>
          <Card className="chat-card">
            <Card.Body className="d-flex flex-column p-0">
              <div className="messages-container">
                <ListGroup variant="flush">
                  {messages.map((message) => (
                    <ListGroup.Item
                      key={message.id}
                      className={`message-item ${message.sender}`}
                    >
                      <div className="message-bubble">
                        <div className="message-text">{message.text}</div>
                        {message.metadata && (
                          <div className="message-metadata">
                            {message.metadata.server && (
                              <Badge bg="secondary" className="me-2">
                                {message.metadata.server}
                              </Badge>
                            )}
                            {message.metadata.tool && (
                              <Badge bg="info">{message.metadata.tool}</Badge>
                            )}
                          </div>
                        )}
                        <div className="message-time">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
              <div className="chat-input-container">
                <Form onSubmit={handleSendMessage} className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Send a message to MCP server..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    Send
                  </Button>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MCPClient;
