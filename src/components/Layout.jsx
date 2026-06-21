import React, { useState, useEffect } from "react";
import {Dropdown, Offcanvas, Nav, Modal, Button } from 'react-bootstrap'; 
import { 
  FaUserCircle, FaSignOutAlt, FaUser, FaCamera, FaHotel, FaHistory, 
  FaFacebook, FaInstagram, FaTwitter, FaBars, FaMapMarkerAlt, FaShieldAlt, 
} from "react-icons/fa"; 
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}, [darkMode]);
  
  const [showPane, setShowPane] = useState(false);
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("user")));
  
  // Helper to get the correct user object regardless of role
  const currentUser = auth?.role === 'admin' ? auth.admin : auth?.user;

  // --- ADDRESS STATES ---
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({
    county: currentUser?.county || "",
    sub_county: currentUser?.sub_county || "",
    specific_address: currentUser?.specific_address || "",
    phone_number: currentUser?.phone_number || ""
  });

  // Nairobi Sub-Counties
  const nairobiSubCounties = [
    "Dagoretti North", "Dagoretti South", "Embakasi Central", "Embakasi East", 
    "Embakasi North", "Embakasi South", "Embakasi West", "Kamkunji", 
    "Kasarani", "Kibra", "Lang'ata", "Makadara", "Mathare", 
    "Roysambu", "Ruaraka", "Starehe", "Westlands"
  ];

  useEffect(() => {
    setAuth(JSON.parse(localStorage.getItem("user")));
    setShowPane(false);
  }, [location]);

  // Sync address form when auth changes
  useEffect(() => {
    if (currentUser) {
      setAddressForm({
        county: currentUser.county || "",
        sub_county: currentUser.sub_county || "",
        specific_address: currentUser.specific_address || "",
        phone_number: currentUser.phone_number || ""
      });
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    setAuth(null);
    navigate("/signin"); 
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    const formData = new FormData();
    const id = auth.role === 'admin' ? currentUser.admin_id : currentUser.user_id;

    formData.append("photo", file);
    formData.append("user_id", id);
    formData.append("county", currentUser.county || "");
    formData.append("sub_county", currentUser.sub_county || "");
    formData.append("specific_address", currentUser.specific_address || "");
    formData.append("phone_number", currentUser.phone_number || "");

    try {
      const response = await axios.post("https://victordesigner.alwaysdata.net/api/Profile", formData);
      if (response.data.photo) {
        let updatedAuth = auth.role === 'admin' 
            ? { ...auth, admin: { ...auth.admin, photo: response.data.photo } }
            : { ...auth, user: { ...auth.user, photo: response.data.photo } };
        
        localStorage.setItem("user", JSON.stringify(updatedAuth));
        setAuth(updatedAuth);
        alert("Profile picture updated!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error updating profile.");
    }
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    
    const formData = new FormData();
    const id = auth.role === 'admin' ? currentUser.admin_id : currentUser.user_id;
    
    formData.append("user_id", id);
    formData.append("county", addressForm.county);
    formData.append("sub_county", addressForm.sub_county);
    formData.append("specific_address", addressForm.specific_address);
    formData.append("phone_number", addressForm.phone_number);

    try {
      await axios.post("https://victordesigner.alwaysdata.net/api/Profile", formData);
      
      let updatedAuth = auth.role === 'admin' 
        ? { ...auth, admin: { ...auth.admin, ...addressForm } }
        : { ...auth, user: { ...auth.user, ...addressForm } };
        
      localStorage.setItem("user", JSON.stringify(updatedAuth));
      setAuth(updatedAuth);
      setShowAddressModal(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setAddressLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-2 sticky-top">
        <div className="container-fluid d-flex align-items-center">
          <button className="btn border-0 me-2" onClick={() => setShowPane(true)}>
            <FaBars size={22} />
          </button>

          <div className="navbar-brand fw-bold text-primary fs-3 me-4" style={{cursor: 'pointer'}} onClick={() => navigate("/")}>
              <FaHotel className="me-2" /> Hotel Luxe
          </div>

          {/* Desktop Nav */}
          <div className="collapse navbar-collapse d-none d-lg-block">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold">
              <li className="nav-item"><button className="nav-link text-dark btn border-0 bg-transparent" onClick={() => navigate("/")}>Home</button></li>
              <li className="nav-item"><button className="nav-link text-dark btn border-0 bg-transparent" onClick={() => navigate("/rooms")}>Rooms</button></li>
              <li className="nav-item"><button className="nav-link text-dark btn border-0 bg-transparent" onClick={() => navigate("/dining")}>Dining</button></li>
              <li className="nav-item"><button className="nav-link text-dark btn border-0 bg-transparent" onClick={() => navigate("/gallery")}>Gallery</button></li>
              {/* Conditional Admin Link for Desktop */}
              {auth?.role === 'admin' && (
                <li className="nav-item">
                  <button className="nav-link btn border-0 bg-transparent text-danger fw-bold" onClick={() => navigate("/admin")}>
                    <FaShieldAlt className="me-1" /> AdminDashboard
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* User Section */}
          <div className="ms-auto">
            {auth ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0 bg-transparent shadow-none">
                  {currentUser?.photo ? (
                    <img 
                      src={`https://victordesigner.alwaysdata.net/static/profiles/${currentUser.photo}`} 
                      alt="User" className="rounded-circle me-2 border"
                      style={{ width: "38px", height: "38px", objectFit: "cover" }}
                    />
                  ) : <FaUserCircle size={32} className="text-primary me-2" />}
                  <span className="fw-bold d-none d-md-inline">{currentUser?.username}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow border-0 mt-2" style={{ minWidth: '260px' }}>
                  <Dropdown.Header className="text-center border-bottom pb-3">
                    <label htmlFor="nav-upload-photo" style={{ cursor: 'pointer' }}>
                      {currentUser?.photo ? (
                        <img src={`https://victordesigner.alwaysdata.net/static/profiles/${currentUser.photo}`} className="rounded-circle mb-2 border shadow-sm" style={{ width: "65px", height: "65px", objectFit: "cover" }} alt="Profile" />
                      ) : <FaUserCircle size={65} className="text-secondary mb-2" />}
                      <div className="small text-primary fw-bold"><FaCamera /> Update Photo</div>
                    </label>
                    <input type="file" id="nav-upload-photo" hidden onChange={handleFileChange} />
                    <div className="fw-bold mt-2 text-dark fs-6">{currentUser?.username}</div>
                    <div className="text-muted small">{currentUser?.email}</div>
                  </Dropdown.Header>

                  <div className="px-3 py-3 bg-light border-bottom">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="text-primary" style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px' }}>
                            <FaMapMarkerAlt className="me-1" /> DELIVERY ADDRESS
                        </div>
                        <button className="btn btn-link btn-sm p-0 text-decoration-none fw-bold" onClick={() => setShowAddressModal(true)} style={{ fontSize: '0.75rem' }}>
                            {currentUser?.county ? "Edit" : "Add"}
                        </button>
                    </div>
                    {currentUser?.county ? (
                      <div className="ps-1">
                        <div className="fw-bold small text-dark" style={{lineHeight: '1.2'}}>
                          {currentUser.sub_county}, {currentUser.county}
                        </div>
                        <div className="text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
                          {currentUser.specific_address}
                        </div>
                      </div>
                    ) : (
                      <div className="ps-1 small text-muted fst-italic">No address set.</div>
                    )}
                  </div>

                  <Dropdown.Item onClick={() => navigate("/profile")} className="py-2 mt-1">
                    <FaUser className="me-2 text-secondary" /> Profile Settings
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/history")} className="py-2">
                    <FaHistory className="me-2 text-secondary" /> My Orders
                  </Dropdown.Item>
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item onClick={handleLogout} className="text-danger py-2">
                    <FaSignOutAlt className="me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/signin")}>Sign In</button>
            )}
          </div>
        </div>
      </nav>
      <div className="marquee-container bg-info text-dark py-2 fs-10 mt-3 rounded shadow-sm">
        <div className="marquee-text">
            Manage your bookings and explore our premium services.
        </div>
      </div>

      {/* Sidebar Pane */}
      <Offcanvas show={showPane} onHide={() => setShowPane(false)} placement="start">
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold text-primary"><FaHotel className="me-2"/> Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          <Nav className="flex-column gap-3 fs-5">
            <Nav.Link onClick={() => navigate("/")} className="text-primary border-bottom pb-2">Home</Nav.Link>
            <Nav.Link onClick={() => navigate("/rooms")} className="text-primary border-bottom pb-2">Rooms & Suites</Nav.Link>
            <Nav.Link onClick={() => navigate("/dining")} className="text-primary border-bottom pb-2">Dining</Nav.Link>
            <Nav.Link onClick={() => navigate("/gallery")} className="text-primary border-bottom pb-2">Gallery</Nav.Link>
            <Nav.Link onClick={() => navigate("/signup")} className="text-primary border-bottom pb-2">Sign Up</Nav.Link>
            <Nav.Link onClick={() => navigate("/history")} className="text-primary border-bottom pb-2">My History</Nav.Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn btn-outline-primary">
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
            {/* Conditional Admin Link for Mobile */}
            {auth?.role === 'admin' && (
                <Nav.Link onClick={() => navigate("/admin")} className="text-danger fw-bold mt-2 d-flex align-items-center">
                    <FaShieldAlt className="me-2" /> Admin Dashboard
                </Nav.Link>
            )}
          </Nav>
          <div className="mt-auto pt-4 border-top text-center">
            <div className="d-flex justify-content-center gap-4 mb-3 fs-4 text-primary">
              <FaFacebook /> <FaInstagram /> <FaTwitter />
            </div>
            <p className="small text-muted">Stay Connected with Hotel Luxe</p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* ADDRESS MODAL */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">Update Profile Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddressSave}>
            <div className="mb-3">
              <label className="small fw-bold">Phone Number</label>
              <input type="text" className="form-control" placeholder="07XXXXXXXX" required value={addressForm.phone_number}
                onChange={(e) => setAddressForm({...addressForm, phone_number: e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="small fw-bold">County</label>
              <select className="form-select" required value={addressForm.county}
                onChange={(e) => setAddressForm({...addressForm, county: e.target.value, sub_county: ""})}>
                <option value="">Select County</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Kiambu">Kiambu</option>
                <option value="Kisumu">Kisumu</option>
                <option value="Nakuru">Nakuru</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="small fw-bold">Sub-County</label>
              {addressForm.county === "Nairobi" ? (
                <select className="form-select" required value={addressForm.sub_county}
                  onChange={(e) => setAddressForm({...addressForm, sub_county: e.target.value})}>
                  <option value="">Select Sub-County</option>
                  {nairobiSubCounties.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              ) : (
                <input type="text" className="form-control" placeholder="Enter Sub-County" required
                  value={addressForm.sub_county} onChange={(e) => setAddressForm({...addressForm, sub_county: e.target.value})} />
              )}
            </div>
            <div className="mb-3">
              <label className="small fw-bold">Specific Address (Building/Room)</label>
              <textarea className="form-control" rows="2" required value={addressForm.specific_address}
                onChange={(e) => setAddressForm({...addressForm, specific_address: e.target.value})}></textarea>
            </div>
            <Button type="submit" variant="primary" className="w-100 fw-bold" disabled={addressLoading}>
              {addressLoading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <main className="flex-grow-1">{children}</main>

      <footer className="bg-black py-4 text-center text-light mt-auto">
        <p className="small mb-0 opacity-75">© 2026 Hotel Luxe. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;