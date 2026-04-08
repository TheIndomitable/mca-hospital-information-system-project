import { useAuth } from '../hooks/useAuth';
import DataTable from '../components/common/DataTable';

export default function Dashboard() {
  const { user } = useAuth();

  const quickStats = [
    { label: 'Today’s Appointments', value: '18' },
    { label: 'Active Patients', value: '142' },
    { label: 'Pending Bills', value: '₹ 87,450' },
    { label: 'Available Beds', value: '7' }
  ];

  const recentPatients = [
    { id: 'P001', name: 'Rahul Sharma', age: 34, status: 'OPD' },
    { id: 'P002', name: 'Meena Patel', age: 45, status: 'IPD' },
    { id: 'P003', name: 'Vikas Singh', age: 29, status: 'Lab' }
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name} 👋</h1>
      <p className="text-gray-600 mb-8">Here’s what’s happening in the hospital today</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {quickStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow">
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-4xl font-bold text-teal-700 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8">
        <h2 className="text-xl font-semibold mb-6">Recent Patients</h2>
        <DataTable columns={['ID', 'Name', 'Age', 'Status']} data={recentPatients} />
      </div>
    </div>
  );
}