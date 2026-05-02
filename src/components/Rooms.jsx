import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Rooms() {
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const img_url = "https://victordesigner.alwaysdata.net/static/rooms/"
  const navigate = useNavigate()

  const getRooms = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await axios.get("https://victordesigner.alwaysdata.net/api/rooms")
      setRooms(response.data)
      setLoading(false)
    } catch (err) {
      setError("Rooms Error: " + err.message)
      setLoading(false)
    }
  }

  const getBookings = async () => {
    try {
      const response = await axios.post("https://victordesigner.alwaysdata.net/api/bookings")
      if (Array.isArray(response.data)) {
        setBookings(response.data)
      }
    } catch (err) {
      console.error("Bookings fetch failed", err.message)
    }
  }

  useEffect(() => {
    getRooms()
    getBookings()
  }, [])

  const isBooked = (roomId) => {
    if (bookings.length === 0) return false;
    const now = new Date()
    return bookings.some(b => {
      const checkIn = new Date(b.check_in)
      const checkOut = new Date(b.check_out)
      return (
        b.room_number === roomId &&
        now >= checkIn && 
        now < checkOut
      )
    })
  }

  return (
    <div className='row container-fluid p-4'>
      <div className="col-12">
        <h2 className="mb-4 fw-bold">Available Rooms</h2>
      </div>

      {loading && (
        <div className="col-12 d-flex align-items-center mb-4">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
          <span className="text-muted small">Checking availability...</span>
        </div>
      )}

      {!loading && (
        <>
          {error && <div className="col-12 alert alert-danger">{error}</div>}
          {rooms.map((room) => {
            const booked = isBooked(room.room_id)
            const disabledIds = [10,2,14,18,7]; 
            const isManuallyDisabled = disabledIds.includes(room.room_id);
            
            return (
              <div key={room.room_id} className='col-md-3 mb-4'>
                <div className='card shadow-sm h-100 border-0'>
                  <img 
                    src={img_url + room.photo} 
                    alt={room.description} 
                    className='card-img-top' 
                    style={{ height: '200px', objectFit: 'cover' }} 
                  />
                  <div className='card-body d-flex flex-column'>
                    <h6 className="fw-bold mb-2">{room.description}</h6>
                    <span className="badge bg-primary rounded-pill mb-3 w-50">Ksh {room.price}</span>
                    <div className="mt-auto">
                      <button
                        className={`btn w-100 fw-bold ${booked || isManuallyDisabled ? 'btn-secondary' : 'btn-success'}`}
                        disabled={booked || isManuallyDisabled}
                        onClick={() => navigate("/book", { state: { room } })}
                      >
                        {isManuallyDisabled ? "Booked" : booked ? "Occupied" : "Book Now"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default Rooms