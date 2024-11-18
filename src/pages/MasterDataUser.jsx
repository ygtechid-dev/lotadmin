import React, { useState, useEffect } from 'react';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { database } from '../context/firebase';
import 'tailwindcss/tailwind.css';

function MasterDataUser() {
  const [vouchers, setVouchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    voucherCode: '',
    status: 'available'
  });
  const [editVoucher, setEditVoucher] = useState(null);

  useEffect(() => {
    const vouchersRef = ref(database, 'dataVoucher');
    onValue(vouchersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const voucherList = Object.keys(data).map((key) => ({
          id: key,
          voucherCode: data[key].voucherCode || '',
          status: data[key].status || 'available'
        }));
        setVouchers(voucherList);
      }
    });
  }, []);

  const generateUniqueVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    do {
      code = '';
      for (let i = 0; i < 10; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (vouchers.some((voucher) => voucher.voucherCode === code));

    return code;
  };

  const handleAddVoucher = () => {
    const vouchersRef = ref(database, 'dataVoucher');
    push(vouchersRef, newVoucher)
      .then(() => {
        console.log("Voucher added successfully");
        setIsAdding(false);
        setNewVoucher({ voucherCode: '', status: 'available' });
      })
      .catch((error) => {
        console.error('Error adding voucher:', error);
      });
  };

  const handleDeleteVoucher = (id) => {
    const voucherRef = ref(database, `dataVoucher/${id}`);
    remove(voucherRef)
      .then(() => {
        console.log("Voucher deleted successfully");
      })
      .catch((error) => {
        console.error('Error deleting voucher:', error);
      });
  };

  const handleEditVoucher = () => {
    const voucherRef = ref(database, `dataVoucher/${editVoucher.id}`);
    update(voucherRef, {
      voucherCode: editVoucher.voucherCode,
      status: editVoucher.status
    })
      .then(() => {
        console.log("Voucher updated successfully");
        setIsEditing(false);
        setEditVoucher(null);
      })
      .catch((error) => {
        console.error('Error updating voucher:', error);
      });
  };

  const handleEditVoucherChange = (e) => {
    const { name, value } = e.target;
    setEditVoucher({ ...editVoucher, [name]: value });
  };

  const handleNewVoucherChange = (e) => {
    const { name, value } = e.target;
    setNewVoucher({ ...newVoucher, [name]: value });
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voucher List</h1>

      <input
        type="text"
        placeholder="Search vouchers"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => {
          const generatedCode = generateUniqueVoucherCode();
          setNewVoucher({ voucherCode: generatedCode, status: 'available' });
          console.log("Generated Unique Voucher Code:", generatedCode);
          setIsAdding(true);
        }}
      >
        Add New Voucher
      </button>

      {/* Voucher Data Table */}
      <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="p-2 text-left">Voucher Code</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVouchers.length > 0 ? (
            filteredVouchers.map((voucher) => (
              <tr key={voucher.id} className="border-t">
                <td className="p-2">{voucher.voucherCode}</td>
                <td className="p-2">{voucher.status}</td>
                <td className="p-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2 hover:bg-yellow-600"
                    onClick={() => {
                      setEditVoucher(voucher);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                    onClick={() => handleDeleteVoucher(voucher.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-2">No vouchers found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Adding a New Voucher */}
      {isAdding && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          zIndex: '1000',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Voucher</h3>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Voucher Code</label>
            <input
              type="text"
              name="voucherCode"
              value={newVoucher.voucherCode}
              readOnly
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={newVoucher.status}
              onChange={handleNewVoucherChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            >
              <option value="available">Available</option>
              <option value="used">Used</option>
            </select>
          </div>
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={handleAddVoucher}
            >
              Add Voucher
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal for Editing a Voucher */}
      {isEditing && editVoucher && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          zIndex: '1000',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Voucher</h3>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Voucher Code</label>
            <input
              type="text"
              name="voucherCode"
              value={editVoucher.voucherCode}
              onChange={handleEditVoucherChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={editVoucher.status}
              onChange={handleEditVoucherChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            >
              <option value="available">Available</option>
              <option value="used">Used</option>
            </select>
          </div>
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={handleEditVoucher}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MasterDataUser;
