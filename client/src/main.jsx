import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Good practice to have this for react-bootstrap

// Redux Imports
import { Provider } from 'react-redux';
import store from './redux/store';

// React Router Import
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* The Provider makes the Redux store available to all components */}
    <Provider store={store}>
    
      {/* The BrowserRouter provides routing capabilities to all components */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    
    </Provider>
  </React.StrictMode>
);