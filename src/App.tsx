import { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import PreviewPanel from './components/PreviewPanel';
import './App.css';

export default function App() {
  const [data, setData] = useState<{
    files: Record<string, string>;
    dependencies?: Record<string, string>;
  }>({
    files: {
      '/App.js': `export default function App() {
  return <h1>👋 Привет, я React-компонент!</h1>;
}`,
    },
    dependencies: {},
  });

  return (
    <div className="grid grid-cols-2 gap-4 p-4 h-screen bg-gray-100 text-black">
      <ChatPanel onSend={setData} />
      <PreviewPanel data={data} />
    </div>
  );
}
