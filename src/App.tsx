import AppRouter from './AppRouter';
import { ProfileProvider } from './context/ProfileContext';

function App() {
  return (
    <ProfileProvider>
      <AppRouter />
    </ProfileProvider>
  );
}

export default App;