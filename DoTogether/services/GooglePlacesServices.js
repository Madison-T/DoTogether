import axios from 'axios';
import Constants from 'expo-constants';

const API_KEY = Constants.manifest.extra.googlePlacesApiKey;

const GooglePlacesService = {
  searchNearbyPlaces: async (latitude, longitude, type) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: 5000,
            type,
            key: API_KEY,
          },
        }
      );
      return response.data.results;
    } catch (error) {
      console.error("Error fetching places: ", error);
      return [];
    }
  }
};

export default GooglePlacesService;
