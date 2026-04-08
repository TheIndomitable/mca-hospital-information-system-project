import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Home, Calendar, Users, Stethoscope, TestTube, Pill, Bed, Receipt, LogOut } from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/doctors', label: 'Doctors', icon: Stethoscope },
  { path: '/lab-tests', label: 'Lab Tests', icon: TestTube },
  { path: '/pharmacy', label: 'Pharmacy', icon: Pill },
  { path: '/admission-discharge', label: 'Admission', icon: Bed },
  { path: '/billing', label: 'Billing', icon: Receipt },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-teal-800 text-white h-full flex flex-col">
      <div className="p-6 border-b border-teal-700">
        <h2 className="text-xl font-semibold">Hospital System</h2>
      </div>

      <div className="flex-1 overflow-auto py-6">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 mx-3 rounded-2xl transition ${isActive ? 'bg-teal-700 text-white' : 'hover:bg-teal-700/50'}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-teal-700 text-sm">
        <p className="px-3 text-teal-300">Logged in as <span className="capitalize">{user?.role}</span></p>
      </div>
    </div>
  );
}