import React, { useState, useEffect } from 'react';
import { ref, onValue, push, update } from 'firebase/database';
import { database } from '../context/firebase';
import 'tailwindcss/tailwind.css';

function MasterUser() {
  const [dataUser, setDataUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Menampilkan 20 item per halaman
  const [isAdding, setIsAdding] = useState(false);
  const [newUserData, setNewUserData] = useState({
    nama_user: '',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editUserData, setEditUserData] = useState(null);

  useEffect(() => {
    const userRef = ref(database, 'dataUser');
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          nama_user: data[key].nama_user,
          password: data[key].password,
        }));
        setDataUser(list);
      }
    });
  }, []);

  // Pencarian dan Reset Pagination
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset ke halaman 1 setiap kali pencarian berubah
  };

  // Pagination: ambil data untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter data berdasarkan searchTerm
  const filteredData = dataUser.filter((user) =>
    String(user.nama_user).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (indexOfLastItem < filteredData.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Tambah data pengguna
  const handleAddUser = () => {
    const userRef = ref(database, 'dataUser');
    push(userRef, newUserData)
      .then(() => {
        setIsAdding(false);
        setNewUserData({ nama_user: '', password: '' });
      })
      .catch((error) => {
        console.error('Error adding user:', error);
      });
  };

  // Edit data pengguna
  const handleEditUser = (user) => {
    setEditUserData(user);
    setIsEditing(true);
  };

  const handleSaveEditUser = () => {
    const userRef = ref(database, `dataUser/${editUserData.id}`);
    update(userRef, {
      nama_user: editUserData.nama_user,
      password: editUserData.password,
    })
      .then(() => {
        setIsEditing(false);
        setEditUserData(null);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  const handleEditUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({ ...editUserData, [name]: value });
  };

  const handleNewUserDataChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Pengguna</h1>

      {/* Pencarian */}
      <input
        type="text"
        placeholder="Cari berdasarkan nama pengguna"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />

      {/* Tabel Data Pengguna */}
      <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="p-2 text-left">Nama Pengguna</th>
            <th className="p-2 text-left">Password</th>
            <th className="p-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            currentItems.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.nama_user}</td>
                <td className="p-2">{user.password}</td>
                <td className="p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-2">Tidak ada data ditemukan</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          onClick={handleNextPage}
          disabled={indexOfLastItem >= filteredData.length}
        >
          Next
        </button>
      </div>

      {/* Modal Tambah Data Pengguna */}
      <div className="mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsAdding(true)}
        >
          Tambah Data Pengguna
        </button>
        {isAdding && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Tambah Data Pengguna</h3>
              <div className="mt-2 space-y-4">
                <div>
                  <label className="block font-medium">Nama Pengguna</label>
                  <input
                    type="text"
                    name="nama_user"
                    value={newUserData.nama_user}
                    onChange={handleNewUserDataChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium">Password</label>
                  <input
                    type="text"
                    name="password"
                    value={newUserData.password}
                    onChange={handleNewUserDataChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleAddUser}
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Edit Data Pengguna */}
      {isEditing && editUserData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Data Pengguna</h3>
            <div className="mt-2 space-y-4">
              <div>
                <label className="block font-medium">Nama Pengguna</label>
                <input
                  type="text"
                  name="nama_user"
                  value={editUserData.nama_user}
                  onChange={handleEditUserDataChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium">Password</label>
                <input
                  type="text"
                  name="password"
                  value={editUserData.password}
                  onChange={handleEditUserDataChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSaveEditUser}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MasterUser;
