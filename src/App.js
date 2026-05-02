import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout'; // We will create this next
import Signup from './components/Signup';
import Signin from './components/Signin';
import Home from './components/Home';
import Booking from './components/Booking';
import Rooms from './components/Rooms';
import AdminDashboard from './components/Dashboard';
import GetDining from './components/Dining';
import Profile from './components/Profile';
import GetGallery from './components/Gallery';
import Mpesa from './components/Mpesa';
import Orders from './components/Orders';
import Help from './components/Help';
import UserOrders from './components/History';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* Wrapping all routes in Layout ensures the Navbar is on every page */}
        <Layout>
          <Routes>
            <Route path='/signup' element={<Signup />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/' element={<Home />} />
            <Route path='/book' element={<Booking />} />
            <Route path='/rooms' element={<Rooms />} />
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/dining' element={<GetDining />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/gallery' element={<GetGallery />} />
            <Route path='/payment' element={<Mpesa />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/help' element={<Help />} />
            <Route path='/history' element={<UserOrders />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;