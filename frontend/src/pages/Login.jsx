import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, Shield, TestTube } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleLogin = (role) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🏥</div>
          <h1 className="text-4xl font-bold text-teal-700">Welcome to HIS</h1>
          <p className="text-gray-600">MANIT Bhopal Hospital Information System</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => handleRoleLogin('patient')}
            className="bg-white border-2 border-teal-200 hover:border-teal-500 p-8 rounded-3xl text-left transition"
          >
            <User className="w-10 h-10 text-teal-600 mb-4" />
            <h3 className="text-2xl font-semibold">Patient</h3>
            <p className="text-gray-500">Book appointment, view reports</p>
          </button>

          <button
            onClick={() => handleRoleLogin('doctor')}
            className="bg-white border-2 border-blue-200 hover:border-blue-500 p-8 rounded-3xl text-left transition"
          >
            <Stethoscope className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-2xl font-semibold">Doctor</h3>
            <p className="text-gray-500">Manage patients &amp; prescriptions</p>
          </button>

          <button
            onClick={() => handleRoleLogin('admin')}
            className="bg-white border-2 border-purple-200 hover:border-purple-500 p-8 rounded-3xl text-left transition"
          >
            <Shield className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="text-2xl font-semibold">Admin / Staff</h3>
            <p className="text-gray-500">Full system access</p>
          </button>

          <button
            onClick={() => handleRoleLogin('lab')}
            className="bg-white border-2 border-amber-200 hover:border-amber-500 p-8 rounded-3xl text-left transition"
          >
            <TestTube className="w-10 h-10 text-amber-600 mb-4" />
            <h3 className="text-2xl font-semibold">Lab Technician</h3>
            <p className="text-gray-500">Process lab tests</p>
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-12">
          Demo Mode • No real authentication required
        </p>
      </div>
    </div>
  );
}