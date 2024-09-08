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
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

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
    year: '',
    month: '',
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
      year: record.year,
      month: record.month,
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

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
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
      setFormData({
        year: '',
        month: '',
        salesQuantity: '',
        productCategory: '',
        productBrand: '',
        customerLocation: ''
      });
    }
  };

  const handleSubmitAdd = async () => {
    try {
      await axios.post('http://localhost:4002/api/salesRecord', formData);
      setSalesRecords([...salesRecords, formData]);
      alert('Sales record added successfully');
    } catch (error) {
      console.error('Error adding sales record:', error);
      alert('Failed to add sales record.');
    } finally {
      setAddDialogOpen(false);
      setFormData({
        year: '',
        month: '',
        salesQuantity: '',
        productCategory: '',
        productBrand: '',
        customerLocation: ''
      });
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <Card>
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
              <th className="p-3 border-b">Year</th>
              <th className="p-3 border-b">Month</th>
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
                  <td className="p-3 border-b">{record.year}</td>
                  <td className="p-3 border-b">{record.month}</td>
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
                <td colSpan="7" className="p-3 text-center">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t p-4">
        {/* <Typography variant="small" color="blue-gray" className="font-normal">
          Total Records: {salesRecords.length}
        </Typography> */}
        <Button onClick={() => setAddDialogOpen(true)} variant="gradient">
          Add Sales Record
        </Button>
      </CardFooter>

      {/* Add Sales Record Dialog */}
      <Dialog open={addDialogOpen} handler={() => setAddDialogOpen(false)}>
        <DialogHeader>Add Sales Record</DialogHeader>
        <DialogBody divider>
          <div className="grid gap-4">
            <Select
              label="Year"
              value={formData.year}
              onChange={(value) => handleSelectChange('year', value)}
            >
              {years.map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>
            <Select
              label="Month"
              value={formData.month}
              onChange={(value) => handleSelectChange('month', value)}
            >
              {months.map(month => (
                <Option key={month} value={month}>{month}</Option>
              ))}
            </Select>
            <Input
              type="number"
              name="salesQuantity"
              label="Sales Quantity"
              value={formData.salesQuantity}
              onChange={handleChange}
            />
            <Select
              label="Product Category"
              value={formData.productCategory}
              onChange={(value) => handleSelectChange('productCategory', value)}
            >
              {productCategories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
            <Select
              label="Product Brand"
              value={formData.productBrand}
              onChange={(value) => handleSelectChange('productBrand', value)}
            >
              {productBrands.map(brand => (
                <Option key={brand} value={brand}>{brand}</Option>
              ))}
            </Select>
            <Select
              label="Customer Location"
              value={formData.customerLocation}
              onChange={(value) => handleSelectChange('customerLocation', value)}
            >
              {sriLankanProvinces.map(province => (
                <Option key={province} value={province}>{province}</Option>
              ))}
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setAddDialogOpen(false)}
          >
            <Typography variant="small" color="red" className="font-normal">
              Cancel
            </Typography>
          </Button>
          <Button
            variant="gradient"
            onClick={handleSubmitAdd}
          >
            <Typography variant="small" color="white" className="font-normal">
              Add Record
            </Typography>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Sales Record Dialog */}
      <Dialog open={editDialogOpen} handler={() => setEditDialogOpen(false)}>
        <DialogHeader>Edit Sales Record</DialogHeader>
        <DialogBody divider>
          <div className="grid gap-4">
            <Select
              label="Year"
              value={formData.year}
              onChange={(value) => handleSelectChange('year', value)}
            >
              {years.map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>
            <Select
              label="Month"
              value={formData.month}
              onChange={(value) => handleSelectChange('month', value)}
            >
              {months.map(month => (
                <Option key={month} value={month}>{month}</Option>
              ))}
            </Select>
            <Input
              type="number"
              name="salesQuantity"
              label="Sales Quantity"
              value={formData.salesQuantity}
              onChange={handleChange}
            />
            <Select
              label="Product Category"
              value={formData.productCategory}
              onChange={(value) => handleSelectChange('productCategory', value)}
            >
              {productCategories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
            <Select
              label="Product Brand"
              value={formData.productBrand}
              onChange={(value) => handleSelectChange('productBrand', value)}
            >
              {productBrands.map(brand => (
                <Option key={brand} value={brand}>{brand}</Option>
              ))}
            </Select>
            <Select
              label="Customer Location"
              value={formData.customerLocation}
              onChange={(value) => handleSelectChange('customerLocation', value)}
            >
              {sriLankanProvinces.map(province => (
                <Option key={province} value={province}>{province}</Option>
              ))}
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setEditDialogOpen(false)}
          >
            <Typography variant="small" color="red" className="font-normal">
              Cancel
            </Typography>
          </Button>
          <Button
            variant="gradient"
            onClick={handleSubmitEdit}
          >
            <Typography variant="small" color="white" className="font-normal">
              Save Changes
            </Typography>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Sales Record Dialog */}
      <Dialog open={deleteDialogOpen} handler={() => setDeleteDialogOpen(false)}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody divider>
          <Typography variant="small" color="red" className="font-normal">
            Are you sure you want to delete this record?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setDeleteDialogOpen(false)}
          >
            <Typography variant="small" color="red" className="font-normal">
              Cancel
            </Typography>
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={confirmDelete}
          >
            <Typography variant="small" color="white" className="font-normal">
              Confirm
            </Typography>
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}
