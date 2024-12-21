import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [clients, setClients] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', image: null });
  const [newPortfolioItem, setNewPortfolioItem] = useState({ title: '', category: '', type: '', orientation: '', video: '', image: null });
  const [loginDetails, setLoginDetails] = useState({ username: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_URL = 'https://api.rounak.co';
  const TOKEN_KEY = 'authToken';

  // Fetch clients and portfolio items from the API
  useEffect(() => {
    if (isAuthenticated) {
      fetchClients();
      fetchPortfolioItems();
    }
  }, [isAuthenticated]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/portfolio/getclientsadmin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      });
      setClients(response.data);
    } catch (error) {
      console.error(error);
      alert('Error fetching clients');
    }
  };

  const fetchPortfolioItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/portfolio/getProjects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      });
      setPortfolioItems(response.data);
    } catch (error) {
      console.error(error);
      alert('Error fetching portfolio items');
    }
  };

  const handleLogin = async () => {
    if (!loginDetails.username || !loginDetails.password) {
      alert('Please provide both username and password.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, loginDetails);
      const { token } = response.data;

      // Store token in localStorage and authenticate user
      localStorage.setItem(TOKEN_KEY, token);
      setIsAuthenticated(true);
      alert('Login successful!');
    } catch (error) {
      console.error(error);
      alert('Invalid login credentials.');
    }
  };

  const handleDeleteClient = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this client?');
    if (!confirmDelete) return; 
    try {
      await axios.delete(`${API_URL}/api/portfolio/deleteclient/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      });
      setClients(clients.filter((client) => client._id !== id));
      alert('Client deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Error deleting client');
    }
  };

  const handleDeletePortfolioItem = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Portfolio Item ?');
    if (!confirmDelete) return; 
    try {
      await axios.delete(`${API_URL}/api/portfolio/deleteproject/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      });
      setPortfolioItems(portfolioItems.filter((item) => item._id !== id));
      alert('Portfolio item deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Error deleting portfolio item');
    }
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.image) {
      alert('Please provide a name and an image for the client.');
      return;
    }

    const clientId = uuidv4();
    const formData = new FormData();
    formData.append('file', newClient.image);
    formData.append('id', clientId);
    formData.append('name', newClient.name);

    try {
      await axios.post(`${API_URL}/api/portfolio/addclient`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      });
      
      setNewClient({ name: '', image: null });
      alert('Client added successfully');
    } catch (error) {
      console.error(error);
      alert('Error adding client');
    }
  };

  const handleAddPortfolioItem = async () => {
   
    if (!newPortfolioItem.title || !newPortfolioItem.image) {
      alert('Please provide all fields and an image for the portfolio item.');
      return;
    }

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
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      });
      setNewPortfolioItem({ title: '', category: '', type: '', orientation: '', video: '', image: null });
      alert('Portfolio item added successfully');
    } catch (error) {
      console.error(error);
      alert('Error adding portfolio item');
    }
  };

  return (
    <div className="p-8 space-y-12">
      {!isAuthenticated ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Login</h2>
          <input
            type="text"
            placeholder="Username"
            className="block w-full border p-2 rounded-lg"
            value={loginDetails.username}
            onChange={(e) => setLoginDetails({ ...loginDetails, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="block w-full border p-2 rounded-lg"
            value={loginDetails.password}
            onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </section>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Clients</h2>
            <div className="space-y-6">
              {clients.map((client) => (
                <div key={client._id} className="p-4 border rounded-lg space-y-2 flex justify-between">
                  <p><strong>Name:</strong> {client.name}</p>
                  <img  className='w-[20vh] h-[20vh] object-cover' src={client.image}/>
                  <button
                    onClick={() => handleDeleteClient(client._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete Client
                  </button>
                </div>
              ))}

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

          <section className="space-y-4">
            <h2 className="text-xl font-bold">Portfolio Items</h2>
            <div className="space-y-6">
              {portfolioItems.map((item) => (
                <div key={item._id} className="p-4 border rounded-lg space-y-2 flex justify-between">
                  <p className='max-w-[20vh]'><strong>Title:</strong> {item.title}</p>
                  <p  className='max-w-[20vh]'><strong>catgory:</strong> {item.category}</p>
                  <p className='max-w-[20vh]'><strong>type:</strong> {item.type}</p>
                  <p className='max-w-[20vh]'><strong>video:</strong> {item.video}</p>
                 <img  className='w-[20vh] h-[20vh] object-cover' src={item.image}/>
                  <button
                    onClick={() => handleDeletePortfolioItem(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete Portfolio Item
                  </button>
                </div>
              ))}

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
          placeholder="Enter video URL"
          className="block w-full border p-2 rounded-lg"
          value={newPortfolioItem.video}
          onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, video: e.target.value })}
        />
        <input
          type="text"
          placeholder="Enter orientation (e.g., Landscape or Portrait)"
          className="block w-full border p-2 rounded-lg"
          value={newPortfolioItem.orientation}
          onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, orientation: e.target.value })}
        />
        <input
          type="text"
          placeholder="Enter type"
          className="block w-full border p-2 rounded-lg"
          value={newPortfolioItem.type}
          onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, type: e.target.value })}
        />
         <input
          type="file"
          accept="image/*"
          className="block w-full border p-2 rounded-lg"
          onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, image: e.target.files[0] })}
        />
        <button
          onClick={handleAddPortfolioItem}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
        Add Portfolio Item
        </button>
            </div>

            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
