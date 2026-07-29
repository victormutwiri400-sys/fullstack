import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "./Pagination";

function DiningImage({ src, alt }) {
  const [imageRef, setImageRef] = useState(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!imageRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(imageRef);

    return () => observer.disconnect();
  }, [imageRef]);

  return (
    <div
      ref={setImageRef}
      className="position-relative bg-light"
      style={{ height: "150px", overflow: "hidden" }}
    >
      {(!imageLoaded || imageError) && (
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          {!imageError ? (
            <>
              <div className="spinner-border spinner-border-sm text-primary mb-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="text-muted small">Loading image...</div>
            </>
          ) : (
            <div className="text-muted small">Image unavailable</div>
          )}
        </div>
      )}

      {shouldLoad && !imageError && (
        <img
          src={src}
          className="card-img-top"
          style={{
            height: "150px",
            objectFit: "cover",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.3s ease"
          }}
          alt={alt}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}

function GetDining() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // PAGINATION, CATEGORY & SEARCH STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); 
  const itemsPerPage = 8;

  // STABLE CACHE BUSTER TIMESTAMP
  const [cacheVersion, setCacheVersion] = useState(Date.now());

  const bookedRoom = location.state?.room || location.state?.product || null;
  const img_url = "https://victordesigner.alwaysdata.net/static/images/";

  const getMeals = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://victordesigner.alwaysdata.net/api/dining");
      setProducts(res.data);
      setCacheVersion(Date.now());
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
    if (e) e.preventDefault();

    const auth = JSON.parse(localStorage.getItem("user") || "null");
    
    if (!auth) {
      navigate("/signin");
      return;
    }

    const currentUser = auth.role === 'admin' ? auth.admin : auth.user;
    
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

    if (bookedRoom) {
      navigate("/payment", { 
        state: { 
          room: bookedRoom, 
          meal: mealData 
        } 
      });
    } else {
      navigate("/payment", { 
        state: { meal: mealData } 
      });
    }
  };

  // 1. FILTER BY CATEGORY (Using database column)
  const filteredProducts = products.filter((p) => {
    if (category === "all") return true;
    return p.category && p.category.toLowerCase() === category.toLowerCase();
  });

  // 2. PAGINATION (Get page items)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const pagedItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // 3. SEARCH (Within current page items only)
  const displayedProducts = pagedItems.filter((p) => {
    return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           p.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4">Dining Menu</h2>

      <div className="row mb-4 align-items-center">
        {/* CATEGORY SELECTION */}
        <div className="col-md-6 d-flex gap-2 mb-3 mb-md-0">
          {["all", "breakfast", "lunch", "dinner"].map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${category === cat ? "btn-dark" : "btn-outline-dark"} text-uppercase fw-bold`}
              onClick={() => { setCategory(cat); setCurrentPage(1); setSearchTerm(""); }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="col-md-6">
          <input 
            type="text" 
            value={searchTerm}
            className="form-control shadow-sm" 
            placeholder="Search items on this page..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
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
          {displayedProducts.map((p) => (
            <div key={p.dining_id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <DiningImage
                  src={p.photo ? `${img_url}${p.photo.toLowerCase()}?v=${cacheVersion}` : "https://placehold.co/600x400?text=No+Image"}
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

          <div className="col-12 mt-4">
            <Pagination 
              totalItems={filteredProducts.length} 
              itemsPerPage={itemsPerPage} 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GetDining;