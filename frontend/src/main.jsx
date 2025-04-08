import ReactDOM from 'react-dom/client';
import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { ConfigProvider } from './area-manager/contexts/ConfigContext';
import reportWebVitals from './area-manager/reportWebVitals';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);
reportWebVitals();
document.addEventListener("DOMContentLoaded", () => {
  console.log("Document fully loaded");
});
