import { Link } from 'react-router-dom';
import { Calendar, Users, Stethoscope, TestTube } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen hospital-gradient text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">Hospital Information System</h1>
          <p className="text-2xl text-teal-100">MANIT Bhopal • MCA Semester 2 DBMS Project</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Link to="/login" className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl hover:scale-105 transition text-center">
            <Users className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Patient Portal</h3>
          </Link>
          <Link to="/login" className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl hover:scale-105 transition text-center">
            <Stethoscope className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Doctor Portal</h3>
          </Link>
          <Link to="/login" className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl hover:scale-105 transition text-center">
            <TestTube className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Lab &amp; Pharmacy</h3>
          </Link>
          <Link to="/login" className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl hover:scale-105 transition text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Appointments</h3>
          </Link>
        </div>

        <div className="text-center mt-20">
          <Link
            to="/login"
            className="inline-block bg-white text-teal-700 px-10 py-4 rounded-2xl text-xl font-semibold hover:bg-teal-100 transition"
          >
            Login to Continue →
          </Link>
        </div>
      </div>
    </div>
  );
}