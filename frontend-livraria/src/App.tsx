import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      {/* O Container fica aqui para que as notificações apareçam em qualquer tela */}
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        theme="colored"
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;