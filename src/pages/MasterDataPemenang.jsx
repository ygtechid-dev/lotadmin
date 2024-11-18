import React, { useState, useEffect } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { database } from '../context/firebase';
import 'tailwindcss/tailwind.css';

function MasterDataPemenang() {
  const [winners, setWinners] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editWinner, setEditWinner] = useState(null);

  // Fetch winners data from Firebase
  useEffect(() => {
    const winnersRef = ref(database, 'DataPemenang');
    const unsubscribe = onValue(winnersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const winnersList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setWinners(winnersList);
      }
    });

    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, []);

  const handleDeleteWinner = (id) => {
    const winnerRef = ref(database, `DataPemenang/${id}`);
    remove(winnerRef)
      .then(() => {
        console.log('Winner deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting winner:', error);
      });
  };

  const handleEditWinner = () => {
    const winnerRef = ref(database, `DataPemenang/${editWinner.id}`);
    update(winnerRef, {
      date: editWinner.date,
      phonenumber: editWinner.phonenumber,
      selecteddigit: editWinner.selecteddigit,
      selectednumber: editWinner.selectednumber,
      voucherCode: editWinner.voucherCode,
    })
      .then(() => {
        console.log('Winner updated successfully');
        setIsEditing(false);
        setEditWinner(null);
      })
      .catch((error) => {
        console.error('Error updating winner:', error);
      });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditWinner({ ...editWinner, [name]: value });
  };

  return (
    <div className="container mx-auto p-4 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Winners List</h2>

      {/* Winners Data Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Phone Number</th>
            <th className="p-3 text-left">Selected Digit</th>
            <th className="p-3 text-left">Selected Number</th>
            <th className="p-3 text-left">Voucher Code</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {winners.length > 0 ? (
            winners.map((winner) => (
              <tr key={winner.id} className="border-b">
                <td className="p-3">{winner.date}</td>
                <td className="p-3">{winner.phonenumber}</td>
                <td className="p-3">{winner.selecteddigit}</td>
                <td className="p-3">{winner.selectednumber}</td>
                <td className="p-3">{winner.voucherCode}</td>
                <td className="p-3">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded-lg mr-2 hover:bg-yellow-600"
                    onClick={() => {
                      setEditWinner(winner);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                    onClick={() => handleDeleteWinner(winner.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-3">
                No winners found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Editing a Winner */}
      {isEditing && editWinner && (
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
          <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Winner</h3>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="text"
              name="date"
              value={editWinner.date}
              onChange={handleEditChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phonenumber"
              value={editWinner.phonenumber}
              onChange={handleEditChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Selected Digit</label>
            <input
              type="text"
              name="selecteddigit"
              value={editWinner.selecteddigit}
              onChange={handleEditChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Selected Number</label>
            <input
              type="text"
              name="selectednumber"
              value={editWinner.selectednumber}
              onChange={handleEditChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Voucher Code</label>
            <input
              type="text"
              name="voucherCode"
              value={editWinner.voucherCode}
              onChange={handleEditChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={handleEditWinner}
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

export default MasterDataPemenang;
