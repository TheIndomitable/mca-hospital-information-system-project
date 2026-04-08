import DataTable from '../components/common/DataTable';

const admissionData = [
  { id: 'AD001', patient: 'Vikas Singh', room: 'ICU-03', status: 'Admitted', date: '2026-04-07' },
  { id: 'AD002', patient: 'Sneha Gupta', room: 'Ward-12', status: 'Discharged', date: '2026-04-08' }
];

export default function AdmissionDischarge() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admission &amp; Discharge</h1>
      <DataTable columns={['ID', 'Patient', 'Room', 'Status', 'Date']} data={admissionData} />
    </div>
  );
}