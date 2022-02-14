import './App.css';
import SignUp from './components/SignUp';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
