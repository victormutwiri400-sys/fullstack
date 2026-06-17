import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from './Pagination'

function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8 

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

  useEffect(() => {
    getRooms()
  }, [])

  // PAGINATION MATH
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);

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
          {currentRooms.map((room) => {
            // Using the status directly from the API (returns 'booked' or 'available')
            const isOccupied = room.status === 'booked';
            
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
                        className={`btn w-100 fw-bold ${isOccupied ? 'btn-secondary' : 'btn-success'}`}
                        disabled={isOccupied}
                        onClick={() => navigate("/book", { state: { room } })}
                      >
                        {isOccupied ? "Occupied" : "Book Now"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* PAGINATION CONTROLS */}
          <div className="col-12">
            <Pagination 
              totalItems={rooms.length} 
              itemsPerPage={itemsPerPage} 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Rooms