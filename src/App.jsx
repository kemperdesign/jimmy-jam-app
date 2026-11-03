import './App.css';
import JimmyJamApp from './JimmyJamApp';
import AdminPage from './AdminPage';

export default function App() {
  // Staff-only admin page on the website. The app never links here.
  if (window.location.pathname.replace(/\/+$/, '') === '/admin') {
    return <AdminPage />;
  }
  return <JimmyJamApp />;
}
