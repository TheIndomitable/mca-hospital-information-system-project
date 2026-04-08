import DataTable from '../components/common/DataTable';

const patientsData = [
  { id: 'P001', name: 'Rahul Sharma', age: 34, gender: 'Male', phone: '9876543210', lastVisit: '2026-04-05' },
  { id: 'P002', name: 'Meena Patel', age: 45, gender: 'Female', phone: '9123456789', lastVisit: '2026-04-03' }
];

export default function Patients() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Patients</h1>
      <DataTable columns={['ID', 'Name', 'Age', 'Gender', 'Phone', 'Last Visit']} data={patientsData} />
    </div>
  );
}