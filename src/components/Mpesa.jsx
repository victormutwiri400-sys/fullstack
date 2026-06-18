import axios from 'axios';
import React, { useState } from 'react';
import { useLocation,} from 'react-router-dom';

const Mpesa = () => {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // Added error state for validation feedback
    const location = useLocation();
    
    const ROOM_URL = "https://victordesigner.alwaysdata.net/static/rooms/";
    const DINING_URL = "https://victordesigner.alwaysdata.net/static/images/";

    const { room, meal } = location.state || {};
    const selectedItems = [];
    if (room) selectedItems.push({ ...room, category: "Room Reservation" });
    if (meal) selectedItems.push({ ...meal, category: "Dining Order" });

    if (selectedItems.length === 0 && location.state?.product) {
        selectedItems.push({ ...location.state.product, category: "Room Reservation" });
    }

    const totalAmount = selectedItems.reduce((sum, item) => sum + parseFloat(item.product_cost || 0), 0);

    // --- NEW: Phone Number Sanitizer ---
    const handlePhoneChange = (e) => {
        let input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        setError(""); // Clear error while typing

        // If they start with 0, replace it with 254
        if (input.startsWith('0')) {
            input = '254' + input.substring(1);
        }
        
        // Limit to 12 characters (254 + 9 digits)
        if (input.length <= 12) {
            setPhone(input);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        
        // Final Validation
        if (!phone.startsWith("254") || phone.length !== 12) {
            setError("Invalid format! Use 2547XXXXXXXX (12 digits)");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("phone", phone);
        data.append("amount", totalAmount); 

        try {
            await axios.post("https://victordesigner.alwaysdata.net/api/mpesa_payment", data);
            alert("STK Push sent to " + phone);
        } catch (error) {
            setError("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container py-5'>
            <div className='row justify-content-center'>
                <div className='col-md-8 card shadow p-4 border-0'>
                    <h2 className='text-center mb-4 fw-bold text-success'>Payment Checkout</h2>
                    
                    <div className="row g-3 mb-4">
                        {selectedItems.map((item, index) => (
                            <div key={index} className="col-md-6">
                                <div className="card p-2 bg-light text-center border-0 shadow-sm">
                                    <img 
                                        src={item.category === "Room Reservation" ? ROOM_URL + item.product_photo : DINING_URL + item.product_photo} 
                                        style={{ height: "120px", objectFit: "cover" }} className="rounded mb-2" alt=""
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                    />
                                    <h6 className="mb-0 fw-bold">{item.product_name}</h6>
                                    <small className='text-success fw-bold'>Ksh {item.product_cost.toLocaleString()}</small>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-success text-white p-3 rounded mb-4 text-center shadow">
                        <h4 className="mb-0 fw-bold">Total: Ksh {totalAmount.toLocaleString()}</h4>
                    </div>

                    <form onSubmit={submit}>
                        <div className="mb-3 text-center">
                            <label className="form-label small fw-bold text-muted">M-Pesa Number</label>
                            <input 
                                type="tel" 
                                placeholder='2547XXXXXXXX' 
                                value={phone} 
                                onChange={handlePhoneChange} 
                                className={`form-control form-control-lg text-center fw-bold ${error ? 'is-invalid' : ''}`}
                                required 
                            />
                            {error && <div className="invalid-feedback">{error}</div>}
                            
                        </div>
                        
                        <button type='submit' className='btn btn-success btn-lg w-100 fw-bold shadow' disabled={loading}>
                            {loading ? (
                                <span><span className="spinner-border spinner-border-sm me-2"></span>Processing...</span>
                            ) : (
                                `Pay Ksh ${totalAmount.toLocaleString()}`
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Mpesa;