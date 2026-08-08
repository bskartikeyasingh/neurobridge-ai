import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { getStudent } from "../services/student";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = async () => {
    try {
      const data = await getStudent(id);
      setStudent(data);
    } catch (err) {
      console.error(err);
      alert("Unable to load student.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pl-64 p-8 text-white">
        Loading student...
      </div>
    );
  }

  // Optional safety check: handles the edge case where loading finishes but data is null
  if (!student) {
    return (
      <div className="pl-64 p-8 text-white">
        Student data not found.
      </div>
    );
  }

  return (
    <div className="pl-64 p-8 min-h-screen">

      <GlassCard className="p-8">

        <h1 className="text-3xl font-bold mb-6">
          {student.student_name}
        </h1>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-gray-400">Age</p>
            <p className="text-xl">{student.age}</p>
          </div>

          <div>
            <p className="text-gray-400">Grade</p>
            <p className="text-xl">{student.grade}</p>
          </div>

          <div>
            <p className="text-gray-400">School</p>
            <p className="text-xl">{student.school}</p>
          </div>

          <div>
            <p className="text-gray-400">Gender</p>
            <p className="text-xl">
              {student.gender || "Not Specified"}
            </p>
          </div>

        </div>

        <div className="mt-10 flex gap-4">

          {/* Updated template literal to include the dynamic ID */}
          <button
            onClick={() => navigate(`/communication/${student._id || student.id}`)}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold"
          >
            Communication AI
          </button>

          {/* Updated this as well, assuming your screening route also needs the ID */}
          <button
            onClick={() => navigate(`/screening/${student._id || student.id}`)}
            className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold"
          >
            AI Screening
          </button>

        </div>

      </GlassCard>

    </div>
  );
}