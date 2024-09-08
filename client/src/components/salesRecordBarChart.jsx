import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Register components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const productCategories = [
  'Clothing',
  'Footwear',
  'Accessories'
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const SalesRecordBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);

  useEffect(() => {
    axios.get('http://localhost:4002/api/salesRecord')
      .then(response => {
        const data = response.data; // Adjust this depending on the API response format

        // Filter and aggregate sales by product category
        const filteredData = data.filter(item =>
          item.year === selectedYear &&
          item.month === selectedMonth
        );

        const categorySales = productCategories.map(category => {
          const categoryData = filteredData.filter(item => item.productCategory === category);
          return categoryData.reduce((total, item) => total + item.salesQuantity, 0);
        });

        setChartData({
          labels: productCategories,
          datasets: [
            {
              label: `Sales in ${selectedMonth} ${selectedYear}`,
              data: categorySales,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, [selectedYear, selectedMonth]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Product Category'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales Quantity'
        }
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      {/* <div className="text-2xl italic font-semibold tracking-wide">
        S A L E S&nbsp;&nbsp;R E C O R D S
      </div> */}
      <div className="mb-4">
        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};