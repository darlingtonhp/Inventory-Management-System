import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Import the authentication layout

export default function WarehouseIndex({ auth, warehouses }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Warehouse" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Transactions
              </h2>
              <div div className="mb-4">
                <Link
                  href={route("warehouse.create")}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                  Create New Warehouse
                </Link>
              </div>
              <div className="container mx-auto px-4 py-8">
                {/* Warehouse List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {warehouses.data.map((warehouse) => (
                    <div
                      key={warehouse.id}
                      className="bg-white rounded-lg shadow-md p-6"
                    >
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {warehouse.name}
                      </h2>
                      <p className="text-gray-600 mb-2">{warehouse.address}</p>

                      {/* Action Buttons */}
                      <div className="flex justify-end">
                        <Link className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">
                          Edit
                        </Link>
                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
