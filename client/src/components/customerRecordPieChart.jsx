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

const ageRanges = [
  '18-25', '26-35', '36-45', '46-60', '60+'
];

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

export const CustomerRecordPieChart = () => {
  const [agePieData, setAgePieData] = useState({
    labels: [],
    datasets: [],
  });
  const [categoryPieData, setCategoryPieData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedCategory, setSelectedCategory] = useState(productCategories[0]);

  useEffect(() => {
    axios.get('http://localhost:4002/api/customerRecord')
      .then(response => {
        const data = response.data;

        // Process data for product category pie chart
        const categoryCounts = productCategories.reduce((acc, category) => {
          acc[category] = 0;
          return acc;
        }, {});

        data.forEach(customer => {
          const category = customer.productCategory;
          categoryCounts[category]++;
        });

        setCategoryPieData({
          labels: Object.keys(categoryCounts),
          datasets: [
            {
              label: 'Product Category Distribution',
              data: Object.values(categoryCounts),
              backgroundColor: colors.slice(0, Object.keys(categoryCounts).length), // Slice colors to match the number of categories
              hoverBackgroundColor: colors.slice(0, Object.keys(categoryCounts).length),
            },
          ],
        });

        // Process data for age range pie chart based on selected category
        const ageRangeCounts = ageRanges.reduce((acc, range) => {
          acc[range] = 0;
          return acc;
        }, {});

        const filteredData = data.filter(customer => customer.productCategory === selectedCategory);

        filteredData.forEach(customer => {
          const age = customer.age;
          if (age >= 18 && age <= 25) {
            ageRangeCounts['18-25']++;
          } else if (age >= 26 && age <= 35) {
            ageRangeCounts['26-35']++;
          } else if (age >= 36 && age <= 45) {
            ageRangeCounts['36-45']++;
          } else if (age >= 46 && age <= 60) {
            ageRangeCounts['46-60']++;
          } else if (age > 60) {
            ageRangeCounts['60+']++;
          }
        });

        setAgePieData({
          labels: Object.keys(ageRangeCounts),
          datasets: [
            {
              label: 'Age Range Distribution for ' + selectedCategory,
              data: Object.values(ageRangeCounts),
              backgroundColor: colors.slice(0, Object.keys(ageRangeCounts).length), // Slice colors to match the number of age ranges
              hoverBackgroundColor: colors.slice(0, Object.keys(ageRangeCounts).length),
            },
          ],
        });
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, [selectedCategory]);

  const pieOptions = {
    plugins: {
      legend: {
        display: false, // Hide the default legend
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Product Category Pie Chart */}
        <div className="flex-1 lg:w-1/2 mb-6 lg:mb-0">
          <h3 className="text-lg font-semibold mb-4">Product Category Distribution</h3>
          <div className="relative">
            <Pie data={categoryPieData} options={pieOptions} />
          </div>
        </div>

        {/* Legend for Product Categories */}
        <div className="lg:w-1/2 mb-6 lg:mb-0 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Categories Legend</h3>
          <div className="flex flex-col space-y-2">
            {productCategories.map((category, index) => (
              <div key={category} className="flex items-center">
                <div
                  className="w-5 h-5 mr-2 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="text-sm">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8">
        {/* Age Range Pie Chart Section */}
        <div className="flex-1 lg:w-1/2">
          <h3 className="text-lg font-semibold mb-4">Age Range Distribution for {selectedCategory}</h3>
          <div className="relative">
            <Pie data={agePieData} options={pieOptions} />
          </div>
          <div className="mt-4">
            <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700">Select Product Category</label>
            <select
              id="productCategory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {productCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend for Age Ranges */}
        <div className="lg:w-1/2 mt-6 lg:mt-0">
          <h3 className="text-lg font-semibold mb-4">Age Ranges Legend</h3>
          <div className="flex flex-col space-y-2">
            {ageRanges.map((range, index) => (
              <div key={range} className="flex items-center">
                <div
                  className="w-5 h-5 mr-2 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="text-sm">{range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
