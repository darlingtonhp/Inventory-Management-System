import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import OrdersTable from "./OrderTable";

export default function Index({ auth, success, orders, queryParams = null }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Orders
          </h2>
          {/* <Link
            href={route("task.create")}
            className="bg-emerald-500 px-3 py-1 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Add new
          </Link> */}
        </div>
      }
    >
      <Head title="Orders" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <OrdersTable
                orders={orders}
                queryParams={queryParams}
                success={success}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
