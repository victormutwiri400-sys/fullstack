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
  const [priceRange, setPriceRange] = useState("all")
  const [priceOrder, setPriceOrder] = useState("low-high")
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

  useEffect(() => {
    setCurrentPage(1)
  }, [priceRange, priceOrder])

  const getRoomPrice = (price) => Number(price) || 0

  const matchesPriceRange = (room) => {
    const price = getRoomPrice(room.price)

    if (priceRange === "below-30000") return price < 30000
    if (priceRange === "30001-60000") return price >= 30001 && price <= 60000
    if (priceRange === "above-60001") return price > 60000

    return true
  }

  const filteredRooms = rooms
    .filter(matchesPriceRange)
    .sort((a, b) => {
      const firstPrice = getRoomPrice(a.price)
      const secondPrice = getRoomPrice(b.price)

      return priceOrder === "high-low"
        ? secondPrice - firstPrice
        : firstPrice - secondPrice
    })

  // PAGINATION MATH
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className='row container-fluid p-4'>
      <div className="col-12">
        <h2 className="mb-4 fw-bold">Available Rooms</h2>
      </div>

      <div className="col-12 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Price Range</label>
            <select
              className="form-select"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="all">All prices</option>
              <option value="below-30000">Below Ksh 30,000</option>
              <option value="30001-60000">Ksh 30,001 - Ksh 60,000</option>
              <option value="above-60001">Above Ksh 60,001</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Sort Price</label>
            <select
              className="form-select"
              value={priceOrder}
              onChange={(e) => setPriceOrder(e.target.value)}
            >
              <option value="low-high">Low to High</option>
              <option value="high-low">High to Low</option>
            </select>
          </div>
        </div>
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

          {!error && currentRooms.length === 0 && (
            <div className="col-12 alert alert-info">
              No rooms found in this price range.
            </div>
          )}

          {currentRooms.map((room) => {
            const isOccupied = room.status === 'booked'
            
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
                    <span className="badge bg-primary rounded-pill mb-3 w-50">
                      Ksh {room.price}
                    </span>
                    
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
          
          <div className="col-12">
            <Pagination 
              totalItems={filteredRooms.length} 
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