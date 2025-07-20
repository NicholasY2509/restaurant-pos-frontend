import React, { useState, useEffect } from 'react';
import { logger, LogLevel, LogEntry } from '../../utils/logger';
import { Download, Trash2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

const LogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    updateLogs();
    // Update logs every 2 seconds
    const interval = setInterval(updateLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateLogs = () => {
    setLogs(logger.getLogs());
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case LogLevel.WARN:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case LogLevel.INFO:
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return 'bg-red-50 border-red-200';
      case LogLevel.WARN:
        return 'bg-yellow-50 border-yellow-200';
      case LogLevel.INFO:
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const exportLogs = () => {
    const dataStr = logger.exportLogs();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearLogs = () => {
    logger.clearLogs();
    updateLogs();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="View Logs"
      >
        <AlertTriangle className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-3/4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Application Logs</h2>
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as LogLevel | 'all')}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">All Levels</option>
              <option value={LogLevel.ERROR}>Errors Only</option>
              <option value={LogLevel.WARN}>Warnings Only</option>
              <option value={LogLevel.INFO}>Info Only</option>
              <option value={LogLevel.DEBUG}>Debug Only</option>
            </select>
            <button
              onClick={exportLogs}
              className="btn-secondary flex items-center text-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            <button
              onClick={clearLogs}
              className="btn-secondary flex items-center text-sm"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Logs Content */}
        <div className="flex-1 overflow-auto p-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No logs to display
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border ${getLevelColor(log.level)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(log.level)}
                      <span className="text-xs font-mono text-gray-600">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        log.level === LogLevel.ERROR ? 'bg-red-100 text-red-800' :
                        log.level === LogLevel.WARN ? 'bg-yellow-100 text-yellow-800' :
                        log.level === LogLevel.INFO ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.level.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium">{log.message}</p>
                    {log.error && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-600 cursor-pointer">
                          Error Details
                        </summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {log.error.stack || log.error.message}
                        </pre>
                      </details>
                    )}
                    {log.context && Object.keys(log.context).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-600 cursor-pointer">
                          Context
                        </summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(log.context, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Total logs: {logs.length}</span>
            <span>Showing: {filteredLogs.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsViewer; 