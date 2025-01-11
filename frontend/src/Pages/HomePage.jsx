import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.status === "success") {
          // Mengatur data employees dari response API
          setItems(data.data.employees);
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Pagination logic
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fungsi untuk menghapus item
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this employee?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:8000/api/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      // Hapus item dari state setelah berhasil
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
      console.log(`Deleted employee with ID: ${id}`);
    } else {
      console.error("Failed to delete:", data.message);
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
};


  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Employee Management</h1>

        {/* Search Bar */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name"
          className="p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded w-full"
        />

        {/* List of Items */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <ul>
            {paginatedItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center mb-2 p-2 border-b border-gray-300 dark:border-gray-600">
                <div className="flex items-center space-x-4">
                  {/* Display Image */}
                  {item.image && (
                    <img
                      src={`${item.image}`}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <span className="font-semibold">{item.name}</span>
                    <br />
                    {/* <span className="text-sm text-gray-500">
                      {item.position}
                    </span> */}
                  </div>
                </div>

                <div className="flex flex-col text-sm text-gray-500">
                  <span>{item.phone}</span>
                  <span>{item.division.name}</span>
                </div>

                {/* Actions - Edit and Delete */}
                <div className="flex items-center space-x-4">
                  {/* Edit Button */}
                  <Link
                    to={`/edit-item/${item.id}`}
                    className="text-blue-500 hover:text-blue-700">
                    Edit
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded mr-2">
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded ml-2">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
