import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { TRANSACTION_TYPE_TEXT_MAP } from "@/constants";

export default function TransactionIndex({ auth, transactions }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Transactions" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Transactions</h2>
              <div className="mb-4">
                <Link
                  href={route("transaction.create")}
                  className="inline-block bg-amber-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create New Transaction
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Product ID
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {transactions.data.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          {transaction.product_id} {/* Display product ID */}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          {transaction.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          {TRANSACTION_TYPE_TEXT_MAP[transaction.type]}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium">
                          <Link className="text-indigo-600 hover:text-indigo-900 mr-2">
                            Edit
                          </Link>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(transaction.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
