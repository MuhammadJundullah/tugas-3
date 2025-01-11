import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [division, setDivision] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [image, setImage] = useState(null); // Untuk menangani input file
  const [divisions, setDivisions] = useState([]); // Data untuk dropdown division
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch divisions untuk dropdown
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Buat form data untuk mengirimkan file
    const formData = new FormData();
    formData.append("name", name);
    formData.append("division", division);
    formData.append("phone", phone);
    formData.append("position", position);
    if (image) {
      formData.append("image", image); // Menambahkan file image jika ada
    }

    try {
      // Kirim data ke API
      const response = await fetch("http://localhost:8000/api/employees", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Menambahkan Bearer Token di header
        },
        body: formData, // FormData dikirim langsung tanpa Content-Type manual
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Failed to add employee");
      }

      // Jika berhasil, arahkan kembali ke halaman HomePage
      navigate("/");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <h2 className="text-2xl mb-4 font-semibold">Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            <option value="" disabled>
              Select Division
            </option>
            {divisions.map((div) => (
              <option key={div.id} value={div.id}>
                {div.name}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
          />
        </div>

        {/* Position Input */}
        <div className="mb-4">
          <label htmlFor="position" className="block text-sm font-medium">
            Position
          </label>
          <input
            id="position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
          />
        </div>

        {/* Image Input */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium">
            Image
          </label>
          <input
            id="image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:hover:bg-green-700">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
