import { KanbanProvider } from './contexts/KanbanContext';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import './App.css';

function App() {
  return (
    <KanbanProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <KanbanBoard />
        </main>
        <Footer />
      </div>
    </KanbanProvider>
  );
}

export default App;