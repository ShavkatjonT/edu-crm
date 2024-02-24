import React, { createContext, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import UserStore from './store/userStore';
import Loder from './components/loder/Loder';

// Create a default user object or provide an appropriate initial value
const defaultUser = {
  user: new UserStore(),
};
const root = ReactDOM.createRoot(document.getElementById('root'));

export const Context = createContext(defaultUser);

const renderApp = () => {
  root.render(
    <BrowserRouter>
      <Context.Provider value={defaultUser}>
        <Suspense fallback={<Loder stop={false} />}>
          <App />
        </Suspense>
      </Context.Provider>
    </BrowserRouter>

  );
};


renderApp();
