// import React from 'react';
// import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

// const libraries = ['places'];
// const mapContainerStyle = {
//   width: '100vw',
//   height: '100vh',
// };
// const center = {
//   lat:  -18.7167, // default latitude
//   lng: 46.854328, // default longitude
// };

// const getCurrentLocation = (setCenter) => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setCenter({ lat: latitude, lng: longitude });
//       },
//       () => {
//         console.error('Error fetching location');
//       }
//     );
//   } else {
//     console.error('Geolocation is not supported by this browser');
//   }
// };

// const App = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: 'AIzaSyCQxAPGYj4cNdmXnM3q-UJ-sdhyWtJpj1E',
//     libraries,
//   });

//   if (loadError) {
//     return <div>Error loading maps</div>;
//   }


//   if (!isLoaded) {
//     return <div>Loading maps</div>;
//   }

//   return (
//     <div>
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={10}
//         center={center}
//       >
//         <Marker position={center} />
//       </GoogleMap>
//     </div>
//   );
// };

// export default App;



import React from 'react';
import { GoogleMap, useLoadScript, Marker , Circle} from '@react-google-maps/api';
import Header from './components/Header';

const libraries = ['places'];

const headerStyle = {
  width: '90vw',
  height: '10vh',
};

const mapContainerStyle = {
  width: '90vw',
  height: '70vh',
};

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCQxAPGYj4cNdmXnM3q-UJ-sdhyWtJpj1E',
    libraries,
  });

  const [center, setCenter] = React.useState({
    lat: -18.7167, // default latitude
    lng: 46.854328, // default longitude
  });

  const [currentPosition, setCurrentPosition] = React.useState(null);

  // Function to get the current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("aiza : ",position.coords)
          const newCenter = { lat: latitude, lng: longitude };
          setCenter(newCenter);
          console.log("eto: ",newCenter);
          setCurrentPosition(newCenter); // Update the current position for marker
        },
        () => {
          console.error('Error fetching location');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  };

  // Use effect to fetch current location on component mount
  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  // Function to pan the map to a specific location
  const panTo = (location) => {
    setCenter(location);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const circleOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 3000, // Radius in meters
    center: center,
  };

  return (
    <div>
      <Header headerStyle={headerStyle} currentPosition={currentPosition} panTo={panTo} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={center}
      >
        {/* Marker for current position */}
        {currentPosition && <Marker position={currentPosition} />}
        <Circle options={circleOptions} />
      </GoogleMap>
    </div>
  );
};

export default App;
