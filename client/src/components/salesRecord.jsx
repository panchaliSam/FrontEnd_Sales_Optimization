/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  CardFooter,
  Tooltip,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const productBrands = ['BrandA', 'BrandB', 'BrandC', 'BrandD', 'BrandE'];
const sriLankanProvinces = [
  'Western', 'Central', 'Southern', 'Northern',
  'Eastern', 'North Western', 'North Central',
  'Uva', 'Sabaragamuwa'
];
const productCategories = ['Clothing', 'Footwear', 'Accessories'];

export function SalesRecord() {
  const [salesRecords, setSalesRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    salesQuantity: '',
    productCategory: '',
    productBrand: '',
    customerLocation: ''
  });

  useEffect(() => {
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

  const handleEdit = (record) => {
    setRecordToEdit(record._id);
    setFormData({
      date: record.date,
      salesQuantity: record.salesQuantity,
      productCategory: record.productCategory,
      productBrand: record.productBrand,
      customerLocation: record.customerLocation
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setRecordToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4002/api/salesRecord/${recordToDelete}`);
      setSalesRecords(salesRecords.filter(record => record._id !== recordToDelete));
      alert('Sales record deleted successfully');
    } catch (error) {
      console.error('Error deleting sales record:', error);
      alert('Failed to delete sales record.');
    } finally {
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(`http://localhost:4002/api/salesRecord/${recordToEdit}`, formData);
      setSalesRecords(salesRecords.map(record => (record._id === recordToEdit ? { ...formData, _id: recordToEdit } : record)));
      alert('Sales record updated successfully');
    } catch (error) {
      console.error('Error updating sales record:', error);
      alert('Failed to update sales record.');
    } finally {
      setEditDialogOpen(false);
      setRecordToEdit(null);
    }
  };

  const handleSubmitAdd = async (formData) => {
    try {
      await axios.post('http://localhost:4002/api/salesRecord', formData);
      setSalesRecords([...salesRecords, formData]);
      alert('Sales record added successfully');
    } catch (error) {
      console.error('Error adding sales record:', error);
      alert('Failed to add sales record.');
    } finally {
      setAddDialogOpen(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <Card className="">
      <CardHeader floated={false} shadow={false}>
        <div className="flex items-center justify-between">
          <Typography variant="h5" className="italic">
            S A L E S&nbsp;&nbsp;R E C O R D S
          </Typography>
          <div className="w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-x-auto">
        <table className="mt-4 w-full min-w-max table-auto text-left bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Sales Quantity</th>
              <th className="p-3 border-b">Product Category</th>
              <th className="p-3 border-b">Product Brand</th>
              <th className="p-3 border-b">Customer Location</th>
              <th className="p-3 border-b"></th> {/* Extra column for icons */}
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
                  <td className="p-3 border-b flex gap-2">
                    <Tooltip content="Edit Record">
                      <IconButton
                        variant="text"
                        className="text-blue-500"
                        onClick={() => handleEdit(record)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Delete Record">
                      <IconButton
                        variant="text"
                        className="text-red-500"
                        onClick={() => handleDelete(record._id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          {/* Page 1 of 10 */}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="filled"
            size="sm"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => setAddDialogOpen(true)}
          >
            Add
          </Button>
          <Button variant="filled" size="sm" className="bg-blue-500 hover:bg-blue-600">
            Download CSV
          </Button>
        </div>
      </CardFooter>

      {/* Edit Sales Record Dialog */}
      <Dialog
        open={editDialogOpen}
        handler={() => setEditDialogOpen(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Edit Sales Record</DialogHeader>
        <DialogBody divider>
          <div className="grid grid-cols-1 gap-4">
            <Input
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <Input
              type="number"
              label="Sales Quantity"
              name="salesQuantity"
              value={formData.salesQuantity}
              onChange={handleChange}
            />
            <Select
              label="Product Category"
              name="productCategory"
              value={formData.productCategory}
              onChange={(e) => handleChange({ target: { name: 'productCategory', value: e } })}
            >
              {productCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
            <Select
              label="Product Brand"
              name="productBrand"
              value={formData.productBrand}
              onChange={(e) => handleChange({ target: { name: 'productBrand', value: e } })}
            >
              {productBrands.map((brand) => (
                <Option key={brand} value={brand}>
                  {brand}
                </Option>
              ))}
            </Select>
            <Select
              label="Customer Location"
              name="customerLocation"
              value={formData.customerLocation}
              onChange={(e) => handleChange({ target: { name: 'customerLocation', value: e } })}
            >
              {sriLankanProvinces.map((province) => (
                <Option key={province} value={province}>
                  {province}
                </Option>
              ))}
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmitEdit}
          >
            Save
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Add Sales Record Dialog */}
      <Dialog
        open={addDialogOpen}
        handler={() => setAddDialogOpen(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Add Sales Record</DialogHeader>
        <DialogBody divider>
          <div className="grid grid-cols-1 gap-4">
            <Input
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <Input
              type="number"
              label="Sales Quantity"
              name="salesQuantity"
              value={formData.salesQuantity}
              onChange={handleChange}
            />
            <Select
              label="Product Category"
              name="productCategory"
              value={formData.productCategory}
              onChange={(e) => handleChange({ target: { name: 'productCategory', value: e } })}
            >
              {productCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
            <Select
              label="Product Brand"
              name="productBrand"
              value={formData.productBrand}
              onChange={(e) => handleChange({ target: { name: 'productBrand', value: e } })}
            >
              {productBrands.map((brand) => (
                <Option key={brand} value={brand}>
                  {brand}
                </Option>
              ))}
            </Select>
            <Select
              label="Customer Location"
              name="customerLocation"
              value={formData.customerLocation}
              onChange={(e) => handleChange({ target: { name: 'customerLocation', value: e } })}
            >
              {sriLankanProvinces.map((province) => (
                <Option key={province} value={province}>
                  {province}
                </Option>
              ))}
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => handleSubmitAdd(formData)}
          >
            Save
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        handler={() => setDeleteDialogOpen(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody divider>
          Are you sure you want to delete this sales record?
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={confirmDelete}
          >
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}
