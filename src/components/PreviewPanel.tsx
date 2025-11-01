import { Sandpack } from '@codesandbox/sandpack-react';

interface PreviewPanelProps {
  data: {
    files: Record<string, string>;
    dependencies?: Record<string, string>;
  };
}

export default function PreviewPanel({ data }: PreviewPanelProps) {
  const { files, dependencies = {} } = data;

  return (
    <div className="bg-white p-4 rounded-2xl shadow overflow-hidden">
      <h2 className="text-xl font-semibold mb-2">🪄 Preview</h2>
      <Sandpack
        template="react"
        customSetup={{
          dependencies: {
            react: '18.2.0',
            'react-dom': '18.2.0',
            ...dependencies,
          },
        }}
        files={files}
        options={{
          showLineNumbers: true,
          showTabs: true,
          editorHeight: 400,
          wrapContent: true,
        }}
      />
    </div>
  );
}
