
import React, { useEffect, useState } from 'react';
import WeatherTable from './Weather';
import DateSelector from './DateSelector';
import 'react-tooltip/dist/react-tooltip.css';
import Geolocation from '@react-native-community/geolocation';
import GeocodeLocation from './getLocation';
import CircleLoader from 'react-spinners/CircleLoader';
import CoordinateInput from './Coordinates';

function App() {
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [location, setLocation] = useState(null); 
  
  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (info) => {
        setLocation({
          lat: info.coords.latitude,
          lon: info.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);


  return (
    <div className='container mx-auto p-3'>
      {location === null ? (
        <div className='container mx-auto p-3 h-screen flex justify-center items-center align-middle'>
            <CircleLoader color="#00bfff" size={250} />
        </div>
      ) : (
        <>
          <GeocodeLocation location={location} />
          <div className="flex flex-col sm:flex-row">
          <DateSelector onDateChange={handleDateChange} />
          <CoordinateInput setLocation={setLocation}/>
          </div>
          <WeatherTable
            startDate={selectedDates[0]}
            endDate={selectedDates[1]}
            location={location}
          />
        </>
      )}
    </div>
  );
}

export default App;
