import React, { useState, useEffect } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../context/firebase'; // Sesuaikan path sesuai dengan lokasi file firebase.js Anda
import { FaEdit, FaTrash } from 'react-icons/fa';

function Table() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bahanList, setBahanList] = useState([]);

  useEffect(() => {
    const bahanRef = ref(database, 'masterbahan');
    onValue(bahanRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key, index) => ({
          id: key,
          nomor: index + 1,
          nama: data[key].nama,
        }));
        setBahanList(list);
      }
    });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    const bahanRef = ref(database, `masterbahan/${id}`);
    remove(bahanRef).catch((error) => console.error('Error deleting data: ', error));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Master Data Bahan Baku / Peralatan</h1>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Cari bahan baku..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Tambah Data
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200">Nomor</th>
                <th className="py-2 px-4 bg-gray-200">Nama Bahan</th>
                <th className="py-2 px-4 bg-gray-200">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bahanList
                .filter((bahan) => bahan.nama.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((bahan) => (
                  <tr key={bahan.id}>
                    <td className="border px-4 py-2">{bahan.nomor}</td>
                    <td className="border px-4 py-2">{bahan.nama}</td>
                    <td className="border px-4 py-2">
                      <button className="mr-2 text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(bahan.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;