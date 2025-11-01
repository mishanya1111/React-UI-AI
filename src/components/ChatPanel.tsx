import { useState } from 'react';
import { generateCode } from '../api';

export default function ChatPanel({ onSend }: any) {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setChatLog((prev) => [...prev, `Вы: ${input}`]);
    setInput('');

    try {
      const prompt = `
Ты — генератор React-компонентов. Верни **валидный JS**, который можно использовать в песочнице (sandbox).
Если компонент состоит из нескольких файлов, верни JSON с объектом files: { "имя_файла": "код" }.
Не используй TypeScript-аннотации или локальные алиасы.  
Описание компонента: "${input}"  
Возьми все зависимости из npm.  
Верни JSON с полями:
- files: объект { "App.js": "...", "utils.js": "..." },
- dependencies: объект вида { "имя-пакета": "версия" },
- text: краткое описание, что делает компонент.
`;

      const responseText = await generateCode(prompt);

      let parsed: {
        files: Record<string, string>;
        dependencies?: Record<string, string>;
        text?: string;
      } = {
        files: {},
        dependencies: {},
        text: '',
      };

      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        parsed.text = responseText;
      }

      console.log('files:', parsed.files);
      console.log('dependencies:', parsed.dependencies);

      if (parsed.files && parsed.dependencies) {
        onSend({ files: parsed.files, dependencies: parsed.dependencies });
      }

      if (parsed.text) {
        setChatLog((prev) => [...prev, `Gemini: ${parsed.text}`]);
      }
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [...prev, `Ошибка при обращении к Gemini`]);
    }
  };

  return (
    <div className="flex flex-col bg-white p-4 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-2">🧠 AI Chat</h2>

      <div className="flex flex-col gap-2 mb-3 h-64 overflow-y-auto border p-2 rounded bg-gray-50">
        {chatLog.map((msg, i) => (
          <div key={i} className="text-sm">
            {msg}
          </div>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Опиши компонент на естественном языке..."
        className="flex-grow border rounded-md p-2 font-mono text-sm resize-none mb-3"
        rows={4}
      />

      <button
        onClick={handleSend}
        className="mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Отправить
      </button>
    </div>
  );
}
