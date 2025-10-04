import React from 'react';

const galleryImg = [
    {src: "../assets/carlo1.jpg", description: "Carlo Acutis as a young boy, already showing deep faith and kindness."},
    {src: "../assets/carlo2.jpg", description: "His joy and positivity inspired many of his peers to follow his example."},
    {src: "../assets/carlo3.jpg", description: ""},
]

const Gallery = () => {
  return (
    <div className='container w-full px-4 py-16'>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImg.map((image, index) => (
          <div key={index} className="grid gap-4">
            <div><img className="h-auto max-w-full rounded-lg" src={image.src} alt={image.description} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gallery;
