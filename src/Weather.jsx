import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { useTable, usePagination } from "react-table";
import CircleLoader from 'react-spinners/CircleLoader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from "chart.js";
import { BsInfoCircleFill } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

const WeatherTable = ({ startDate, endDate, location }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    if (location.lat && location.lon) {
      const apiUrl =
        startDate && endDate
          ? "https://archive-api.open-meteo.com/v1/archive"
          : "https://api.open-meteo.com/v1/forecast";

      const formatDate = (date) => {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const localDate = date.toLocaleDateString("en-GB", options); 
        return localDate.split("/").reverse().join("-"); 
      };

      const formatDate2 = (dateString) => {
        const date = new Date(dateString);
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayOfWeek = weekdays[date.getDay()];
        const dayOfMonth = date.getDate();
        return `${dayOfWeek} ${dayOfMonth}`;
      };

      const params = {
        latitude: location.lat,
        longitude: location.lon,
        daily:
          "temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,temperature_2m_mean,apparent_temperature_mean",
        ...(startDate && endDate
          ? { start_date: formatDate(startDate), end_date: formatDate(endDate) }
          : {}),
      };

      axios
        .get(apiUrl, { params })
        .then((response) => {
          const dailyData = response.data.daily;
          const formattedData = dailyData.time.map((date, index) => ({
            date: formatDate2(date),
            date2: date,
            maxTemp: dailyData.temperature_2m_max[index],
            minTemp: dailyData.temperature_2m_min[index],
            meanTemperature: dailyData.temperature_2m_mean[index],
            apparentMaxTemp: dailyData.apparent_temperature_max[index],
            apparentMinTemp: dailyData.apparent_temperature_min[index],
            apparentTemperatureMean: dailyData.apparent_temperature_mean[index],
          }));
          setWeatherData(formattedData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          setLoading(false);
        });
    }
  }, [location, startDate, endDate]);

  const chartData = {
    labels: weatherData.map((entry) => {
      return screenWidth < 510 ? entry.date : entry.date2;
    }),
        datasets: [
      {
        label: "Max Temp",
        data: weatherData.map((entry) => entry.maxTemp),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Min Temp",
        data: weatherData.map((entry) => entry.minTemp),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: "Mean Temp",
        data: weatherData.map((entry) => entry.meanTemperature),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "App. Max Temp",
        data: weatherData.map((entry) => entry.apparentMaxTemp),
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: true,
      },
      {
        label: "App. Min Temp",
        data: weatherData.map((entry) => entry.apparentMinTemp),
        borderColor: "rgba(75, 163, 146, 1)",
        backgroundColor: "rgba(75, 163, 146, 0.2)",
        fill: true,
      },
      {
        label: "App. Mean Temp",
        data: weatherData.map((entry) => entry.apparentTemperatureMean),
        borderColor: "rgba(285, 136, 235, 1)",
        backgroundColor: "rgba(255, 159, 223, 0.2)",
        fill: true,
      },
    ],
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: (row) => (screenWidth < 770 ? row.date : row.date2),
      },      
      {
        Header: "Max",
        accessor: "maxTemp",
        tooltipContent: "Maximum Temperature (°C)",
      },
      {
        Header: "Min",
        accessor: "minTemp",
        tooltipContent: "Minimum Temperature (°C)",
      },
      {
        Header: "Mean",
        accessor: "meanTemperature",
        tooltipContent: "Mean Temperature (°C)",
      },
      {
        Header: "Max",
        accessor: "apparentMaxTemp",
        tooltipContent: "Apparent Maximum Temperature (°C)",
      },
      {
        Header: "Min ",
        accessor: "apparentMinTemp",
        tooltipContent: "Apparent Minimum Temperature (°C)",
      },
      {
        Header: "Mean",
        accessor: "apparentTemperatureMean",
        tooltipContent: "Apparent Mean Temperature (°C)",
      },
    ],
    [screenWidth]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: weatherData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );


  return (
    <>
    {loading ? (
        <div className='container mx-auto p-3 h-screen flex justify-center items-center align-middle'>
            <CircleLoader color="#00bfff" size={250} />
        </div>) :
    <div>
      <div>
        <div className="flex justify-end">
          <FaCircle className="text-blue-200 my-1" />
          <div className="mx-2">Apparent</div>
        </div>
      </div>
      <div className="mb-8">
        <table
          {...getTableProps()}
          className="table-auto w-full border-collapse border border-gray-200"
          style={{ tableLayout: "fixed" }} 
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    className={`px-3 py-2 border-b text-left text-sm ${
                      index === 4 || index === 5 || index === 6
                        ? "bg-blue-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center relative flex-wrap text-teal-800">
                      {column.render("Header")}
                      {column.tooltipContent && (
                        <div
                          className="my-anchor-element ml-1 relative text-wrap  text-teal-500 "
                          onMouseEnter={() => setHoveredColumn(index)}
                          onMouseLeave={() => setHoveredColumn(null)}
                          onClick={(e) => e.preventDefault()}
                        >
                          <BsInfoCircleFill />
                          {hoveredColumn === index && (
                            <div
                              className="absolute top-6 left-0 bg-gray-700 text-white text-sm px-2 py-1 rounded shadow-md "
                              style={{ zIndex: 50 }}
                            >
                              {column.tooltipContent}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-4 py-2 border-b text-left text-sm text-blue-950"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between mt-4">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="ml-2"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}{" "}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: { display: true },
              },
              aspectRatio: 5,
            }}
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
    }
    </>
  );
};

export default WeatherTable;
