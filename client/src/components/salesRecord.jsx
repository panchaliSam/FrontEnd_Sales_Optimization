import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function SalesRecord() {
  const [salesRecords, setSalesRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch sales records from the API
    const fetchSalesRecords = async () => {
      try {
        const response = await axios.get('http://localhost:4002/api/salesRecord');
        setSalesRecords(response.data);
      } catch (error) {
        console.error('Error fetching sales records:', error);
        setError('Failed to fetch sales records.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesRecords();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Sales Records</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Sales Quantity</th>
              <th className="p-3 border-b">Product Category</th>
              <th className="p-3 border-b">Product Brand</th>
              <th className="p-3 border-b">Customer Location</th>
            </tr>
          </thead>
          <tbody>
            {salesRecords.length > 0 ? (
              salesRecords.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="p-3 border-b">{record.salesQuantity}</td>
                  <td className="p-3 border-b">{record.productCategory}</td>
                  <td className="p-3 border-b">{record.productBrand}</td>
                  <td className="p-3 border-b">{record.customerLocation}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
