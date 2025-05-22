import { useEffect } from 'react';
import 'sweetalert2/dist/sweetalert2.min.css';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  // Load Font Awesome for icons
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/js/all.min.js';
    script.integrity = 'sha512-naukR7I+Nk6gp7p5TMA4ycgfxaZBJ7MO5iC3Fp6ySQyKFHOGfpkSZkYVWV5R7u7cfAicxanwYQ5D1e17EfJcMA==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return (
    <AppRoutes />
  );
}

export default App;