import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Connection,
  type Edge,
  type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, Button, Form, Offcanvas, Badge, ListGroup } from 'react-bootstrap';
import './AgentBuilder.scss';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 50 },
  },
];

const initialEdges: Edge[] = [];

const availableTools: Tool[] = [
  { id: 'llm', name: 'LLM', description: 'Large Language Model', category: 'AI', icon: 'bi-cpu' },
  { id: 'search', name: 'Web Search', description: 'Search the web', category: 'Data', icon: 'bi-search' },
  { id: 'database', name: 'Database Query', description: 'Query database', category: 'Data', icon: 'bi-database' },
  { id: 'api', name: 'API Call', description: 'Make HTTP requests', category: 'Integration', icon: 'bi-cloud-arrow-up' },
  { id: 'email', name: 'Send Email', description: 'Send email notifications', category: 'Communication', icon: 'bi-envelope' },
  { id: 'slack', name: 'Slack Message', description: 'Send Slack messages', category: 'Communication', icon: 'bi-slack' },
  { id: 'transform', name: 'Transform Data', description: 'Transform data format', category: 'Data', icon: 'bi-arrow-left-right' },
  { id: 'condition', name: 'Condition', description: 'Conditional logic', category: 'Logic', icon: 'bi-diagram-3' },
  { id: 'loop', name: 'Loop', description: 'Repeat actions', category: 'Logic', icon: 'bi-arrow-repeat' },
  { id: 'webhook', name: 'Webhook', description: 'Receive webhook data', category: 'Integration', icon: 'bi-link-45deg' },
  { id: 'storage', name: 'Storage', description: 'Store/retrieve data', category: 'Data', icon: 'bi-hdd' },
  { id: 'schedule', name: 'Schedule', description: 'Time-based trigger', category: 'Trigger', icon: 'bi-clock' },
];

const AgentBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showToolbox, setShowToolbox] = useState(true);
  const [showProperties, setShowProperties] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [agentName, setAgentName] = useState('Untitled Agent');
  const [searchTool, setSearchTool] = useState('');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setShowProperties(true);
  }, []);

  const addNodeToFlow = (tool: Tool) => {
    const newNode: Node = {
      id: `${tool.id}-${Date.now()}`,
      type: 'default',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: {
        label: (
          <div className="custom-node">
            <i className={`bi ${tool.icon} me-2`}></i>
            {tool.name}
          </div>
        ),
        toolType: tool.id,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
      setSelectedNode(null);
      setShowProperties(false);
    }
  };

  const saveAgent = () => {
    const agentData = {
      name: agentName,
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    console.log('Saving agent:', agentData);
    // TODO: Save to backend
    alert(`Agent "${agentName}" saved successfully!`);
  };

  const filteredTools = availableTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTool.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTool.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTool.toLowerCase())
  );

  const groupedTools = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <div className="agent-builder-page">
      {/* Top Toolbar */}
      <div className="builder-toolbar">
        <div className="d-flex align-items-center gap-3">
          <Button variant="link" onClick={() => navigate('/agents')} className="text-decoration-none">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Agents
          </Button>
          <div className="vr"></div>
          <Form.Control
            type="text"
            placeholder="Agent Name"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => setShowToolbox(!showToolbox)}>
            <i className="bi bi-tools me-2"></i>
            {showToolbox ? 'Hide' : 'Show'} Toolbox
          </Button>
          <Button variant="outline-primary">
            <i className="bi bi-play-circle me-2"></i>
            Test
          </Button>
          <Button variant="primary" onClick={saveAgent}>
            <i className="bi bi-save me-2"></i>
            Save Agent
          </Button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="builder-container">
        {/* Toolbox Sidebar */}
        <div className={`toolbox-sidebar ${showToolbox ? 'show' : 'hide'}`}>
          <Card>
            <Card.Header>
              <strong>Available Tools</strong>
            </Card.Header>
            <Card.Body className="p-2">
              <Form.Control
                type="text"
                placeholder="Search tools..."
                value={searchTool}
                onChange={(e) => setSearchTool(e.target.value)}
                className="mb-3"
                size="sm"
              />
              <div className="tools-list">
                {Object.entries(groupedTools).map(([category, tools]) => (
                  <div key={category} className="mb-3">
                    <h6 className="text-muted small mb-2">{category}</h6>
                    {tools.map((tool) => (
                      <div
                        key={tool.id}
                        className="tool-item"
                        draggable
                        onClick={() => addNodeToFlow(tool)}
                      >
                        <i className={`bi ${tool.icon} me-2`}></i>
                        <div className="flex-grow-1">
                          <div className="tool-name">{tool.name}</div>
                          <small className="text-muted">{tool.description}</small>
                        </div>
                        <i className="bi bi-plus-circle text-primary"></i>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* React Flow Canvas */}
        <div className="flow-canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Properties Panel */}
        <Offcanvas
          show={showProperties}
          onHide={() => setShowProperties(false)}
          placement="end"
          className="properties-panel"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Node Properties</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {selectedNode ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Node ID</Form.Label>
                  <Form.Control type="text" value={selectedNode.id} disabled />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Node Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedNode.data?.toolType || selectedNode.type}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Label</Form.Label>
                  <Form.Control
                    type="text"
                    value={typeof selectedNode.data?.label === 'string' ? selectedNode.data.label : ''}
                    onChange={(e) => {
                      setNodes((nds) =>
                        nds.map((node) =>
                          node.id === selectedNode.id
                            ? { ...node, data: { ...node.data, label: e.target.value } }
                            : node
                        )
                      );
                      setSelectedNode({
                        ...selectedNode,
                        data: { ...selectedNode.data, label: e.target.value },
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add a description..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Configuration</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Add configuration (JSON)..."
                    defaultValue="{}"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="danger" onClick={deleteSelectedNode}>
                    <i className="bi bi-trash me-2"></i>
                    Delete Node
                  </Button>
                </div>

                <hr className="my-4" />

                <h6>Connections</h6>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Inputs:</strong>{' '}
                    <Badge bg="secondary">
                      {edges.filter((e) => e.target === selectedNode.id).length}
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Outputs:</strong>{' '}
                    <Badge bg="secondary">
                      {edges.filter((e) => e.source === selectedNode.id).length}
                    </Badge>
                  </ListGroup.Item>
                </ListGroup>
              </>
            ) : (
              <p className="text-muted">Select a node to view its properties</p>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <Badge bg="secondary">Nodes: {nodes.length}</Badge>
        <Badge bg="secondary">Connections: {edges.length}</Badge>
        <Badge bg={nodes.length > 0 ? 'success' : 'warning'}>
          {nodes.length > 0 ? 'Ready to Save' : 'Add nodes to get started'}
        </Badge>
      </div>
    </div>
  );
};

export default AgentBuilder;
