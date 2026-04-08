import DataTable from '../components/common/DataTable';

const doctorsData = [
  { id: 'D001', name: 'Dr. Priya Verma', specialty: 'Cardiology', availability: 'Available' },
  { id: 'D002', name: 'Dr. Arjun Rao', specialty: 'Orthopedics', availability: 'In OPD' }
];

export default function Doctors() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Doctors</h1>
      <DataTable columns={['ID', 'Name', 'Specialty', 'Status']} data={doctorsData} />
    </div>
  );
}