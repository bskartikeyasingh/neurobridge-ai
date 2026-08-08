import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StudentForm from "../components/StudentForm";
import StudentTable from "../components/StudentTable";

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/student";

import { Plus, Search } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadStudents();

    const query = searchParams.get("search");

    if (query) {
      setSearch(query);
    }
  }, [searchParams]);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (student) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, student);
      } else {
        await createStudent(student);
      }

      setShowForm(false);
      setEditingStudent(null);
      loadStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter((student) =>
    (student.name || student.student_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Sidebar />

      <div className="pl-64 min-h-screen p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-gray-400 mt-2">Manage all your students here.</p>
          </div>

          <button
            onClick={() => {
              setEditingStudent(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-primary px-5 py-3 rounded-xl hover:opacity-90"
          >
            <Plus size={18} />
            Add Student
          </button>
        </div>

        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-3.5 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-cardBorder rounded-xl pl-12 pr-4 py-3 outline-none"
          />
        </div>

        <StudentTable
          students={filteredStudents}
          onEdit={(student) => {
            setEditingStudent(student);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />

        {showForm && (
          <StudentForm
            editingStudent={editingStudent}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false);
              setEditingStudent(null);
            }}
          />
        )}
      </div>
    </>
  );
}