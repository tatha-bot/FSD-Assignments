import React, { useState } from 'react';
import './App.css';

// Gallery dataset with exactly three images
const galleryImages = [
  {
    id: 1,
    title: "Mountain Alpine Lake",
    category: "Landscape & Nature",
    description: "Serene glacial lake reflecting snow-capped peaks in the early morning sunrise.",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    alt: "Scenic mountain lake"
  },
  {
    id: 2,
    title: "Dense Evergreen Rainforest",
    category: "Forest & Wilderness",
    description: "Lush misty canopy in the temperate Pacific Northwest rainforest showing rich biodiversity.",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    alt: "Misty forest path"
  },
  {
    id: 3,
    title: "Golden Desert Dunes",
    category: "Arid & Desert",
    description: "Wind-sculpted sand dunes glowing under warm golden hour sunlight in the desert.",
    src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    alt: "Desert sand dunes"
  }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigate to previous image
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  // Navigate to next image
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const currentImage = galleryImages[currentIndex];

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <h2>React Image Gallery</h2>
        <p className="subtitle">Interactive 3-Image Showcase Component</p>
      </header>

      {/* Main Featured View */}
      <div className="main-display-card">
        <div className="image-viewport">
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="featured-image"
          />
          <button className="nav-btn prev-btn" onClick={handlePrev} aria-label="Previous Image">
            &#10094;
          </button>
          <button className="nav-btn next-btn" onClick={handleNext} aria-label="Next Image">
            &#10095;
          </button>
          <div className="counter-pill">
            Image {currentIndex + 1} of {galleryImages.length}
          </div>
        </div>

        {/* Caption & Metadata */}
        <div className="image-info">
          <span className="category-tag">{currentImage.category}</span>
          <h3 className="image-title">{currentImage.title}</h3>
          <p className="image-description">{currentImage.description}</p>
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="thumbnails-wrapper">
        <h4>Select an Image:</h4>
        <div className="thumbnails-grid">
          {galleryImages.map((img, index) => (
            <div
              key={img.id}
              className={`thumbnail-card ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              <img src={img.src} alt={img.alt} />
              <div className="thumbnail-caption">
                <span className="thumb-num">0{index + 1}</span>
                <span className="thumb-title">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
