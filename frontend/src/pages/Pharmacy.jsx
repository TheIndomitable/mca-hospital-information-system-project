import DataTable from '../components/common/DataTable';

const pharmacyData = [
  { medicine: 'Paracetamol 500mg', stock: 245, price: '₹12' },
  { medicine: 'Amoxicillin 250mg', stock: 98, price: '₹45' }
];

export default function Pharmacy() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Pharmacy Inventory</h1>
      <DataTable columns={['Medicine', 'Stock', 'Price per Unit']} data={pharmacyData} />
    </div>
  );
}