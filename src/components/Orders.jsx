import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // MATCHING DATA FROM GetDining.jsx: 
  // We sent: { state: { meal: mealData } }
  const { meal } = location.state || {};

  const [auth] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const currentUser = auth?.role === 'admin' ? auth.admin : auth?.user;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If someone tries to access this page without a meal, send them back
    if (!meal) {
      navigate("/dining");
    }
  }, [meal, navigate]);

  const handlePlaceOrder = async () => {
    setLoading(true);

    // Prepare payload for your Python backend
    const orderPayload = {
      user_id: auth.role === 'admin' ? currentUser.admin_id : currentUser.user_id,
      county: currentUser.county,
      sub_county: currentUser.sub_county,
      specific_address: currentUser.specific_address,
      orders: [
        {
          dining_id: meal.product_id, 
          quantity: meal.quantity
        }
      ]
    };

    try {
      // 1. Submit the order to the backend
      const res = await axios.post(
        "https://victordesigner.alwaysdata.net/api/placeorders", 
        orderPayload,
        { headers: { "Content-Type": "application/json" } }
      );
      
      if (res.status === 201 || res.data.Message) {
        // 2. STEP-BY-STEP: After successful order placement, move to Payment
        // We pass the meal data forward so the payment page knows the amount
        navigate("/payment", { state: { meal: meal } });
      }
    } catch (err) {
      console.error("Post Error:", err.response?.data || err.message);
      alert("Failed: " + (err.response?.data?.Error || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  if (!meal) return null;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0 rounded-4">
            <div className="card-header bg-white border-0 pt-4 px-4 d-flex align-items-center">
               <button className="btn btn-light btn-sm me-3" onClick={() => navigate(-1)}>
                 <FaArrowLeft />
               </button>
               <h5 className="fw-bold mb-0">Confirm Your Order</h5>
            </div>
            
            <div className="card-body p-4">
              <div className="bg-light p-3 rounded-3 mb-4 border">
                <div className="d-flex justify-content-between mb-2">
                  <span>Meal:</span>
                  <span className="fw-bold">{meal.product_name}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Quantity:</span>
                  <span className="fw-bold">x {meal.quantity}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between text-success fw-bold fs-5">
                  <span>Total Amount:</span>
                  <span>Ksh {meal.product_cost}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="small fw-bold text-muted text-uppercase mb-2">
                  <FaMapMarkerAlt className="me-1" /> Delivery Details:
                </label>
                <div className="p-3 border rounded bg-white small">
                   <strong>{currentUser.username}</strong><br/>
                   {currentUser.sub_county}, {currentUser.county}<br/>
                   <span className="text-muted">{currentUser.specific_address}</span>
                </div>
              </div>

              <button 
                className="btn btn-success w-100 py-3 fw-bold shadow-sm rounded-pill"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm & Pay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;