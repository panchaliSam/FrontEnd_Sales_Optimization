import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale);

const customerSegment = ['New', 'Returning', 'Regular', 'VIP'];
const provinces = [
  'Western', 'Central', 'Southern', 'Northern', 'Eastern',
  'Uva', 'Sabaragamuwa', 'North Western', 'North Central',
];

export const CustomerRecordBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [selectedProvince, setSelectedProvince] = useState(provinces[0]);

  useEffect(() => {
    axios.get('http://localhost:4002/api/customerRecord')
      .then(response => {
        const data = response.data;

        // Filter data by the selected province
        const filteredData = data.filter(customer => customer.location === selectedProvince);

        // Count customers in each segment
        const segmentCounts = customerSegment.map(segment => {
          return filteredData.filter(customer => customer.customerSegment === segment).length;
        });

        // Update the chart data
        setChartData({
          labels: customerSegment,
          datasets: [
            {
              label: `Customer Segments in ${selectedProvince}`,
              data: segmentCounts,
              backgroundColor: 'rgba(153, 102, 255, 0.4)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [selectedProvince]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Customer Segment',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Customers',
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <label htmlFor="province" className="block text-sm font-medium text-gray-700">Province</label>
        <select
          id="province"
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className='block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        >
          {provinces.map(province => (
            <option key={province} value={province}>{province}</option>
          ))}
        </select>
      </div>
      <div className='chart-container'>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
