import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaPhone, FaIdBadge, FaSignOutAlt } from 'react-icons/fa';

function Profile() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [person, setPerson] = useState(null);

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("user") || "null");
    if (storedAuth) {
      setAuth(storedAuth);
      // Determine if we extract from .user or .admin
      setPerson(storedAuth.role === 'admin' ? storedAuth.admin : storedAuth.user);
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  if (!person) return <div className="text-center mt-5">Loading Profile...</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0 overflow-hidden">
            {/* Profile Header/Cover Color */}
            <div className="bg-primary" style={{ height: '100px' }}></div>
            
            <div className="card-body text-center position-relative" style={{ marginTop: '-50px' }}>
              {/* The Full Profile Image */}
              <div className="mb-3">
                {person.photo ? (
                  <img 
                    src={`https://victordesigner.alwaysdata.net/static/profiles/${person.photo}`} 
                    alt="Full Profile" 
                    className="rounded-circle  border-4 border-white shadow"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                ) : (
                  <FaUserCircle size={120} className="text-light bg-secondary rounded-circle  border-4 border-white shadow" />
                )}
              </div>

              <h3 className="fw-bold">{person.username || person.name}</h3>
              <p className="badge bg-light text-primary border mb-4">
                {auth.role === 'admin' ? "Administrator" : "Valued Guest"}
              </p>

              <div className="text-start px-3">
                <div className="d-flex align-items-center mb-3">
                  <FaEnvelope className="text-muted me-3" />
                  <div>
                    <small className="text-muted d-block">Email Address</small>
                    <span className="fw-medium">{person.email}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <FaPhone className="text-muted me-3" />
                  <div>
                    <small className="text-muted d-block">Phone Number</small>
                    {/* Fixed to fetch phone_number from database/localStorage */}
                    <span className="fw-medium">{person.phone_number || "Not provided"}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <FaIdBadge className="text-muted me-3" />
                  <div>
                    <small className="text-muted d-block">Account ID</small>
                    <span className="fw-medium">#{person.user_id || person.admin_id}</span>
                  </div>
                </div>
              </div>

              <hr />

              <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout from Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;