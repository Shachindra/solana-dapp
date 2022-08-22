
import './App.css';
import MintToken from './MintToken';
import MintNFT from './MintNFT';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {MintToken()}
        {MintNFT()}
      </header>
    </div>
  );
}

export default App;
