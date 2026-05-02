import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const ROOM_URL = "https://victordesigner.alwaysdata.net/static/rooms/";
    const DINING_URL = "https://victordesigner.alwaysdata.net/static/images/";

    useEffect(() => {
        const fetchData = async () => {
            const authData = JSON.parse(localStorage.getItem("user"));
            
            // Check if user is logged in
            if (!authData) {
                navigate("/signin");
                return;
            }

            // Correctly identify the user ID based on role
            const currentUser = authData.role === 'admin' ? authData.admin : authData.user;
            const userId = currentUser?.user_id || currentUser?.admin_id;

            if (!userId) {
                setError("User ID not found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                // Fetching both datasets using the correct userId
                const [bookingsRes, ordersRes] = await Promise.all([
                    axios.get(`https://victordesigner.alwaysdata.net/api/user_bookings/${userId}`),
                    axios.get(`https://victordesigner.alwaysdata.net/api/orders/${userId}`)
                ]);

                // Map Bookings - Ensure we match your DB column names
                const bookings = (bookingsRes.data.Bookings || []).map(item => ({
                    id: item.booking_id,
                    type: 'Room Stay',
                    title: `Room ${item.room_number}`,
                    desc: `${new Date(item.check_in).toLocaleDateString()} - ${new Date(item.check_out).toLocaleDateString()}`,
                    cost: item.price, 
                    date: item.booking_date,
                    photo: item.photo, // This pulls from ROOM_URL
                    isRoom: true
                }));

                // Map Orders - Ensure we match your DB column names
                const orders = (ordersRes.data.Orders || []).map(item => ({
                    id: item.order_id,
                    type: 'Dining',
                    title: item.name,
                    desc: `Qty: ${item.quantity} | ${item.description}`,
                    cost: item.total_cost,
                    date: item.order_date,
                    photo: item.photo, // This pulls from DINING_URL
                    isRoom: false
                }));

                // Combine and sort by date (newest first)
                const combined = [...bookings, ...orders].sort((a, b) => 
                    new Date(b.date) - new Date(a.date)
                );

                setHistory(combined);
            } catch (err) {
                console.error("History Error:", err);
                setError("Failed to fetch history.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary border-3" role="status"></div>
            <p className="mt-3 fw-bold text-secondary">Loading your activity...</p>
        </div>
    );

    return (
        <div className="container-fluid p-4">
            <h2 className="fw-bold mb-4 text-dark text-center">Activity History</h2>
            
            {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}

            <div className="row">
                {history.map((item, index) => (
                    <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                            <div className="position-relative">
                                <img 
                                    src={item.isRoom ? ROOM_URL + item.photo : DINING_URL + item.photo} 
                                    alt={item.title} 
                                    className="card-img-top"
                                    style={{ height: "180px", objectFit: "cover" }}
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src = "https://via.placeholder.com/300x180?text=Image+Not+Found"; 
                                    }}
                                />
                                <span className={`position-absolute top-0 end-0 m-2 badge rounded-pill ${item.isRoom ? 'bg-primary' : 'bg-success'}`}>
                                    {item.type}
                                </span>
                            </div>
                            
                            <div className="card-body d-flex flex-column p-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="fw-bold mb-0 text-truncate" style={{maxWidth: '80%'}}>{item.title}</h6>
                                    <small className="text-muted opacity-75">#{item.id}</small>
                                </div>
                                
                                <p className="text-secondary small flex-grow-1 mb-3">
                                    {item.desc}
                                </p>
                                
                                <div className="mt-auto border-top pt-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold text-dark">
                                            Ksh {parseFloat(item.cost || 0).toLocaleString()}
                                        </span>
                                        <span className="text-muted x-small" style={{ fontSize: '0.7rem' }}>
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {!error && history.length === 0 && (
                <div className="text-center py-5">
                    <div className="mb-3">
                        <i className="bi bi- bag-x text-muted" style={{fontSize: '3rem'}}></i>
                    </div>
                    <p className="text-muted fs-5">You haven't made any bookings or orders yet.</p>
                    <button onClick={() => navigate("/rooms")} className="btn btn-primary rounded-pill px-4">Start Exploring</button>
                </div>
            )}
        </div>
    );
};

export default Orders;