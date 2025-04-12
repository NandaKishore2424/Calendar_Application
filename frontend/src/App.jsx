import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Provider store={store}>
      <div style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#f9fafb'
      }}>
        <Sidebar />
        <main style={{
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Calendar />
        </main>
      </div>
    </Provider>
  );
}

export default App;
