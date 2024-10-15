import React, { useState, useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  { id: 1, text: "Welcome to the Versus demo interface!", sender: "System", timestamp: "10:00" },
  { id: 2, text: "Type your commands in the terminal below.", sender: "System", timestamp: "10:01" },
];

function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['Welcome to Versus Terminal. Type "help" for available commands.']);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(messagesEndRef), [messages]);
  useEffect(() => scrollToBottom(terminalEndRef), [terminalOutput]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  const handleTerminalInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      processCommand(terminalInput);
      setTerminalInput('');
    }
  };

  const processCommand = (command: string) => {
    setTerminalOutput([...terminalOutput, `> ${command}`]);
    
    switch (command.toLowerCase()) {
      case 'help':
        setTerminalOutput(prev => [...prev, 'Available commands:', isLoggedIn ? '1. profile\n2. logout\n3. help' : '1. login\n2. help']);
        break;
      case 'login':
        if (!isLoggedIn) {
          setIsLoggingIn(true);
          let dots = '';
          const loginInterval = setInterval(() => {
            dots = dots.length < 3 ? dots + '.' : '';
            setTerminalOutput(prev => [...prev.slice(0, -1), `Initializing${dots}`]);
          }, 500);
          setTimeout(() => {
            clearInterval(loginInterval);
            setIsLoggingIn(false);
            setIsLoggedIn(true);
            setTerminalOutput(prev => [...prev.slice(0, -1), 'Login successful!', 'Type "help" to see available commands.']);
          }, 3000);
        } else {
          setTerminalOutput(prev => [...prev, 'You are already logged in.']);
        }
        break;
      case 'logout':
        if (isLoggedIn) {
          setIsLoggedIn(false);
          setTerminalOutput(prev => [...prev, 'Logged out successfully.', 'Type "help" to see available commands.']);
        } else {
          setTerminalOutput(prev => [...prev, 'You are not logged in.']);
        }
        break;
      case 'profile':
        if (isLoggedIn) {
          setTerminalOutput(prev => [...prev, 'Displaying user profile...', 'Username: DemoUser', 'Rank: Novice', 'Games Played: 10']);
        } else {
          setTerminalOutput(prev => [...prev, 'You need to be logged in to view your profile.']);
        }
        break;
      default:
        setTerminalOutput(prev => [...prev, 'Unknown command. Type "help" for available commands.']);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-windows-terminal text-windows-text font-roboto-mono">
      {/* Header */}
      <div className="p-1 bg-[#D9BC77] bg-opacity-80 text-black font-inconsolata">
        Versus demo
      </div>

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Left half */}
        <div className="w-1/2 p-4 border-r border-windows-border flex flex-col">
          {/* Search buttons and bid range */}
          <div className="mb-4 flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <button className="bg-windows-button text-windows-button-text px-4 py-2 w-32 mb-2 font-press-start text-xs">find</button>
              <input type="text" placeholder="Bid range" className="w-32 px-2 py-1 bg-windows-terminal border border-windows-border text-windows-text" />
            </div>
            <div className="flex flex-col items-center">
              <button className="bg-windows-button text-windows-button-text px-4 py-2 w-32 mb-2 font-press-start text-xs">create</button>
              <input type="text" placeholder="Bid range" className="w-32 px-2 py-1 bg-windows-terminal border border-windows-border text-windows-text" />
            </div>
          </div>

          {/* Terminal */}
          <div className="border border-windows-border p-2 flex-grow overflow-y-auto bg-black">
            <div className="flex items-center mb-2">
              <Terminal size={16} className="mr-2" />
              <span className="text-green-500">versus@demo:~$</span>
            </div>
            <div className="text-green-300">
              {terminalOutput.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
            <form onSubmit={handleTerminalInput} className="mt-2 flex">
              <span className="text-green-500 mr-2">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-black text-green-300 focus:outline-none"
                disabled={isLoggingIn}
              />
            </form>
            <div ref={terminalEndRef} />
          </div>

          {/* Test Game Button */}
          <button className="mt-4 bg-windows-button text-windows-button-text px-4 py-2 font-press-start text-xs">Test Game</button>
        </div>

        {/* Right half */}
        <div className="w-1/2 p-4 flex flex-col">
          <a href="#" className="text-[#C8A2C8] hover:underline self-end mb-2">How it works?</a>
          
          {/* Game tracking panel */}
          <div className="flex-1 mb-2 border border-windows-border p-1 overflow-y-auto text-[#80CFCF]">
            <h3 className="font-bold mb-2">Recent Games</h3>
            {/* Add game tracking content here */}
            <p>No recent games to display.</p>
          </div>

          {/* Live chat area */}
          <div className="flex-1 overflow-y-auto mb-2 border border-windows-border p-1 text-[#80CFCF]">
            {messages.map((message) => (
              <div key={message.id} className="mb-1">
                <span className="text-windows-timestamp">{message.timestamp}</span>
                <span className="text-windows-sender ml-2">{message.sender}:</span>
                <span className="ml-2">{message.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="flex">
            <span className="text-windows-prompt mr-2">&gt;</span>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-windows-terminal text-[#80CFCF] focus:outline-none cursor"
              placeholder="Type your message..."
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;