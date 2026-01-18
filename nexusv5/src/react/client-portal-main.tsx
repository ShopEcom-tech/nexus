import React from 'react';
import ReactDOM from 'react-dom/client';
import KanbanBoard from './tailadmin_layer/components/task/kanban/KanbanBoard';
import './tailadmin_layer/index.css'; // Import TailAdmin styles

// Wrapper to provide simple context if needed (DndProvider is inside KanbanBoard)
const ClientPortal = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Project: E-Commerce Redesign</h1>
                    <p className="text-gray-500">Track the real-time progress of your project.</p>
                </div>
                <span className="px-4 py-2 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium border border-green-500/20">
                    Status: On Track
                </span>
            </div>

            {/* We mount the Kanban Board here */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
                <KanbanBoard />
            </div>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('client-root') as HTMLElement).render(
    <React.StrictMode>
        <ClientPortal />
    </React.StrictMode>,
);
