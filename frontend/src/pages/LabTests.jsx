import DataTable from '../components/common/DataTable';

const labData = [
  { id: 'L001', patient: 'Rahul Sharma', test: 'CBC', status: 'Completed', result: 'Normal' },
  { id: 'L002', patient: 'Meena Patel', test: 'Lipid Profile', status: 'In Progress', result: '-' }
];

export default function LabTests() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Lab Tests</h1>
      <DataTable columns={['ID', 'Patient', 'Test', 'Status', 'Result']} data={labData} />
    </div>
  );
}