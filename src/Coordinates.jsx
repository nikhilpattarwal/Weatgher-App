

import React, { useState, useEffect } from 'react';

const CoordinateInput = ({ setLocation }) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latTouched, setLatTouched] = useState(false); 
  const [lonTouched, setLonTouched] = useState(false); 
  const [error, setError] = useState('');

  const validateLatitude = (value) => {
    if (value === '') {
      setError('');
      setLatitude(value);
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= -90 && num <= 90) {
      setError('');
      setLatitude(value);
    } else {
      setError('Latitude must be between -90 and 90');
    }
  };

  const validateLongitude = (value) => {
    if (value === '') {
      setError('');
      setLongitude(value);
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= -180 && num <= 180) {
      setError('');
      setLongitude(value);
    } else {
      setError('Longitude must be between -180 and 180');
    }
  };

  useEffect(() => {
    if (latTouched && lonTouched && latitude && longitude && !error) {
      setLocation({
        lat: latitude,
        lon: longitude,
      });
    }
  }, [latTouched, lonTouched, latitude, longitude, error, setLocation]);

  return (
    <div>
      <div className="mt-2 ml-1 sm:mt-0 sm:ml-4 lg:ml-4 lg:mb-2">
        <input
          type="number"
          id="latitude"
          value={latitude}
          onChange={(e) => validateLatitude(e.target.value)}
          onBlur={() => setLatTouched(true)} 
          step="0.000001"
          placeholder="Lat   (-90 to 90)"
          style={{ width: '150px', outline: 'none', border: 'none', boxShadow: 'none' }}
          className="rounded"
        />
      </div>
      <div className="sm:ml-4 mt-2 ml-1">
        <input
          type="number"
          id="longitude"
          value={longitude}
          onChange={(e) => validateLongitude(e.target.value)}
          onBlur={() => setLonTouched(true)} 
          step="0.000001"
          placeholder="Long (-180 to 180)"
          style={{ width: '150px', outline: 'none', border: 'none', boxShadow: 'none' }}
          className="rounded"
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CoordinateInput;
