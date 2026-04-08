import DataTable from '../components/common/DataTable';

const appointmentsData = [
  { id: 'A001', patient: 'Rahul Sharma', doctor: 'Dr. Priya Verma', date: '2026-04-09', time: '10:30 AM', status: 'Confirmed' },
  { id: 'A002', patient: 'Meena Patel', doctor: 'Dr. Arjun Rao', date: '2026-04-09', time: '11:00 AM', status: 'Pending' }
];

export default function Appointments() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Appointments</h1>
      <DataTable columns={['ID', 'Patient', 'Doctor', 'Date', 'Time', 'Status']} data={appointmentsData} />
    </div>
  );
}