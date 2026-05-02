import axios from "axios"; 
import { useState, useEffect } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Assign Room Data from navigation state
  const roomFromState = location.state?.room;

  const [checkIn, setCheckIn] = useState(""); 
  const [checkOut, setCheckOut] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false);

  // Security Check: Redirect if no user or no room selected
  useEffect(() => { 
    if (!localStorage.getItem("user")) {
      navigate("/signin");
    } else if (!roomFromState) {
      navigate("/rooms");
    }
  }, [navigate, roomFromState]);

  /**
   * Calculates the total cost based on nights stayed.
   * Uses Math.ceil to ensure a stay resulting in 1.1 days is billed as 2 nights.
   */
  const getStayDetails = () => {
    if (!checkIn || !checkOut || !roomFromState?.price) {
      return { nights: 0, total: 0 };
    }
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    // Difference in milliseconds converted to days
    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    
    // Logic: Minimum 1 night if dates are selected, otherwise round up
    const nights = diffInDays <= 0 ? 1 : Math.ceil(diffInDays);
    const total = nights * roomFromState.price;
    
    return { nights, total };
  };

  const { nights, total } = getStayDetails();

  const submitBooking = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setMessage("");
    
    const auth = JSON.parse(localStorage.getItem("user") || "{}");
    const user = auth.role === 'admin' ? auth.admin : auth.user;

    // Use Room ID explicitly from the passed state
    const targetRoomId = roomFromState?.room_id;

    const data = new FormData(); 
    data.append("user_id", user.user_id || user.admin_id); 
    data.append("room_number", targetRoomId); 
    data.append("check_in", checkIn); 
    data.append("check_out", checkOut);

    try { 
      const response = await axios.post("https://victordesigner.alwaysdata.net/api/bookroom", data); 
      
      if (response.data.Success) {
        // Construct the room object for the next step (Dining/Payment)
        const roomObject = {
            product_id: targetRoomId, // Explicitly assigned Room ID
            product_name: `Room ${targetRoomId}`,
            product_description: `${roomFromState.description} (${nights} Night/s)`,
            product_cost: total, // THE MULTIPLIED COST
            product_photo: roomFromState.photo 
        };

        const addMeal = window.confirm(
          `Booking successful for ${nights} night(s)!\nTotal Cost: Ksh ${total}\n\nWould you like to add a meal?`
        );

        if (addMeal) {
          navigate("/dining", { state: { room: roomObject } }); 
        } else {
          navigate("/payment", { state: { room: roomObject } });
        }
      } else {
        setMessage(response.data.Error || "Selected dates are unavailable.");
      }
    } catch (error) { 
      setMessage("Error connecting to booking service."); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 card shadow p-4 border-0 rounded-4">
          
          <div className="d-flex align-items-center mb-4">
            {loading && (
              <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
            )}
            <h3 className="fw-bold m-0">Room Booking</h3>
          </div>

          {message && <div className="alert alert-danger py-2 small">{message}</div>}

          <form onSubmit={submitBooking}>
            {/* Displaying Room ID and Description clearly */}
            <div className="mb-4 bg-light p-3 rounded border">
              <label className="small fw-bold text-muted text-uppercase d-block mb-1">
                Room Details (ID: {roomFromState?.room_id})
              </label>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">{roomFromState?.description}</span>
                <span className="badge bg-primary">Ksh {roomFromState?.price} / Night</span>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-6">
                <label className="form-label small fw-bold">Check-in</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={checkIn} 
                  onChange={(e) => setCheckIn(e.target.value)} 
                  required 
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-bold">Check-out</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={checkOut} 
                  onChange={(e) => setCheckOut(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Live Calculation Summary */}
            {checkIn && checkOut && (
              <div className="bg-primary bg-opacity-10 p-3 rounded-3 mb-4 border border-primary border-opacity-25">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="d-block fw-bold text-primary">Stay Duration</span>
                    <small className="text-muted">{nights} Night(s) × Ksh {roomFromState?.price}</small>
                  </div>
                  <div className="text-end">
                    <span className="d-block small text-muted">Total Amount</span>
                    <span className="fw-bold fs-3 text-primary">Ksh {total}</span>
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm" 
              disabled={loading || !checkIn || !checkOut}
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;