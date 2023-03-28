import { useState } from 'react';

export const ImagePicker = ({id, title, setImages}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
        // const base64Image = reader.result.split(",")[1];
        setSelectedImage(reader.result);
        setImages(current=>{
            let tmp = current;
            tmp[id] = reader.result;
            return tmp;
        })
    };
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImages(current=>{
        let tmp = current;
        delete tmp[id];
        return tmp;
    })
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      {selectedImage && (
        <button
          className="absolute top-0 right-0 m-2 p-1 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 focus:outline-none"
          onClick={handleImageRemove}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      <label
        htmlFor={id}
        className="w-full h-64 border-dashed border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer"
      >
        {selectedImage ? (
          <img src={selectedImage} alt="Selected" className="h-full w-full object-cover rounded-lg" />
        ) : (
          <span className="text-gray-400 font-medium">{title}</span>
        )}
      </label>
      <input type="file" id={id} className="hidden" onChange={handleImageSelect} accept="image/*" />
    </div>
  );
}
