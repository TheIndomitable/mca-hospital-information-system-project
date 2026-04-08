export default function DataTable({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 text-left text-sm font-medium text-gray-500">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {Object.values(row).map((value, j) => (
                <td key={j} className="px-6 py-4 text-sm">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}