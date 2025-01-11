import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployee = () => {
  const navigate = useNavigate();
  const { index } = useParams(); // Ambil index dari URL

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [division, setDivision] = useState(""); // State untuk dropdown division
  const [divisions, setDivisions] = useState([]); // State untuk menyimpan daftar divisions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Ambil data employee
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/employees/${index}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.status === "success") {
          const employee = result.data;
          setName(employee.name);
          setPhone(employee.phone);
          setPosition(employee.position);
          setDivision(employee.division); // Set nilai division dari data yang diambil
        } else {
          setError("Employee not found!");
        }
      } catch (err) {
        setError("Error fetching employee data");
      } finally {
        setLoading(false);
      }
    };

    if (index) {
      fetchEmployee();
    } else {
      navigate("/");
    }
  }, [index, navigate, token]);

  // Ambil daftar divisions
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/divisions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        setDivisions(result.data.divisions); // Ambil array divisions
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };

    fetchDivisions();
  }, [token]);

  // Fungsi untuk update data
  const handleUpdate = () => {
    // Filter nilai-nilai yang kosong atau null
    const params = new URLSearchParams({
      name,
      phone,
      position,
      division: division || "", // Jika division null atau undefined, kirim kosong
    });

    fetch(`http://localhost:8000/api/employees/${index}?${params.toString()}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          navigate("/"); // Redirect setelah update sukses
        } else {
          setError(result.message || "Failed to update employee data");
        }
      })
      .catch((err) => setError(err.message || "Error updating employee data"));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-black dark:text-white h-screen">
      <h2 className="text-2xl font-semibold mb-4">Edit Employee</h2>
      {error && <div className="text-red-500">{error}</div>}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone
        </label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="position" className="block text-sm font-medium">
          Position
        </label>
        <input
          type="text"
          id="position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
          className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="division" className="block text-sm font-medium">
          Division
        </label>
        <select
          id="division"
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          required
          className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white">
          <option value="">Select Division</option>{" "}
          {/* Opsi kosong untuk user memilih */}
          {divisions.map((div) => (
            <option key={div.id} value={div.id}>
              {div.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleUpdate}
        disabled={!name || !phone || !position || !division} // Kondisi jika ada input kosong
        className={`px-4 py-2 rounded text-white ${
          !name || !phone || !position || !division
            ? "bg-gray-400 cursor-not-allowed" // Gaya untuk tombol disabled
            : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800" // Gaya untuk tombol aktif
        }`}>
        Update Employee
      </button>
    </div>
  );
};

export default EditEmployee;
