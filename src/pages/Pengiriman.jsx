import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';

function Pengiriman() {
  const [nomorTujuan, setNomorTujuan] = useState('');
  const [isiPesan, setIsiPesan] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [successAlert, setSuccessAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckConnection = async () => {
    try {
      const response = await axios.get('https://ygtechdev.azurewebsites.net/qr');
      console.log('tess', response.data);
      setModalOpen(true);
      setResponseMessage(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSendMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ygtechdev.azurewebsites.net/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remoteJid: `${nomorTujuan}@s.whatsapp.net`,
          text: isiPesan,
        }),
      });
      if (response.ok) {
        setSuccessAlert(true);
        setIsiPesan('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
        <h1 className="text-xl font-bold mb-4">Text Kirim WhatsApp</h1>

        <div className="mb-4">
          <label htmlFor="nomorTujuan" className="block text-sm font-medium text-gray-700">
            Nomor Tujuan (Awali dengan 62)
          </label>
          <input
            type="text"
            id="nomorTujuan"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={nomorTujuan}
            onChange={(e) => setNomorTujuan(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            onClick={handleCheckConnection}
          >
            Cek Status Koneksi
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="isiPesan" className="block text-sm font-medium text-gray-700">
            Isi Pesan
          </label>
          <textarea
            id="isiPesan"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows="3"
            value={isiPesan}
            onChange={(e) => setIsiPesan(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
            onClick={handleSendMessage}
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </div>

        {modalOpen && (
          <Modal closeModal={() => setModalOpen(false)}>
            <pre>{responseMessage}</pre>
          </Modal>
        )}

        {successAlert && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Pesan berhasil terkirim!</strong>
            <span className="block sm:inline"> Pesan telah dikirim ke {nomorTujuan}.</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccessAlert(false)}>
              <svg
                className="fill-current h-6 w-6 text-green-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path
                  fillRule="evenodd"
                  d="M14.354 5.354a1.0 1.0 0 0 0-1.414 0L10 8.586 6.354 5.354a1.0 1.0 0 1 0-1.414 1.414L8.586 10l-3.232 3.646a1.0 1.0 0 0 0 1.414 1.414L10 11.414l3.646 3.232a1.0 1.0 0 0 0 1.414-1.414L11.414 10l3.232-3.646a1.0 1.0 0 0 0 0-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pengiriman;
