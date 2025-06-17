const ImageUploadStep = ({
  images = [],
  onImagesChange,
  entityType = "Agency",
  onBack,
  onContinue,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const primaryImage = images[0];
  const hasImages = images.length > 0;

  const handleAddPhotos = () => {
    setIsModalOpen(true);
  };

  const handleAddMorePhotos = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleContinue = () => {
    if (images.length >= 3 && onContinue) {
      onContinue();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">
          {hasImages
            ? "How does this Look?"
            : `Add some photos of your ${entityType}`}
        </h1>
        {hasImages ? (
          <p className="text-gray-600">Confirm images</p>
        ) : (
          <p className="text-gray-600">
            You'll need at least 3 photos to get started. You can add more or
            make changes later
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg">
        {hasImages ? (
          <div className="space-y-6">
            {/* Primary Image */}
            <div className="relative">
              <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={primaryImage.url}
                  alt="Primary photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                Primary Photo
              </div>
            </div>

            {/* Additional Images Grid */}
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 5).map((image, index) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image.url}
                        alt={`Photo ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:bg-opacity-70">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add More Photos Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleAddMorePhotos}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add More Photos
              </button>
            </div>

            {/* Show more indicator */}
            {images.length > 5 && (
              <div className="text-center text-gray-500 text-sm">
                +{images.length - 5} more photos
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                <Image className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <button
              onClick={handleAddPhotos}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Add Photos
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-8 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={hasImages ? handleContinue : handleAddPhotos}
          className={`px-8 py-3 rounded-lg transition-colors ${
            hasImages && images.length >= 3
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : hasImages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={hasImages && images.length < 3}
        >
          Continue
        </button>
      </div>

      {/* Modal */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        images={images}
        onImagesChange={onImagesChange}
        entityType={entityType}
      />
    </div>
  );
};
