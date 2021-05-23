import '../App.css';
import CardsControl from './CardsControl'
import { UserProvider } from '../context/UserContext';
function App() {


  return (
    <>
      <UserProvider >
        <CardsControl />
      </UserProvider>
    </>
  );
}
export default App;
