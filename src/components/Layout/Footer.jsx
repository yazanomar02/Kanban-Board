import { useKanban } from '../../contexts/KanbanContext';

const Footer = () => {
    const { getStats } = useKanban();
    const stats = getStats();

    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-12 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            © {currentYear} Kanban Board. All rights reserved.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">
                                {stats.totalColumns} Columns
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">
                                {stats.completedTasks} Completed
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">
                                {stats.pendingTasks} Pending
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">
                                {stats.completionRate}% Done
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6">
                        <a
                            href="#"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 
                         dark:hover:text-blue-400 text-sm transition-colors"
                        >
                            Documentation
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 
                         dark:hover:text-blue-400 text-sm transition-colors"
                        >
                            Support
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 
                         dark:hover:text-blue-400 text-sm transition-colors"
                        >
                            Privacy
                        </a>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${stats.completionRate}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;