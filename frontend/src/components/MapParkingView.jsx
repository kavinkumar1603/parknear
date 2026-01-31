import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate, useParams } from 'react-router-dom';

const MapParkingView = () => {
    const { vehicleType } = useParams();
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Mock parking locations with coordinates
    const mockParkingLocations = [
        {
            id: 1,
            name: "City Center Parking",
            address: "123 Main Street, Downtown",
            coordinates: { lat: 11.0168, lng: 76.9558 },
            availableSlots: { car: 15, bike: 30 },
            pricePerHour: { car: 50, bike: 20 }
        },
        {
            id: 2,
            name: "Mall Parking Hub",
            address: "456 Shopping Complex, North Zone",
            coordinates: { lat: 11.0268, lng: 76.9658 },
            availableSlots: { car: 25, bike: 40 },
            pricePerHour: { car: 60, bike: 25 }
        },
        {
            id: 3,
            name: "Airport Parking",
            address: "789 Airport Road, Terminal 2",
            coordinates: { lat: 11.0068, lng: 76.9458 },
            availableSlots: { car: 50, bike: 80 },
            pricePerHour: { car: 100, bike: 40 }
        },
        {
            id: 4,
            name: "Beach Side Parking",
            address: "321 Coastal Avenue, Beach Road",
            coordinates: { lat: 11.0368, lng: 76.9758 },
            availableSlots: { car: 20, bike: 35 },
            pricePerHour: { car: 45, bike: 18 }
        },
        {
            id: 5,
            name: "Stadium Parking Zone",
            address: "654 Sports Complex, Stadium Area",
            coordinates: { lat: 10.9968, lng: 76.9358 },
            availableSlots: { car: 40, bike: 60 },
            pricePerHour: { car: 70, bike: 30 }
        }
    ];

    const mapStyles = {
        height: "100vh",
        width: "100%"
    };

    const defaultCenter = {
        lat: 11.0168,
        lng: 76.9558
    };

    const handleMarkerClick = useCallback((location) => {
        setSelectedLocation(location);
    }, []);

    const handleBookParking = useCallback(() => {
        if (selectedLocation) {
            // Navigate to appropriate booking page based on vehicle type
            if (vehicleType === 'car') {
                navigate('/car-booking', {
                    state: { 
                        location: selectedLocation,
                        vehicleType: 'car'
                    }
                });
            } else if (vehicleType === 'bike') {
                navigate('/bike-booking', {
                    state: { 
                        location: selectedLocation,
                        vehicleType: 'bike'
                    }
                });
            }
        }
    }, [selectedLocation, vehicleType, navigate]);

    return (
        <div className="relative h-screen">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 z-10 bg-white text-black px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors font-semibold"
            >
                ← Back
            </button>

            {/* Vehicle Type Badge */}
            <div className="absolute top-4 right-4 z-10 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg font-bold text-lg">
                {vehicleType?.toUpperCase()} PARKING
            </div>

            {/* Google Map */}
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={12}
                    center={defaultCenter}
                    options={{
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                    }}
                >
                    {/* User Location Marker */}
                    <Marker
                        position={defaultCenter}
                        icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            scaledSize: { width: 40, height: 40 }
                        }}
                        title="Your Location"
                    />

                    {/* Parking Location Markers */}
                    {mockParkingLocations.map((location) => (
                        <Marker
                            key={location.id}
                            position={location.coordinates}
                            onClick={() => handleMarkerClick(location)}
                            icon={{
                                url: vehicleType === 'car' 
                                    ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                    : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                                scaledSize: { width: 40, height: 40 }
                            }}
                            title={location.name}
                        />
                    ))}

                    {/* Info Window for Selected Location */}
                    {selectedLocation && (
                        <InfoWindow
                            position={selectedLocation.coordinates}
                            onCloseClick={() => setSelectedLocation(null)}
                        >
                            <div className="p-3 max-w-xs">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">
                                    {selectedLocation.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    {selectedLocation.address}
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-semibold">Available Slots:</span>
                                        <span className="text-sm font-bold text-green-600">
                                            {selectedLocation.availableSlots[vehicleType]}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-semibold">Price/Hour:</span>
                                        <span className="text-sm font-bold text-blue-600">
                                            ₹{selectedLocation.pricePerHour[vehicleType]}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleBookParking}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Book Now
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
                <h4 className="font-bold text-sm mb-2">Legend:</h4>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs">Your Location</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${vehicleType === 'car' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className="text-xs">Parking Locations</span>
                </div>
            </div>
        </div>
    );
};

export default MapParkingView;
