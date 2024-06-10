import ReactDOM from 'react-dom/client'
import './global.css'
import { RouterProvider } from "react-router-dom";
import routes from './routes';
import Provider from './Provider';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider>
    <RouterProvider router={routes} />
  </Provider>
)
