import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [allOrders, setAllOrders] = useState([]); 
  const [allBookings, setAllBookings] = useState([]); 

  // --- FORM STATES ---
  const [roomDescription, setRoomDescription] = useState("")
  const [roomPrice, setRoomPrice] = useState("")
  const [roomPhoto, setRoomPhoto] = useState("")
  const [roomMsg, setRoomMsg] = useState("")

  const [diningName, setDiningName] = useState("")
  const [diningDescription, setDiningDescription] = useState("")
  const [diningPrice, setDiningPrice] = useState("")
  const [diningPhoto, setDiningPhoto] = useState("")
  const [diningMsg, setDiningMsg] = useState("")
  const [diningCategory, setDiningCategory] = useState("Breakfast");

  const [galleryName, setGalleryName] = useState("")
  const [galleryDescription, setGalleryDescription] = useState("")
  const [galleryPhoto, setGalleryPhoto] = useState("")
  const [galleryMsg, setGalleryMsg] = useState("")

  const [superEmail, setSuperEmail] = useState("");
  const [superPassword, setSuperPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // UPDATE ROOM
const [updateRoomId, setUpdateRoomId] = useState("")
const [updateRoomDescription, setUpdateRoomDescription] = useState("")
const [updateRoomPrice, setUpdateRoomPrice] = useState("")
const [updateRoomPhoto, setUpdateRoomPhoto] = useState("")
const [updateRoomMsg, setUpdateRoomMsg] = useState("")

// UPDATE DINING
const [updateDiningId, setUpdateDiningId] = useState("")
const [updateDiningName, setUpdateDiningName] = useState("")
const [updateDiningDescription, setUpdateDiningDescription] = useState("")
const [updateDiningPrice, setUpdateDiningPrice] = useState("")
const [updateDiningPhoto, setUpdateDiningPhoto] = useState("")
const [updateDiningMsg, setUpdateDiningMsg] = useState("")


  // --- INITIAL LOAD ---
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user") || "{}");
    if (auth.role === "admin") {
      setAuthorized(true);
      fetchAllOrders(); 
      fetchAllBookings();
    } else {
      alert("Access Denied: Admins Only!");
      navigate("/");
    }
  }, [navigate]);

  // --- FETCH FUNCTIONS ---
  const fetchAllOrders = async () => {
    // Removed setAllOrders([]); to prevent the UI from flickering to 'empty' during refresh
    try {
      const res = await axios.get(`https://victordesigner.alwaysdata.net/api/all_orders?t=${Date.now()}`);
      // Bulletproof check for both capitalized 'Orders' and lowercase 'orders'
      const data = res.data.Orders || res.data.orders || [];
      setAllOrders(data);
    } catch (err) {
      console.error("Order Fetch Error: ", err.message);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get(`https://victordesigner.alwaysdata.net/api/all_bookings?t=${Date.now()}`);
      const data = res.data.Bookings || res.data.bookings || [];
      setAllBookings(data);
    } catch (err) {
      console.error("Booking Fetch Error: ", err.message);
    }
  };

  // Helper for consistent date-time formatting
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', ' at');
  };

  // --- SUBMIT HANDLERS ---
  const submitRoom = async (e) => {
    e.preventDefault(); setRoomMsg("Please wait...");
    const data = new FormData();
    data.append("description", roomDescription);
    data.append("price", roomPrice);
    data.append("photo", roomPhoto);
    try {
      const res = await axios.post("https://victordesigner.alwaysdata.net/api/addRoom", data);
      setRoomMsg(res.data.Message);
      setRoomDescription(""); setRoomPrice(""); setRoomPhoto("");
    } catch (err) { setRoomMsg("Error: " + err.message); }
  }

  const submitDining = async (e) => {
    e.preventDefault(); setDiningMsg("Please wait...");
    const data = new FormData();
    data.append("name", diningName);
    data.append("description", diningDescription);
    data.append("price", diningPrice);
    data.append("photo", diningPhoto);
    data.append("category", diningCategory);
    try {
      const res = await axios.post("https://victordesigner.alwaysdata.net/api/addDining", data);
      setDiningMsg(res.data.Message);
      setDiningName(""); setDiningDescription(""); setDiningPrice(""); setDiningPhoto("");
    } catch (err) { setDiningMsg("Error: " + err.message); }
  }

  const submitGallery = async (e) => {
    e.preventDefault(); setGalleryMsg("Uploading...");
    const data = new FormData();
    data.append("name", galleryName);
    data.append("description", galleryDescription);
    data.append("photo", galleryPhoto);
    try {
      const res = await axios.post("https://victordesigner.alwaysdata.net/api/addGallery", data);
      setGalleryMsg(res.data.Message || "Gallery item added!");
      setGalleryName(""); setGalleryDescription(""); setGalleryPhoto("");
    } catch (err) { setGalleryMsg("Error: " + err.message); }
  }

  const submitAdmin = async (e) => {
    e.preventDefault(); setMessage("Please wait...");
    const data = new FormData();
    data.append("admin_email", superEmail);
    data.append("admin_password", superPassword);
    data.append("name", name);
    data.append("email", email);
    data.append("new_password", newPassword);
    data.append("phone", phone);
    try {
      const res = await axios.post("https://victordesigner.alwaysdata.net/api/createAdmin", data);
      setMessage(res.data.message);
      setSuperEmail(""); setSuperPassword(""); setName(""); setEmail(""); setNewPassword(""); setPhone("");
    } catch (err) { setMessage("Error: " + err.message); }
  }

  if (!authorized) return null;

  // update room
  const submitUpdateRoom = async (e) => {
  e.preventDefault();
  setUpdateRoomMsg("Please wait...");

  const data = new FormData();

  data.append("room_id", updateRoomId);

  if (updateRoomDescription)
    data.append("description", updateRoomDescription);

  if (updateRoomPrice)
    data.append("price", updateRoomPrice);

  if (updateRoomPhoto)
    data.append("photo", updateRoomPhoto);

  try {
    const res = await axios.post(
      "https://victordesigner.alwaysdata.net/api/updateRoom",
      data
    );

    setUpdateRoomMsg(
      res.data.Success || res.data.Message
    );

    setUpdateRoomId("");
    setUpdateRoomDescription("");
    setUpdateRoomPrice("");
    setUpdateRoomPhoto("");

  } catch (err) {
    setUpdateRoomMsg("Error: " + err.message);
  }
}

// update dining
const submitUpdateDining = async (e) => {
  e.preventDefault();

  setUpdateDiningMsg("Please wait...");

  const data = new FormData();

  data.append("dining_id", updateDiningId);

  if (updateDiningName)
    data.append("name", updateDiningName);

  if (updateDiningDescription)
    data.append("description", updateDiningDescription);

  if (updateDiningPrice)
    data.append("price", updateDiningPrice);

  if (updateDiningPhoto)
    data.append("photo", updateDiningPhoto);

  try {

    const res = await axios.post(
      "https://victordesigner.alwaysdata.net/api/updateDining",
      data
    );

    setUpdateDiningMsg(
      res.data.Success || res.data.Message
    );

    setUpdateDiningId("");
    setUpdateDiningName("");
    setUpdateDiningDescription("");
    setUpdateDiningPrice("");
    setUpdateDiningPhoto("");

  } catch (err) {
  console.log(err.response?.data);
  setUpdateDiningMsg(
    err.response?.data?.Message ||
    err.response?.data?.Error ||
    err.message
  );
}
}

  return (
    <div className="container-fluid mt-4 px-4 pb-5">
      <h2 className="mb-4 fw-bold text-dark">Hotel Admin Dashboard</h2>
      
      {/* SECTION 1: MANAGEMENT FORMS (GRID) */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold text-primary border-bottom pb-2 mb-3">Add Room</h5>
            <form onSubmit={submitRoom}>
              {roomMsg && <p className="text-info small">{roomMsg}</p>}
              <textarea className="form-control mb-3" placeholder='Description' value={roomDescription} onChange={(e) => setRoomDescription(e.target.value)} required />
              <input type="number" className="form-control mb-3" placeholder='Price' value={roomPrice} onChange={(e) => setRoomPrice(e.target.value)} required />
              <input type="file" className="form-control mb-3" onChange={(e) => setRoomPhoto(e.target.files[0])} required />
              <button type="submit" className="btn btn-primary w-100">Add Room</button>
            </form>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold text-success border-bottom pb-2 mb-3">Add Dining</h5>
            <form onSubmit={submitDining}>
              {diningMsg && <p className="text-info small">{diningMsg}</p>}
              <input type="text" className="form-control mb-3" placeholder='Meal name' value={diningName} onChange={(e) => setDiningName(e.target.value)} required />
              <select
                className="form-select mb-3"
                value={diningCategory}
                onChange={(e) => setDiningCategory(e.target.value)} required>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
              <textarea className="form-control mb-3" placeholder='Description' value={diningDescription} onChange={(e) => setDiningDescription(e.target.value)} required />
              <input type="number" className="form-control mb-3" placeholder='Price' value={diningPrice} onChange={(e) => setDiningPrice(e.target.value)} required />
              <input type="file" className="form-control mb-3" onChange={(e) => setDiningPhoto(e.target.files[0])} required />
              <button type="submit" className="btn btn-success w-100">Add Dining</button>
            </form>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">Add Gallery</h5>
            <form onSubmit={submitGallery}>
              {galleryMsg && <p className="text-info small">{galleryMsg}</p>}
              <input type="text" className="form-control mb-3" placeholder='Title' value={galleryName} onChange={(e) => setGalleryName(e.target.value)} required />
              <textarea className="form-control mb-3" placeholder='Description' value={galleryDescription} onChange={(e) => setGalleryDescription(e.target.value)} required />
              <input type="file" className="form-control mb-3" onChange={(e) => setGalleryPhoto(e.target.files[0])} required />
              <button type="submit" className="btn btn-dark w-100">Add to Gallery</button>
            </form>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold text-danger border-bottom pb-2 mb-3">New Admin</h5>
            <form onSubmit={submitAdmin}>
              {message && <p className="text-info small">{message}</p>}
              <input type="email" className="form-control mb-2" placeholder='Super email' value={superEmail} onChange={(e) => setSuperEmail(e.target.value)} required />
              <input type="password" className="form-control mb-2" placeholder='Super pass' value={superPassword} onChange={(e) => setSuperPassword(e.target.value)} required />
              <hr className="my-2" />
              <input type="text" className="form-control mb-2" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" className="form-control mb-2" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" className="form-control mb-2" placeholder='Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <button type="submit" className="btn btn-danger w-100">Create Admin</button>
            </form>
          </div>
        </div>
      </div>

      <hr className="my-5" />

      {/* SECTION 2: FULL-WIDTH TABLES */}
      
      {/* FOOD ORDERS ROW */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card shadow border-0 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-secondary mb-0">Incoming Food Orders</h4>
              <button className="btn btn-secondary px-4 shadow-sm" onClick={fetchAllOrders}>
                Refresh Orders
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Info</th>
                    <th>Item Name</th>
                    <th>Qty</th>
                    <th>Total Cost</th>
                    <th>Order Time</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.length > 0 ? (
                    allOrders.map((order, index) => (
                      <tr key={index}>
                        <td>#{order.order_id}</td>
                        <td>
                          <div className="fw-bold text-dark">{order.username || `User ${order.user_id}`}</div>
                          <div className="small text-primary">
                            {order.sub_county && order.county ? (
                                <span>{order.sub_county}, {order.county}</span>
                            ) : <span className="text-muted fst-italic">No location set</span>}
                          </div>
                          <div className="small text-muted" style={{maxWidth: '200px'}}>{order.specific_address}</div>
                        </td>
                        {/* Added fallbacks to ensure content displays if backend join fails */}
                        <td><span className="fw-bold">{order.name || `ID: ${order.dining_id}`}</span></td>
                        <td>x{order.quantity}</td>
                        <td className="text-success fw-bold">Ksh {order.total_cost || "0.00"}</td>
                        <td>{formatDateTime(order.order_date)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="text-center text-muted py-5">No food orders to show.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ROOM RESERVATIONS ROW */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card shadow border-0 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-primary mb-0">Room Reservations</h4>
              <button className="btn btn-primary px-4 shadow-sm" onClick={fetchAllBookings}>
                Refresh Bookings
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>Booking ID</th>
                    <th>User ID</th>
                    <th>Room Number</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.length > 0 ? (
                    allBookings.map((book, index) => (
                      <tr key={index}>
                        <td>#{book.booking_id}</td>
                        <td>User {book.user_id}</td>
                        <td className="fw-bold">Room {book.room_number}</td>
                        <td>{new Date(book.check_in).toLocaleDateString()}</td>
                        <td>{new Date(book.check_out).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge px-3 py-2 ${book.status === 'Free' ? 'bg-success' : book.status === 'Occupied' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {book.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="text-center text-muted py-5">No reservations to show.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">

      {/* UPDATE ROOM */}

      <div className="col-md-4">
        <div className="card shadow-sm border-0 p-4 h-100">
          <h5 className="fw-bold text-warning border-bottom pb-2 mb-3">
         Update Room
        </h5>
                
        ```
      <form onSubmit={submitUpdateRoom}>

      {updateRoomMsg && (
      <p className="text-info small">{updateRoomMsg}</p>
      )}

      <input
      type="number"
      className="form-control mb-3"
      placeholder="Room ID"
      value={updateRoomId}
      onChange={(e) => setUpdateRoomId(e.target.value)}
      required
      />

      <textarea
      className="form-control mb-3"
      placeholder="New Description"
      value={updateRoomDescription}
      onChange={(e) =>
        setUpdateRoomDescription(e.target.value)
      }
      />

      <input
      type="number"
      className="form-control mb-3"
      placeholder="New Price"
      value={updateRoomPrice}
      onChange={(e) =>
        setUpdateRoomPrice(e.target.value)
      }
      />

      <input
      type="file"
      className="form-control mb-3"
      onChange={(e) =>
        setUpdateRoomPhoto(e.target.files[0])
      }
      />

      <button
      type="submit"
      className="btn btn-warning w-100"
      >
      Update Room
      </button>

      </form>
      </div>
      ```

      </div>

      {/* UPDATE DINING */}

      <div className="col-md-4">
        <div className="card shadow-sm border-0 p-4 h-100">
          <h5 className="fw-bold text-info border-bottom pb-2 mb-3">
          Update Dining
          </h5>

      ```
      <form onSubmit={submitUpdateDining}>

      {updateDiningMsg && (
      <p className="text-info small">{updateDiningMsg}</p>
      )}

      <input
        type="number"
        className="form-control mb-3"
        placeholder="Dining ID"
        value={updateDiningId}
        onChange={(e) =>
        setUpdateDiningId(e.target.value)
        }
        required
      />

      <input
        type="text"
        className="form-control mb-3"
        placeholder="New Meal Name"
        value={updateDiningName}
        onChange={(e) =>
        setUpdateDiningName(e.target.value)
      }
      />

      <textarea
        className="form-control mb-3"
        placeholder="New Description"
        value={updateDiningDescription}
        onChange={(e) =>
        setUpdateDiningDescription(e.target.value)
      }
      />

      <input
        type="number"
        className="form-control mb-3"
        placeholder="New Price"
        value={updateDiningPrice}
        onChange={(e) =>
        setUpdateDiningPrice(e.target.value)
      }
      />

      <input
        type="file"
        className="form-control mb-3"
        onChange={(e) =>
        setUpdateDiningPhoto(e.target.files[0])
      }
      />

      <button
      type="submit"
      className="btn btn-info w-100"
      >
      Update Dining
      </button>

      </form>
      </div>
      ```

      </div>

      </div>


    </div>
  )
}

export default AdminDashboard;