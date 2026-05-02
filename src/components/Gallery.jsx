import axios from "axios";
import React, { useEffect, useState } from "react";

function GetGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const img_url = "https://victordesigner.alwaysdata.net/static/gallery/";

  // Fetch gallery photos
  const getPhotos = async () => {
    setLoading("Loading gallery photos...");
    try {
      const response = await axios.get("https://victordesigner.alwaysdata.net/api/gallery");
      setPhotos(response.data);
      setLoading("");
    } catch (err) {
      setError(err.message);
      setLoading("");
    }
  };

  useEffect(() => {
    getPhotos();
  }, []);

  return (
    <div className="row container-fluid p-4">
      <h2>Gallery</h2>
      {loading && <p>{loading}</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="row">
        {photos.map((photo) => (
          <div key={photo.id} className="col-md-4 mb-4">
            <div className="card shadow">
              <img
                src={img_url + photo.photo}
                alt={photo.description}
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5>{photo.name}</h5>
                <p>{photo.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetGallery;
