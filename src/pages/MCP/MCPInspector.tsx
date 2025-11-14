import React, { useState } from 'react';
import { Card, Button, Form, Alert, Badge, ListGroup, Spinner, Row, Col, Accordion } from 'react-bootstrap';
import './MCPInspector.scss';
import { useMcp } from 'use-mcp/react';

const MCPInspector: React.FC = () => {
  const [serverUrl, setServerUrl] = useState('https://your-mcp-server.com');
  const [clientName, setClientName] = useState('MCP Inspector');
  const [toolOutput, setToolOutput] = useState<any>(null);
  const [resourceOutput, setResourceOutput] = useState<any>(null);
  const [promptOutput, setPromptOutput] = useState<any>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Only use the hook when configured
  const mcpHookResult = isConfigured ? useMcp({
    url: serverUrl,
    clientName: clientName,
    autoReconnect: true,
  }) : null;

  const state = mcpHookResult?.state || 'idle';
  const tools = mcpHookResult?.tools || [];
  const resources = mcpHookResult?.resources || [];
  const prompts = mcpHookResult?.prompts || [];
  const error = mcpHookResult?.error;
  const callTool = mcpHookResult?.callTool || (async () => {});
  const readResource = mcpHookResult?.readResource || (async () => {});
  const getPrompt = mcpHookResult?.getPrompt || (async () => {});
  const retry = mcpHookResult?.retry || (() => {});
  const authenticate = mcpHookResult?.authenticate || (() => {});
  const clearStorage = mcpHookResult?.clearStorage || (() => {});

  const handleConnect = () => {
    if (serverUrl.trim() && clientName.trim()) {
      setIsConfigured(true);
    }
  };

  const handleDisconnect = () => {
    setIsConfigured(false);
    clearStorage();
    setToolOutput(null);
    setResourceOutput(null);
    setPromptOutput(null);
  };

  const handleCallTool = async (toolName: string) => {
    try {
      setToolOutput({ loading: true, toolName });
      const result = await callTool(toolName, { query: 'test query' });
      setToolOutput({ loading: false, toolName, result });
    } catch (err: any) {
      setToolOutput({ loading: false, toolName, error: err.message });
    }
  };

  const handleReadResource = async (resourceUri: string) => {
    try {
      setResourceOutput({ loading: true, resourceUri });
      const content = await readResource(resourceUri);
      setResourceOutput({ loading: false, resourceUri, content });
    } catch (err: any) {
      setResourceOutput({ loading: false, resourceUri, error: err.message });
    }
  };

  const handleGetPrompt = async (promptName: string) => {
    try {
      setPromptOutput({ loading: true, promptName });
      const result = await getPrompt(promptName);
      setPromptOutput({ loading: false, promptName, result });
    } catch (err: any) {
      setPromptOutput({ loading: false, promptName, error: err.message });
    }
  };

  const getStateBadge = () => {
    const stateColors: Record<string, string> = {
      'discovering': 'info',
      'pending_auth': 'warning',
      'authenticating': 'warning',
      'connecting': 'info',
      'loading': 'info',
      'ready': 'success',
      'failed': 'danger',
    };
    return <Badge bg={stateColors[state] || 'secondary'}>{state}</Badge>;
  };

  return (
    <div className="mcp-inspector-page p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>MCP Inspector</h2>
        {isConfigured && getStateBadge()}
      </div>

      {/* Configuration Card */}
      {!isConfigured && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Configure MCP Server Connection</Card.Title>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Server URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://your-mcp-server.com"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Enter the URL of your MCP server
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Client Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="My MCP Client"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <Form.Text className="text-muted">
                  A friendly name for your client application
                </Form.Text>
              </Form.Group>

              <Button 
                variant="primary" 
                onClick={handleConnect}
                disabled={!serverUrl.trim() || !clientName.trim()}
              >
                <i className="bi bi-plug me-2"></i>
                Connect to Server
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Connection Status */}
      {isConfigured && (
        <>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>Connection Status</Card.Title>
                  <p className="mb-0">
                    <strong>Server:</strong> {serverUrl}<br />
                    <strong>Client:</strong> {clientName}<br />
                    <strong>State:</strong> {getStateBadge()}
                  </p>
                </div>
                <div className="d-flex gap-2">
                  {state === 'failed' && (
                    <>
                      <Button variant="warning" size="sm" onClick={retry}>
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Retry
                      </Button>
                      <Button variant="info" size="sm" onClick={authenticate}>
                        <i className="bi bi-shield-lock me-1"></i>
                        Authenticate
                      </Button>
                    </>
                  )}
                  <Button variant="danger" size="sm" onClick={handleDisconnect}>
                    <i className="bi bi-x-circle me-1"></i>
                    Disconnect
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Error Alert */}
          {state === 'failed' && error && (
            <Alert variant="danger" className="mb-4">
              <Alert.Heading>Connection Failed</Alert.Heading>
              <p className="mb-0">{error}</p>
            </Alert>
          )}

          {/* Loading State */}
          {state !== 'ready' && state !== 'failed' && (
            <Card className="mb-4">
              <Card.Body className="text-center">
                <Spinner animation="border" variant="primary" className="me-2" />
                <span>Connecting to MCP server...</span>
              </Card.Body>
            </Card>
          )}

          {/* Ready State - Show Capabilities */}
          {state === 'ready' && (
            <>
              {/* Summary Cards */}
              <Row className="mb-4">
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Body>
                      <h3 className="mb-0">{tools?.length || 0}</h3>
                      <small className="text-muted">Available Tools</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Body>
                      <h3 className="mb-0">{resources?.length || 0}</h3>
                      <small className="text-muted">Available Resources</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Body>
                      <h3 className="mb-0">{prompts?.length || 0}</h3>
                      <small className="text-muted">Available Prompts</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Tools */}
              {tools && tools.length > 0 && (
                <Card className="mb-4">
                  <Card.Header>
                    <strong><i className="bi bi-tools me-2"></i>Available Tools</strong>
                  </Card.Header>
                  <Accordion>
                    {tools.map((tool: any, index: number) => (
                      <Accordion.Item eventKey={`tool-${index}`} key={index}>
                        <Accordion.Header>
                          <div className="d-flex justify-content-between align-items-center w-100 me-2">
                            <div>
                              <strong>{tool.name}</strong>
                              <small className="text-muted ms-2">{tool.description}</small>
                            </div>
                            <Badge bg="primary">Tool</Badge>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="mb-3">
                            <strong>Description:</strong> {tool.description || 'No description available'}
                          </div>
                          {tool.inputSchema && (
                            <div className="mb-3">
                              <strong>Input Schema:</strong>
                              <pre className="bg-light p-2 rounded mt-2">
                                {JSON.stringify(tool.inputSchema, null, 2)}
                              </pre>
                            </div>
                          )}
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleCallTool(tool.name)}
                            disabled={toolOutput?.loading && toolOutput?.toolName === tool.name}
                          >
                            {toolOutput?.loading && toolOutput?.toolName === tool.name ? (
                              <><Spinner animation="border" size="sm" className="me-1" /> Calling...</>
                            ) : (
                              <><i className="bi bi-play-circle me-1"></i>Call Tool</>
                            )}
                          </Button>
                          {toolOutput?.toolName === tool.name && !toolOutput?.loading && (
                            <Alert variant={toolOutput?.error ? 'danger' : 'success'} className="mt-3 mb-0">
                              <strong>Output:</strong>
                              <pre className="mb-0 mt-2">
                                {JSON.stringify(toolOutput?.error || toolOutput?.result, null, 2)}
                              </pre>
                            </Alert>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card>
              )}

              {/* Resources */}
              {resources && resources.length > 0 && (
                <Card className="mb-4">
                  <Card.Header>
                    <strong><i className="bi bi-file-earmark-text me-2"></i>Available Resources</strong>
                  </Card.Header>
                  <ListGroup variant="flush">
                    {resources.map((resource: any, index: number) => (
                      <ListGroup.Item key={index}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <strong>{resource.name || resource.uri}</strong>
                            <p className="mb-2 text-muted small">
                              {resource.description || resource.mimeType}
                            </p>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleReadResource(resource.uri)}
                              disabled={resourceOutput?.loading && resourceOutput?.resourceUri === resource.uri}
                            >
                              {resourceOutput?.loading && resourceOutput?.resourceUri === resource.uri ? (
                                <><Spinner animation="border" size="sm" className="me-1" /> Reading...</>
                              ) : (
                                <><i className="bi bi-eye me-1"></i>Read Resource</>
                              )}
                            </Button>
                            {resourceOutput?.resourceUri === resource.uri && !resourceOutput?.loading && (
                              <Alert variant={resourceOutput?.error ? 'danger' : 'info'} className="mt-3 mb-0">
                                <strong>Content:</strong>
                                <pre className="mb-0 mt-2" style={{ maxHeight: '200px', overflow: 'auto' }}>
                                  {JSON.stringify(resourceOutput?.error || resourceOutput?.content, null, 2)}
                                </pre>
                              </Alert>
                            )}
                          </div>
                          <Badge bg="success">Resource</Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              )}

              {/* Prompts */}
              {prompts && prompts.length > 0 && (
                <Card className="mb-4">
                  <Card.Header>
                    <strong><i className="bi bi-chat-dots me-2"></i>Available Prompts</strong>
                  </Card.Header>
                  <ListGroup variant="flush">
                    {prompts.map((prompt: any, index: number) => (
                      <ListGroup.Item key={index}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <strong>{prompt.name}</strong>
                            <p className="mb-2 text-muted small">{prompt.description}</p>
                            <Button 
                              variant="outline-warning" 
                              size="sm"
                              onClick={() => handleGetPrompt(prompt.name)}
                              disabled={promptOutput?.loading && promptOutput?.promptName === prompt.name}
                            >
                              {promptOutput?.loading && promptOutput?.promptName === prompt.name ? (
                                <><Spinner animation="border" size="sm" className="me-1" /> Loading...</>
                              ) : (
                                <><i className="bi bi-lightning me-1"></i>Get Prompt</>
                              )}
                            </Button>
                            {promptOutput?.promptName === prompt.name && !promptOutput?.loading && (
                              <Alert variant={promptOutput?.error ? 'danger' : 'info'} className="mt-3 mb-0">
                                <strong>Messages:</strong>
                                <pre className="mb-0 mt-2" style={{ maxHeight: '200px', overflow: 'auto' }}>
                                  {JSON.stringify(promptOutput?.error || promptOutput?.result?.messages, null, 2)}
                                </pre>
                              </Alert>
                            )}
                          </div>
                          <Badge bg="warning">Prompt</Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              )}

              {/* Empty State */}
              {(!tools || tools.length === 0) && 
               (!resources || resources.length === 0) && 
               (!prompts || prompts.length === 0) && (
                <Alert variant="info">
                  <i className="bi bi-info-circle me-2"></i>
                  This MCP server has no tools, resources, or prompts available.
                </Alert>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MCPInspector;
