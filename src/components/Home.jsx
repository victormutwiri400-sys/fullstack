import React, { useState } from "react";
import { Carousel } from 'react-bootstrap'; 
import { FaShieldAlt, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  const [auth] = useState(JSON.parse(localStorage.getItem("user")));
  const currentUser = auth?.role === 'admin' ? auth.admin : auth?.user;

  const [contactData, setContactData] = useState({ email: "", message: "" });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactData.email || !contactData.message) {
      alert("Please provide both an email and a message.");
      return;
    }
    console.log("Message Sent:", contactData);
    alert("Thank you! Your message has been sent to Hotel Luxe.");
    setContactData({ email: "", message: "" });
  };

  return (
    <div className="container-fluid p-0 overflow-hidden">
      {/* Welcome Section */}
      <div className="text-center mb-5 mt-4 px-3">
        <h1 className="display-5 fw-bold">
          Welcome, {currentUser ? (currentUser.username || currentUser.name) : "Guest"}!
        </h1>
        <p className="text-muted">Manage your bookings and explore our premium services.</p>
      </div>

      {/* Floating Hero Carousel - Kept within a container for the 'float' look */}
      <div className="container pb-5">
          <Carousel className="shadow rounded-4 overflow-hidden mx-auto" style={{maxWidth: '1100px'}}>
            <Carousel.Item interval={3000}>
              <img className="d-block w-100" src="https://victordesigner.alwaysdata.net/static/gallery/overview.jpg" alt="Hotel" style={{ height: '500px', objectFit: 'cover' }} />
            </Carousel.Item>
            <Carousel.Item interval={3000}>
              <img className="d-block w-100" src="https://victordesigner.alwaysdata.net/static/gallery/fountain.jpg" alt="Fountain" style={{ height: '500px', objectFit: 'cover' }} />
            </Carousel.Item>
            <Carousel.Item interval={3000}>
              <img className="d-block w-100" src="https://victordesigner.alwaysdata.net/static/gallery/path.jpg" alt="Path" style={{ height: '500px', objectFit: 'cover' }} />
            </Carousel.Item>
            <Carousel.Item interval={3000}>
              <img className="d-block w-100" src="https://victordesigner.alwaysdata.net/static/gallery/pool.jpg" alt="Pool" style={{ height: '500px', objectFit: 'cover' }} />
            </Carousel.Item>
          </Carousel>
      </div>

      {/* CONTENT SECTIONS - These now touch the margins */}
      <div className="container-fluid p-0">
        
        {/* Row 1: Rooms */}
        <div className="row align-items-center g-0 mb-5 pb-5 bg-white">
          <div className="col-md-6 p-0">
            <Carousel fade indicators={false} className="overflow-hidden">
              <Carousel.Item>
                <img src="https://victordesigner.alwaysdata.net/static/rooms/master1.jpg" className="d-block w-100" alt="Master Suite" style={{ height: '450px', objectFit: 'cover' }} />
              </Carousel.Item>
              <Carousel.Item>
                <img src="https://victordesigner.alwaysdata.net/static/rooms/master2.jpg" className="d-block w-100" alt="Deluxe Room" style={{ height: '450px', objectFit: 'cover' }} />
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="col-md-6 px-4 px-md-5 py-4">
            <h6 className="text-primary fw-bold text-uppercase small" style={{letterSpacing:'2px'}}>Accommodation</h6>
            <h2 className="fw-bold mb-3">Luxury Redefined & Timeless Comfort</h2>
            <p className="text-muted mb-4">Our suites are sanctuary of peace amidst the vibrant energy of the city. Each room features contemporary architecture blended with classic elegance.</p>
            <button onClick={() => navigate("/rooms")} className="btn btn-dark rounded-pill px-5 shadow-sm">Explore Our Suites</button>
          </div>
        </div>

        {/* Row 2: Dining */}
        <div className="row align-items-center g-0 mb-5 pb-5 flex-md-row-reverse bg-light">
          <div className="col-md-6 p-0">
            <Carousel fade indicators={false} className="overflow-hidden">
              <Carousel.Item>
                <img src="https://victordesigner.alwaysdata.net/static/images/dinner2.avif" className="d-block w-100" alt="Fine Dining" style={{ height: '450px', objectFit: 'cover' }} />
              </Carousel.Item>
              <Carousel.Item>
                <img src="https://victordesigner.alwaysdata.net/static/images/break1.jpg" className="d-block w-100" alt="Gourmet Breakfast" style={{ height: '450px', objectFit: 'cover' }} />
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="col-md-6 px-4 px-md-5 py-4 text-md-end">
            <h6 className="text-primary fw-bold text-uppercase small" style={{letterSpacing:'2px'}}>Gastronomy</h6>
            <h2 className="fw-bold mb-3">An Exquisite Culinary Journey</h2>
            <p className="text-muted mb-4">Dining at Hotel Luxe is a celebration of global flavors crafted with local passion using organic ingredients.</p>
            <button onClick={() => navigate("/dining")} className="btn btn-dark rounded-pill px-5 shadow-sm">View Full Menu</button>
          </div>
        </div>

        {/* Row 3: Gallery */}
        <div className="row align-items-center g-0 mb-5 pb-5 bg-white">
          <div className="col-md-6 p-0">
            <Carousel fade indicators={false} className="overflow-hidden">
              <Carousel.Item>
                <img src="https://victordesigner.alwaysdata.net/static/gallery/pool.jpg" className="d-block w-100" alt="Infinity Pool" style={{ height: '450px', objectFit: 'cover' }} />
              </Carousel.Item>
              <Carousel.Item>
                <img src="https://victordesigner.alwaysdata.net/static/gallery/parking.jpg" className="d-block w-100" alt="Parking" style={{ height: '450px', objectFit: 'cover' }} />
              </Carousel.Item>
              <Carousel.Item>
                <img src="https://victordesigner.alwaysdata.net/static/gallery/playground.jpg" className="d-block w-100" alt="Playground" style={{ height: '450px', objectFit: 'cover' }} />
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="col-md-6 px-4 px-md-5 py-4">
            <h6 className="text-primary fw-bold text-uppercase small" style={{letterSpacing:'2px'}}>Moments</h6>
            <h2 className="fw-bold mb-3">A Visual Escape Into Elegance</h2>
            <p className="text-muted mb-4">Take a virtual stroll through our lush gardens and admire the sophisticated interiors that define our property.</p>
            <button onClick={() => navigate("/gallery")} className="btn btn-dark rounded-pill px-5 shadow-sm">Browse Gallery</button>
          </div>
        </div>

        {/* Row 4: Security */}
        <div className="row align-items-center g-0 flex-md-row-reverse bg-light">
          <div className="col-md-6 p-0">
            <Carousel fade indicators={false} className="overflow-hidden">
              <Carousel.Item>
                <img src="https://victordesigner.alwaysdata.net/static/gallery/control room.jpg" className="d-block w-100" alt="Control Room" style={{ height: '450px', objectFit: 'cover' }} />
              </Carousel.Item>
              <Carousel.Item>
                <img src="https://victordesigner.alwaysdata.net/static/gallery/surgent.jpg" className="d-block w-100" alt="Security" style={{ height: '450px', objectFit: 'cover' }} />
              </Carousel.Item>
              <Carousel.Item>
                <img src="https://victordesigner.alwaysdata.net/static/gallery/dog.jpg" className="d-block w-100" alt="Security" style={{ height: '450px', objectFit: 'cover' }} />
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="col-md-6 px-4 px-md-5 py-4 text-md-end">
            <div className="d-flex align-items-center justify-content-md-end mb-3">
              <h6 className="text-primary fw-bold text-uppercase small mb-0" style={{letterSpacing:'2px'}}>Peace of Mind</h6>
              <FaShieldAlt className="text-primary ms-2 fs-4" />
            </div>
            <h2 className="fw-bold mb-3">Your Safety, Our Commitment</h2>
            <p className="text-muted mb-0">True luxury is impossible without peace of mind. Our facility is guarded 24/7 by professional security personnel and advanced surveillance systems.</p>
          </div>
        </div>
      </div>

      {/* Footer Info Section - Margin-to-Margin */}
      <section className="row bg-dark p-4 p-md-5 text-light g-0" style={{ marginTop: '0' }}>
        <div className="col-md-4 px-3 mb-4 mb-md-0">
            <h4 className="mb-4" style={{ color: '#3b82f6' }}>About Us</h4>
            <p className="opacity-75">Our restaurant is dedicated to serving delicious meals prepared with fresh ingredients, friendly service and a welcoming atmosphere, offering customers an enjoyable dining experience.</p>
            <p className="opacity-75">Quality affordability and cleanliness come together to create memorable moments for families, friends and visitors every single day.</p>
        </div>

        <div className="col-md-4 px-3 mb-4 mb-md-0">
            <h4 className="text-center mb-4" style={{ color: '#3b82f6' }}>Contact Us</h4>
            <form onSubmit={handleContactSubmit}>
                <input 
                   type="email" 
                   placeholder="Enter your email" 
                   className="form-control mb-3 bg-secondary text-white border-0 shadow-none" 
                   value={contactData.email}
                   onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                   required
                 />
                <textarea 
                   placeholder="Leave your comments" 
                   className="form-control mb-3 bg-secondary text-white border-0 shadow-none" 
                   rows="4"
                   value={contactData.message}
                   onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                   required
                 ></textarea>
                <button type="submit" className="btn btn-primary w-100 fw-bold">Send Message</button>
            </form>
        </div>

        <div className="col-md-4 px-3">
            <h4 className="text-md-end mb-4" style={{ color: '#3b82f6' }}>Stay Connected</h4>
            <div className="d-flex justify-content-md-end gap-4 mb-4">
               <a href="https://www.facebook.com" className="text-white fs-2 opacity-75 hover-opacity-100"><FaFacebook /></a>
               <a href="https://www.instagram.com" className="text-white fs-2 opacity-75 hover-opacity-100"><FaInstagram /></a>
               <a href="https://www.twitter.com" className="text-white fs-2 opacity-75 hover-opacity-100"><FaTwitter /></a>
            </div>
            <p className="text-md-end opacity-75">Stay connected with our latest restaurant specials and delicious updates by following our official social media pages.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;