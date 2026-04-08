import DataTable from '../components/common/DataTable';

const billingData = [
  { id: 'B001', patient: 'Rahul Sharma', amount: '₹4,850', status: 'Paid' },
  { id: 'B002', patient: 'Meena Patel', amount: '₹12,300', status: 'Pending' }
];

export default function Billing() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Billing &amp; Payments</h1>
      <DataTable columns={['Bill ID', 'Patient', 'Amount', 'Status']} data={billingData} />
    </div>
  );
}