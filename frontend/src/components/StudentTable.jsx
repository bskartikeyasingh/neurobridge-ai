import React from "react";
import GlassCard from "./GlassCard";
import { Pencil, Trash2, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentTable({
  students,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <GlassCard className="mt-6 overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-cardBorder">
            <th className="py-3">Name</th>
            <th>Age</th>
            <th>Grade</th>
            <th>School</th>
            <th>Gender</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="text-center py-10 text-gray-400"
              >
                No students added yet.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr
                key={student._id}
                onClick={() => navigate(`/students/${student._id}`)}
                className="border-b border-cardBorder hover:bg-white/5 transition cursor-pointer"
              >
                <td className="py-4 font-medium text-cyan-400">
                  {student.student_name}
                </td>

                <td>{student.age}</td>

                <td>{student.grade}</td>

                <td>{student.school}</td>

                <td>{student.gender}</td>

                <td>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/communication/${student._id}`);
                      }}
                      className="text-cyan-400 hover:text-cyan-300"
                      title="Communication"
                    >
                      <MessageSquare size={18} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(student);
                      }}
                      className="text-blue-400 hover:text-blue-300"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(student._id);
                      }}
                      className="text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </GlassCard>
  );
}