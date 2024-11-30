import React, { useEffect, useState } from "react";
import axios from "axios";
import './Dashboard.css';

function Dashboard() {
  const [addresses, setAddresses] = useState([]);
  const [Name, setName] = useState("");
  const [Pno, setPno] = useState("");
  const [email,setEmail]=useState("");
  const [address,setAddress]=useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  function fetchAddresses() {
    axios.get("http://localhost:8080/api/address").then((res) => {
      setAddresses(res.data);
    });
  }
  function addAddress() {
    const addressData = {
      name: Name,
      pno: Pno,
      email: email,
      address: address,
     };

    axios
      .post("http://localhost:8080/api/address", addressData)
      .then((res) => {
        setAddresses([...addresses, res.data]);
        setName("");
        setPno("");
        setEmail("");
        setAddress("");
      });
  }
  return (
    <div>
        <div className="form-container">
    <h1>Enter Contact Information</h1>
    <form>
      <div className="form-row">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Enter name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="number"
                placeholder="Enter phone"
                value={Pno}
                onChange={(e) => setPno(e.target.value)}
              />
            </div>
          </div>

    <div className="button-group">
      <button type="button" onClick={addAddress}>
        Add Info
      </button>
    </div>
  </form>
</div>

        
        <div  class="container">
            <h1>Contact Information</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone No</th>
                <th>Email</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address.id}>
                <td>{address.id}</td>
                <td>{address.name}</td>
                <td>{address.phoneNumber}</td>
                <td>{address.email}</td>
                <td>{address.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
  );
}
export default Dashboard;
