import React, { useState, useRef } from 'react';

const Header = ({ panTo, currentPosition}) => {
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef();


// Fonction pour calculer la distance entre deux points en kilomètres
const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en km
  };


  const handleInputChange = () => {
    const input = searchInputRef.current.value;

    if (!input) {
      setSuggestions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();

    // service.getPlacePredictions({ input }, (predictions, status) => {
    //   if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
    //     setSuggestions(predictions);
    //   } else {
    //     setSuggestions([]);
    //   }
    // });

     // Utilisation de l'API AutocompleteService pour récupérer les suggestions
     service.getPlacePredictions({ input }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          fetchPlaceDetails(predictions); // Obtenir les détails des suggestions
        } else {
          setSuggestions([]);
        }
      });
  };



  // Récupère les détails de chaque suggestion, y compris les coordonnées pour calculer la distance
  const fetchPlaceDetails = (predictions) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    const updatedSuggestions = [];

    predictions.forEach((prediction, index) => {
      service.getDetails({ placeId: prediction.place_id }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const location = place.geometry.location;
          const distance = calculateDistance(
            currentPosition.lat,
            currentPosition.lng,
            location.lat(),
            location.lng()
          );

          updatedSuggestions.push({
            ...prediction,
            distance, // Ajoute la distance au lieu
          });

          // Met à jour les suggestions une fois que tous les détails sont récupérés
          if (index === predictions.length - 1) {
            updatedSuggestions.sort((a, b) => a.distance - b.distance); // Trie les suggestions par distance
            setSuggestions(updatedSuggestions);
          }
        }
      });
    });
  };



  const handleSuggestionClick = (placeId,description) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));

    service.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const location = place.geometry.location;
        panTo({ lat: location.lat(), lng: location.lng() }); // Pan the map to the selected place
        setSuggestions([]); // Clear suggestions
        searchInputRef.current.value =  description//place.name; // Set the search bar to the selected place
      }
    });
  };

  return (
    <header style={{ padding: '10px', backgroundColor: '#f8f9fa', position: 'relative' }}>
      <input
        type="text"
        ref={searchInputRef}
        placeholder="Search for a place"
        onChange={handleInputChange}
        
        style={{
          width: '80%',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          color: '#ccc'
        }}
      />
      <ul
        style={{
          position: 'absolute',
          top: '40px',
          left: '10%',
          width: '80%',
          color: '#444',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          listStyle: 'none',
          padding: '5px',
          margin: 0,
          zIndex: 1000,
        }}
      >
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.place_id}
            onClick={() => handleSuggestionClick(suggestion.place_id, suggestion.description)}
            style={{
              padding: '8px',
              cursor: 'pointer',
              borderBottom: '1px solid #eee',
            }}
          >
            {suggestion.description} - {Math.round(suggestion.distance)} km          </li>
        ))}
      </ul>
    </header>
  );
};

export default Header;
