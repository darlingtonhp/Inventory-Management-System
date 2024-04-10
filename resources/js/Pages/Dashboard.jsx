import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({
  auth,
  totalProducts,
  totalUsers,
  totalTransactions,
  totalOrders,
}) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Dashboard
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Total Products
                </h3>
                <p className="text-4xl mt-4">{totalProducts}</p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Total Users
                </h3>
                <p className="text-4xl mt-4">{totalUsers}</p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Total Transactions
                </h3>
                <p className="text-4xl mt-4">{totalTransactions}</p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Total Orders
                </h3>
                <p className="text-4xl mt-4">{totalOrders}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
