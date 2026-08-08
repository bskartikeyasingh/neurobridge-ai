  import React, { useState } from "react";
  import GlassCard from "./GlassCard";

  export default function StudentForm({
    onSave,
    onClose,
    editingStudent = null,
  }) {
    const [form, setForm] = useState({
      student_name: editingStudent?.student_name || "",
      student_id: editingStudent?.student_id || "",
      password: "",
      age: editingStudent?.age || "",
      grade: editingStudent?.grade || "",
      school: editingStudent?.school || "",
      gender: editingStudent?.gender || "",
    });

    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(form);
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
        <GlassCard className="w-[500px]">
          <h2 className="text-2xl font-bold mb-6">
            {editingStudent ? "Edit Student" : "Add Student"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="student_name"
              placeholder="Student Name"
              value={form.student_name}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-cardBorder rounded-xl px-4 py-3 outline-none"
            />

            <input
              name="student_id"
              placeholder="Student ID"
              value={form.student_id}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-cardBorder rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required={!editingStudent}
              className="w-full bg-white/5 border border-cardBorder rounded-xl px-4 py-3 outline-none"
            />

            <input
              name="age"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-cardBorder rounded-xl px-4 py-3 outline-none"
            />

            <input
              name="grade"
              placeholder="Grade"
              value={form.grade}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-cardBorder rounded-xl px-4 py-3 outline-none"
            />

            <input
              name="school"
              placeholder="School"
              value={form.school}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-cardBorder rounded-xl px-4 py-3 outline-none"
            />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full bg-white/5 border border-cardBorder rounded-xl px-4 py-3 outline-none"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary hover:opacity-90"
              >
                Save Student
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    );
  }