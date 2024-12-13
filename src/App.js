import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [clients, setClients] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', image: null });
  const [newPortfolioItem, setNewPortfolioItem] = useState({ title: '', category: '', type: '', orientation: '', video: '', image: null });
  const API_URL = 'https://api.rounak.co';
  // Fetch clients and portfolio items from the API
  useEffect(() => {
    async function fetchClients() {
      const response = await axios.get(`${API_URL}/api/portfolio/getclients`); // Replace with your API endpoint
      setClients(response.data);
    }

    async function fetchPortfolioItems() {
      const response = await axios.get(`${API_URL}/api/portfolio/getProjects`); // Replace with your API endpoint
      setPortfolioItems(response.data);
    }

    fetchClients();
    fetchPortfolioItems();
  }, []);

  // Generate unique ID based on client name
  const generateClientId = (name) => {
    return `${name.replace(/\s+/g, '').toLowerCase()}-${uuidv4()}`;
  };

  // Add new client
  const handleAddClient = async () => {
    if (!newClient.name || !newClient.image) {
      alert('Please provide a name and an image for the client.');
      return;
    }

    const clientId = generateClientId(newClient.name);
    const formData = new FormData();
    formData.append('file', newClient.image);
    formData.append('id',clientId);
    formData.append('name',newClient.name);
    try {
      await axios.post(`${API_URL}/api/portfolio/addclient`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newClientData = { id: clientId, name: newClient.name };
      setClients([...clients, newClientData]);
      setNewClient({ name: '', image: null });
      alert('Client added successfully');
    } catch (error) {
      console.error(error);
      alert('Error adding client');
    }
  };

  // Add new portfolio item
  const handleAddPortfolioItem = async () => {
    if (!newPortfolioItem.title || !newPortfolioItem.image) {
      alert('Please provide all fields and an image for the portfolio item.');
      return;
    }

    const portfolioId = uuidv4();
    const formData = new FormData();
    formData.append('title', newPortfolioItem.title);
    formData.append('category', newPortfolioItem.category);
    formData.append('type', newPortfolioItem.type);
    formData.append('orientation', newPortfolioItem.orientation);
    formData.append('video', newPortfolioItem.video);
    formData.append('file', newPortfolioItem.image);

    try {
      await axios.post(`${API_URL}/api/portfolio/addproject`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newPortfolioData = { ...newPortfolioItem, _id: portfolioId };
      setPortfolioItems([...portfolioItems, newPortfolioData]);
      setNewPortfolioItem({ title: '', category: '', type: '', orientation: '', video: '', image: null });
      alert('Portfolio item added successfully');
    } catch (error) {
      console.error(error);
      alert('Error adding portfolio item');
    }
  };

  return (
    <div className="p-8 space-y-12">
      {/* Client Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Clients</h2>
        <div className="space-y-6">
          {clients.map((client) => (
            <div key={client._id} className="p-4 border rounded-lg space-y-2">
              <p><strong>_id:</strong> {client._id}</p>
              <p><strong>Name:</strong> {client.name}</p>
            </div>
          ))}

          {/* Add new client */}
          <div className="p-4 border rounded-lg space-y-2">
            <input
              type="text"
              placeholder="Enter client name"
              className="block w-full border p-2 rounded-lg"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              className="block w-full border p-2 rounded-lg"
              onChange={(e) => setNewClient({ ...newClient, image: e.target.files[0] })}
            />
            <button
              onClick={handleAddClient}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Client
            </button>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Portfolio Items</h2>
        <div className="space-y-6">
          {portfolioItems.map((item) => (
            <div key={item._id} className="p-4 border rounded-lg space-y-2">
              <p><strong>_id:</strong> {item._id}</p>
              <p><strong>Title:</strong> {item.title}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Orientation:</strong> {item.orientation}</p>
              <p><strong>Video:</strong> {item.video}</p>
            </div>
          ))}

          {/* Add new portfolio item */}
          <div className="p-4 border rounded-lg space-y-2">
            <input
              type="text"
              placeholder="Enter title"
              className="block w-full border p-2 rounded-lg"
              value={newPortfolioItem.title}
              onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Enter category"
              className="block w-full border p-2 rounded-lg"
              value={newPortfolioItem.category}
              onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, category: e.target.value })}
            />
            <input
              type="text"
              placeholder="Enter type"
              className="block w-full border p-2 rounded-lg"
              value={newPortfolioItem.type}
              onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, type: e.target.value })}
            />
            <input
              type="text"
              placeholder="Enter orientation"
              className="block w-full border p-2 rounded-lg"
              value={newPortfolioItem.orientation}
              onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, orientation: e.target.value })}
            />
            <input
              type="text"
              placeholder="Enter video URL"
              className="block w-full border p-2 rounded-lg"
              value={newPortfolioItem.video}
              onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, video: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              className="block w-full border p-2 rounded-lg"
              onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, image: e.target.files[0] })}
            />
            <button
              onClick={handleAddPortfolioItem}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Add Portfolio Item
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
