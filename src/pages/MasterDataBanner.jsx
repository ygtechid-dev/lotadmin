import React, { useState, useEffect } from 'react';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { database } from '../context/firebase';
import * as XLSX from 'xlsx';
import 'tailwindcss/tailwind.css';

function MasterDataBanner() {
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [winners, setWinners] = useState([]); // State untuk daftar pemenang
  const [filterDate, setFilterDate] = useState('');
  const [filterDigit, setFilterDigit] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editParticipant, setEditParticipant] = useState(null);

  useEffect(() => {
    const participantsRef = ref(database, 'dataParticipants');
    const unsubscribeParticipants = onValue(participantsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const participantList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setParticipants(participantList);
        setFilteredParticipants(participantList);
      }
    });

    const winnersRef = ref(database, 'DataPemenang');
    const unsubscribeWinners = onValue(winnersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const winnersList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setWinners(winnersList);
      }
    });

    // Cleanup listeners
    return () => {
      unsubscribeParticipants();
      unsubscribeWinners();
    };
  }, []);

  useEffect(() => {
    let filteredData = participants;

    const filteringDate = filterDate
      .split('-')
      .reverse()
      .join('/');
    if (filterDate) {
      filteredData = filteredData.filter(
        (participant) => participant.date === filteringDate
      );
    }

    if (filterDigit) {
      filteredData = filteredData.filter(
        (participant) => participant.selecteddigit === filterDigit
      );
    }

    setFilteredParticipants(filteredData);
  }, [filterDate, filterDigit, participants]);

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleDigitChange = (e) => {
    setFilterDigit(e.target.value);
  };

  const handleSelectWinner = (participant) => {
    const winnersRef = ref(database, 'DataPemenang');
    push(winnersRef, participant)
      .then(() => {
        alert(`Pemenang berhasil disimpan:\nNama: ${participant.phonenumber}\nVoucher Code: ${participant.voucherCode}`);
      })
      .catch((error) => {
        console.error('Error saving winner:', error);
        alert('Terjadi kesalahan saat menyimpan pemenang.');
      });
  };

  const handleDeleteParticipant = (id) => {
    const participantRef = ref(database, `dataParticipants/${id}`);
    remove(participantRef)
      .then(() => {
        console.log('Participant deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting participant:', error);
      });
  };

  const handleEditParticipant = () => {
    const participantRef = ref(database, `dataParticipants/${editParticipant.id}`);
    update(participantRef, {
      phonenumber: editParticipant.phonenumber,
      selecteddigit: editParticipant.selecteddigit,
      selectednumber: editParticipant.selectednumber,
      voucherCode: editParticipant.voucherCode,
    })
      .then(() => {
        console.log('Participant updated successfully');
        setIsEditing(false);
        setEditParticipant(null);
      })
      .catch((error) => {
        console.error('Error updating participant:', error);
      });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditParticipant({ ...editParticipant, [name]: value });
  };

  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const isWinner = (participant) => {
    return winners.some((winner) => winner.phonenumber === participant.phonenumber);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Participants List</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={handleDateChange}
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Selected Digit</label>
          <select
            value={filterDigit}
            onChange={handleDigitChange}
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
          >
            <option value="">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="mb-4">
        <button
          onClick={() => exportToExcel(filteredParticipants, 'Filtered_Participants')}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-600"
        >
          Download Filtered Data
        </button>
        <button
          onClick={() => exportToExcel(participants, 'All_Participants')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Download All Data
        </button>
      </div>

      {/* Participants Data Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Phone Number</th>
            <th className="p-3 text-left">Selected Digit</th>
            <th className="p-3 text-left">Selected Number</th>
            <th className="p-3 text-left">Voucher Code</th>
            <th className="p-3 text-left">User ID</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant) => (
              <tr key={participant.id} className="border-b">
                <td className="p-3">{participant.date}</td>
                <td className="p-3">{participant.phonenumber}</td>
                <td className="p-3">{participant.selecteddigit}</td>
                <td className="p-3">{participant.selectednumber}</td>
                <td className="p-3">{participant.voucherCode}</td>
                <td className="p-3">{participant.userId}</td>
                <td className="p-3">
                  {isWinner(participant) ? (
                    <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg">Sudah Dipilih</span>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                      onClick={() => handleSelectWinner(participant)}
                    >
                      Pilih Pemenang
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-3">
                No participants found for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Editing a Participant */}
      {isEditing && editParticipant && (
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
          <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Participant</h3>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phonenumber"
              value={editParticipant.phonenumber}
              onChange={handleEditChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Selected Digit</label>
            <input
              type="text"
              name="selecteddigit"
              value={editParticipant.selecteddigit}
              onChange={handleEditChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Selected Number</label>
            <input
              type="text"
              name="selectednumber"
              value={editParticipant.selectednumber}
              onChange={handleEditChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Voucher Code</label>
            <input
              type="text"
              name="voucherCode"
              value={editParticipant.voucherCode}
              onChange={handleEditChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={handleEditParticipant}
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

export default MasterDataBanner;
