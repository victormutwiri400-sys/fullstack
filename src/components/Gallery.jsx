import axios from "axios";
import React, { useEffect, useState } from "react";

function GalleryImage({ src, alt }) {
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
      style={{ height: "250px", overflow: "hidden" }}
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
          alt={alt}
          className="card-img-top"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{
            height: "250px",
            objectFit: "cover",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.3s ease"
          }}
        />
      )}
    </div>
  );
}

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
              <GalleryImage
                src={img_url + photo.photo}
                alt={photo.description}
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
