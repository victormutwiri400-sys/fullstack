import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function GetDining() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already booked in a room
  const bookedRoom = location.state?.room || location.state?.product || null;
  const img_url = "https://victordesigner.alwaysdata.net/static/images/";

  const getMeals = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://victordesigner.alwaysdata.net/api/dining");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      setError("Dining Error: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMeals();
  }, []);

  const handleOrder = (e, product) => {
    // PREVENT PAGE RELOAD
    if (e) e.preventDefault();

    const auth = JSON.parse(localStorage.getItem("user") || "null");
    
    if (!auth) {
      navigate("/signin");
      return;
    }

    const currentUser = auth.role === 'admin' ? auth.admin : auth.user;
    
    // Address Check
    if (!currentUser?.county || !currentUser?.sub_county) {
      alert("Please set your delivery address on your profile before ordering.");
      navigate("/?action=add_address"); 
      return;
    }

    const qty = parseInt(quantities[product.dining_id] || 1);
    const mealData = {
      product_id: product.dining_id,
      product_name: `${product.name} (x${qty})`,
      product_description: product.description,
      product_cost: product.price * qty,
      product_photo: product.photo,
      quantity: qty
    };

    // LOGIC: Room guests go to payment, others go to confirm order
    if (bookedRoom) {
      navigate("/payment", { 
        state: { 
          room: bookedRoom, 
          meal: mealData 
        } 
      });
    } else {
      navigate("/orders", { 
        state: { meal: mealData } 
      });
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4">Dining Menu</h2>
      
      {/* Top Left Spinner */}
      {loading && (
        <div className="d-flex align-items-center mb-4">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted small">Loading menu...</span>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {bookedRoom && (
        <div className="alert alert-info shadow-sm mb-4">
          Adding to: {bookedRoom.description || bookedRoom.product_name}
        </div>
      )}

      {!loading && (
        <div className="row">
          {products.map((p) => (
            <div key={p.dining_id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <img 
                  src={img_url + p.photo} 
                  className="card-img-top" 
                  style={{height:"150px", objectFit:"cover"}} 
                  alt={p.name}
                />
                <div className="card-body d-flex flex-column">
                  
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{p.name}</h6>
                    <span className="badge bg-primary rounded-pill">
                      Ksh {p.price}
                    </span>
                  </div>
                  
                  <p className="small text-secondary flex-grow-1">
                    {p.description}
                  </p>

                  <div className="mt-auto">
                    <label className="small text-muted mb-1">Quantity</label>
                    <input 
                      type="number" 
                      min="1" 
                      defaultValue="1" 
                      className="form-control mb-2" 
                      onChange={(e) => setQuantities({...quantities, [p.dining_id]: e.target.value})} 
                    />
                    
                    <button 
                      type="button" 
                      className="btn btn-success w-100 fw-bold" 
                      onClick={(e) => handleOrder(e, p)}
                    >
                      {bookedRoom ? "Order to Room" : "Add & Pay"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GetDining;