import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
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

export const SalesRecordPieChart = () => {
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);

  useEffect(() => {
    axios.get('http://localhost:4002/api/salesRecord')
      .then(response => {
        const data = response.data;

        // Filter and aggregate sales by product category
        const filteredData = data.filter(item =>
          item.year === selectedYear &&
          item.month === selectedMonth
        );

        const categorySales = productCategories.map(category => {
          const categoryData = filteredData.filter(item => item.productCategory === category);
          return categoryData.reduce((total, item) => total + item.salesQuantity, 0);
        });

        const totalSales = categorySales.reduce((total, sales) => total + sales, 0);

        // Update Pie Chart data (percentage of each category)
        setPieData({
          labels: productCategories,
          datasets: [
            {
              label: `Percentage of Sales`,
              data: categorySales.map(sales => ((sales / totalSales) * 100).toFixed(2)),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
          ],
        });
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, [selectedYear, selectedMonth]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
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

      {/* Pie Chart Section */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-2">Percentage of Sales by Product Category</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
};
