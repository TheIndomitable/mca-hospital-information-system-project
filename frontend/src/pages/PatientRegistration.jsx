import { useForm } from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';

export default function PatientRegistration() {
  const { values, handleChange, reset } = useForm({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('✅ Patient registered successfully! (Demo)');
    reset();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-teal-700 mb-8">New Patient Registration</h1>
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input name="name" value={values.name} onChange={handleChange} required className="w-full border rounded-2xl px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input name="age" type="number" value={values.age} onChange={handleChange} required className="w-full border rounded-2xl px-4 py-3" />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Gender</label>
          <select name="gender" value={values.gender} onChange={handleChange} className="w-full border rounded-2xl px-4 py-3">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input name="phone" value={values.phone} onChange={handleChange} required className="w-full border rounded-2xl px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input name="email" type="email" value={values.email} onChange={handleChange} className="w-full border rounded-2xl px-4 py-3" />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea name="address" value={values.address} onChange={handleChange} rows="3" className="w-full border rounded-3xl px-4 py-3" />
        </div>

        <button type="submit" className="mt-10 w-full bg-teal-600 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-teal-700">
          Register Patient
        </button>
      </form>
    </div>
  );
}