import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const PhotoGallery = ({ images = [] }) => {
  return (
    <div className="p-4">
      <PhotoProvider>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <PhotoView key={index} src={image}>
              <div className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                <img
                  src={image}
                  alt={``}
                  className="w-full h-full object-cover"
                />
              </div>
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>
    </div>
  );
};

export default PhotoGallery;
