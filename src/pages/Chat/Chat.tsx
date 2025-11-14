import React, { useState, useRef } from 'react';
import { Card, Form, Button, ListGroup, Dropdown } from 'react-bootstrap';
import './Chat.scss';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const Chat: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'General Chat',
      lastMessage: 'Hello! How can I help you today?',
      timestamp: new Date(),
      messageCount: 1,
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Chat ${chatSessions.length + 1}`,
      lastMessage: 'New chat started',
      timestamp: new Date(),
      messageCount: 0,
    };
    setChatSessions([newSession, ...chatSessions]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setAttachments([]);
  };

  const switchChat = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    // In a real app, load messages for this session from backend
    if (sessionId === '1') {
      setMessages([
        {
          id: 1,
          text: 'Hello! How can I help you today?',
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([]);
    }
    setAttachments([]);
  };

  const deleteChat = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (chatSessions.length === 1) return; // Keep at least one chat
    
    setChatSessions(chatSessions.filter((session) => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remaining = chatSessions.filter((s) => s.id !== sessionId);
      if (remaining.length > 0) {
        switchChat(remaining[0].id);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter((att) => att.id !== attachmentId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    setAttachments([]);

    // Update session
    setChatSessions(
      chatSessions.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              lastMessage: inputText || 'Sent attachments',
              timestamp: new Date(),
              messageCount: session.messageCount + 1,
            }
          : session
      )
    );

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: messages.length + 2,
        text: 'This is a simulated response. Integrate with your AI backend for real responses.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                lastMessage: assistantMessage.text.substring(0, 50) + '...',
                timestamp: new Date(),
                messageCount: session.messageCount + 1,
              }
            : session
        )
      );
    }, 1000);
  };

  const currentSession = chatSessions.find((s) => s.id === currentSessionId);

  return (
    <div className="chat-page-container">
      {/* Chat History Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h5 className="mb-0">Chats</h5>
          <Button
            variant="primary"
            size="sm"
            onClick={createNewChat}
            title="New Chat"
          >
            <i className="bi bi-plus-lg"></i>
          </Button>
        </div>
        <div className="chat-list">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`chat-list-item ${session.id === currentSessionId ? 'active' : ''}`}
              onClick={() => switchChat(session.id)}
            >
              <div className="chat-item-content">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="chat-item-title">{session.title}</div>
                  {chatSessions.length > 1 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-danger delete-btn"
                      onClick={(e) => deleteChat(session.id, e)}
                      title="Delete chat"
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  )}
                </div>
                <div className="chat-item-preview">{session.lastMessage}</div>
                <div className="chat-item-meta">
                  <small className="text-muted">
                    {session.timestamp.toLocaleDateString()} • {session.messageCount} messages
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{currentSession?.title || 'Chat'}</h2>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <i className="bi bi-three-dots-vertical"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={createNewChat}>
                <i className="bi bi-plus-circle me-2"></i>
                New Chat
              </Dropdown.Item>
              <Dropdown.Item>
                <i className="bi bi-download me-2"></i>
                Export Chat
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger">
                <i className="bi bi-trash me-2"></i>
                Clear Chat
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Card className="chat-card">
          <Card.Body className="d-flex flex-column p-0">
            <div className="messages-container">
              <ListGroup variant="flush">
                {messages.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-chat-dots display-1 text-muted mb-3"></i>
                    <h4>Start a Conversation</h4>
                    <p className="text-muted">
                      Type a message or upload a document to get started
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <ListGroup.Item
                      key={message.id}
                      className={`message-item ${message.sender}`}
                    >
                      <div className="message-bubble">
                        {message.text && <div className="message-text">{message.text}</div>}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="message-attachments">
                            {message.attachments.map((att) => (
                              <div key={att.id} className="attachment-item">
                                <i className="bi bi-file-earmark me-2"></i>
                                <span className="attachment-name">{att.name}</span>
                                <span className="attachment-size text-muted ms-2">
                                  ({formatFileSize(att.size)})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="message-time">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </div>

            <div className="chat-input-container">
              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="attachments-preview">
                  {attachments.map((att) => (
                    <div key={att.id} className="attachment-chip">
                      <i className="bi bi-file-earmark me-2"></i>
                      <span className="attachment-name">{att.name}</span>
                      <span className="attachment-size text-muted ms-1">
                        ({formatFileSize(att.size)})
                      </span>
                      <button
                        className="btn-close btn-close-sm ms-2"
                        onClick={() => removeAttachment(att.id)}
                        aria-label="Remove"
                      ></button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <Form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outline-secondary"
                  className="attach-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach files"
                >
                  <i className="bi bi-paperclip"></i>
                </Button>
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="message-input"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!inputText.trim() && attachments.length === 0}
                >
                  <i className="bi bi-send-fill"></i>
                </Button>
              </Form>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
