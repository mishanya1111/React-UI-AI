import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { useEffect } from 'react';

interface PreviewPanelProps {
  data: {
    files: Record<string, string>;
    dependencies?: Record<string, string>;
  };
  onChange?: (files: Record<string, string>) => void;
}

export default function PreviewPanel({ data, onChange }: PreviewPanelProps) {
  const { files, dependencies = {} } = data;

  return (
    <div className="bg-white p-4 rounded-2xl shadow overflow-hidden">
      <h2 className="text-xl font-semibold mb-2">🪄 Preview</h2>

      <SandpackProvider
        template="react"
        customSetup={{
          dependencies: {
            react: '18.2.0',
            'react-dom': '18.2.0',
            ...dependencies,
          },
        }}
        files={files}
      >
        <SyncFiles onChange={onChange} />
        <SandpackLayout>
          <SandpackCodeEditor showTabs showLineNumbers />
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

function SyncFiles({ onChange }: { onChange?: (files: Record<string, string>) => void }) {
  const { listen } = useSandpack();

  useEffect(() => {
    if (!onChange) return;

    const unsubscribe = listen((message) => {
      if (message.type === 'state' && message.state) {
        const files: Record<string, string> = {};
        Object.entries(message.state.transpiledModules).forEach(([path, fileObj]) => {
          if (!path.includes('node_modules')) files[path] = fileObj.module.code;
        });
        onChange(files);
      }
    });

    return () => unsubscribe();
  }, [listen, onChange]);

  return null;
}
