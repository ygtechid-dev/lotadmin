import React, { useState, useEffect } from 'react';
import { ref, onValue, push, update } from 'firebase/database';
import { database } from '../context/firebase';
import 'tailwindcss/tailwind.css';

function ListKajianTable() {
  const [listKajian, setListKajian] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editKey, setEditKey] = useState(null);
  const [newData, setNewData] = useState({ id: '', uri: '' });

  useEffect(() => {
    const listKajianRef = ref(database, 'listkajian');
    onValue(listKajianRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the data object into an array of objects with unique Firebase keys
        const kajianList = Object.keys(data).map((key) => ({
          key: key,
          id: data[key].id,
          uri: data[key].uri
        }));
        setListKajian(kajianList);
      }
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    const newId = listKajian.length > 0 ? listKajian.length : 0;  // Increment based on list length
    const listKajianRef = ref(database, 'listkajian');
    push(listKajianRef, { id: newId, uri: newData.uri })
      .then(() => {
        setNewData({ id: '', uri: '' });
        setIsAdding(false);
      })
      .catch((error) => console.error('Error adding data:', error));
  };

  const handleEdit = (kajian) => {
    setNewData({ id: kajian.id, uri: kajian.uri });
    setEditKey(kajian.key);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    const listKajianRef = ref(database, `listkajian/${editKey}`);
    update(listKajianRef, { id: newData.id, uri: newData.uri })
      .then(() => {
        setNewData({ id: '', uri: '' });
        setIsEditing(false);
      })
      .catch((error) => console.error('Error updating data:', error));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">List Kajian</h2>
      <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">URI</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listKajian.map((kajian) => (
            <tr key={kajian.key} className="border-t">
              <td className="p-2">{kajian.id}</td>
              <td className="p-2">{kajian.uri}</td>
              <td className="p-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded-lg mr-2"
                  onClick={() => handleEdit(kajian)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
        onClick={() => setIsAdding(true)}
      >
        Add New Kajian
      </button>

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEditing ? 'Edit Kajian' : 'Add New Kajian'}
            </h3>
            <input
              type="text"
              name="uri"
              value={newData.uri}
              onChange={handleInputChange}
              placeholder="Enter URI"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={isEditing ? handleUpdate : handleAddNew}
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              onClick={() => {
                setIsAdding(false);
                setIsEditing(false);
                setNewData({ id: '', uri: '' });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListKajianTable;
