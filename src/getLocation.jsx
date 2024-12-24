import React, { useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css'

const GeocodeLocation = ({ location }) => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 

  useEffect(() => {
    const fetchLocation = async () => {
      const apiKey = process.env.REACT_APP_GOOGLE_MAP_KEY;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lon}&key=${apiKey}`;

      try {
        setLoading(true);
        setCity('');
        setError('');
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
          const addressComponents = data.results[0]?.address_components || [];
          const city = addressComponents.find((component) =>
            component.types.includes('locality')
          )?.long_name;

          if (city) {
            console.log(city)
            setCity(city);
          } else {
            setError('City not found!');
          }
        } else {
          setError('City not found!');
        }
      } catch (error) {
        setError('Network error occurred while fetching location.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [location]);

  if (loading) {
    return (
      <div className="text-5xl font-bold tracking-wider drop-shadow-lg mb-5 text-[#b5ecff]">
        Getting Location...
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-5xl font-bold tracking-wider text-red-500 drop-shadow-lg mb-5">
        {error.toUpperCase() }
      </div>
    );
  }

  return (
    <div className="text-5xl font-bold tracking-wider drop-shadow-lg mb-5 text-[#006e92]">
      {city ? city.toUpperCase() : 'Unknown Location'}
    </div>
  );
};

export default GeocodeLocation;



