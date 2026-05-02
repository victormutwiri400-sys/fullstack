import React from "react";
import { Accordion, Container, Row, Col, Card } from "react-bootstrap";
import { FaQuestionCircle, FaBed, FaUtensils, FaLock, FaCreditCard } from "react-icons/fa";

const Help = () => {
  return (
    // fluid makes the container span the total width of the viewport
    <Container fluid className="py-5 px-md-5">
      <div className="text-center mb-5">
        <h6 className="text-primary fw-bold text-uppercase small" style={{ letterSpacing: '2px' }}>Support Center</h6>
        <h1 className="display-4 fw-bold">How can we help you?</h1>
        <p className="lead text-muted">Find answers to frequently asked questions about your stay at Hotel Luxe.</p>
      </div>

      <Row className="justify-content-center">
        {/* xs={12} and lg={12} ensures it fits the whole screen width */}
        <Col xs={12} lg={12}>
          <Accordion defaultActiveKey="0" className="shadow-sm rounded-4 overflow-hidden border-0">
            
            {/* Category: Bookings */}
            <Card className="border-0 border-bottom rounded-0">
              <Accordion.Item eventKey="0" className="border-0">
                <Accordion.Header className="py-2">
                  <FaCreditCard className="me-3 text-primary fs-4" /> 
                  <span className="fw-bold fs-5">Reservations & Payments</span>
                </Accordion.Header>
                <Accordion.Body className="text-muted bg-white py-4">
                  <ul className="fs-6">
                    <li className="mb-3"><strong>How do I book a room?</strong> Simply navigate to the "Rooms" page, select your preferred suite, and click "Book Now."</li>
                    <li className="mb-3"><strong>Can I pay via M-Pesa?</strong> Yes, we support M-Pesa payments through our secure checkout portal.</li>
                    <li><strong>What is the cancellation policy?</strong> You can cancel up to 24 hours before your check-in date via your "History" tab.</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Card>

            {/* Category: Stay & Amenities */}
            <Card className="border-0 border-bottom rounded-0">
              <Accordion.Item eventKey="1" className="border-0">
                <Accordion.Header className="py-2">
                  <FaBed className="me-3 text-primary fs-4" /> 
                  <span className="fw-bold fs-5">Check-in & Room Amenities</span>
                </Accordion.Header>
                <Accordion.Body className="text-muted bg-white py-4 fs-6">
                  <p><strong>Check-in:</strong> 2:00 PM | <strong>Check-out:</strong> 11:00 AM</p>
                  <p className="mb-0">All our rooms come equipped with high-speed Wi-Fi, 24/7 room service, and secure electronic safes for your valuables.</p>
                </Accordion.Body>
              </Accordion.Item>
            </Card>

            {/* Category: Dining */}
            <Card className="border-0 border-bottom rounded-0">
              <Accordion.Item eventKey="2" className="border-0">
                <Accordion.Header className="py-2">
                  <FaUtensils className="me-3 text-primary fs-4" /> 
                  <span className="fw-bold fs-5">Dining & Gastronomy</span>
                </Accordion.Header>
                <Accordion.Body className="text-muted bg-white py-4 fs-6">
                  <p className="mb-0">Our restaurant is open daily from 6:30 AM to 11:00 PM. We offer a variety of cuisines including local Kenyan delicacies and international fusion dishes. Room service is available 24 hours a day.</p>
                </Accordion.Body>
              </Accordion.Item>
            </Card>

            {/* Category: Account & Security */}
            <Card className="border-0 rounded-0">
              <Accordion.Item eventKey="3" className="border-0">
                <Accordion.Header className="py-2">
                  <FaLock className="me-3 text-primary fs-4" /> 
                  <span className="fw-bold fs-5">Account & Profile Security</span>
                </Accordion.Header>
                <Accordion.Body className="text-muted bg-white py-4 fs-6">
                  <p className="mb-3"><strong>How do I change my profile photo?</strong> Click on your profile name in the navbar, hover over the avatar, and click "Change Photo."</p>
                  <p className="mb-0"><strong>Is my data safe?</strong> We use end-to-end encryption for all transactions and 24/7 monitoring to ensure your personal data is protected.</p>
                </Accordion.Body>
              </Accordion.Item>
            </Card>

          </Accordion>

          {/* Contact Support Box */}
          <div className="mt-5 p-5 bg-light rounded-4 text-center border shadow-sm">
            <FaQuestionCircle size={50} className="text-primary mb-3" />
            <h3 className="fw-bold">Still have questions?</h3>
            <p className="text-muted fs-5">If you cannot find the answer you are looking for, please contact our 24/7 support team.</p>
            
            {/* Updated Button with Mailto Functionality */}
            <button 
              className="btn btn-primary btn-lg px-5 rounded-pill mt-3 shadow"
              onClick={() => window.location.href = "mailto:support@hotelluxe.com?subject=Support Request"}
            >
              Contact Support
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Help;