import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, success, product }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {"Product: " + product.name}
          </h2>
          <Link
            href={route("product.edit", product.id)}
            className="bg-emerald-500 px-3 py-1 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Edit
          </Link>
        </div>
      }
    >
      <Head title={"Product: " + product.name} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div>
              <img
                src={product.image_path}
                alt=""
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div>
                <label className="font-bold text-lg">Product ID</label>
                <p className="mt-1">{product.id}</p>
              </div>
              <div className="mt-4">
                <label className="font-bold text-lg">Product Name</label>
                <p className="mt-1">{product.name}</p>
              </div>
              <div className="mt-4">
                <label className="font-bold text-lg">Price</label>
                <p className="mt-1">{product.price}</p>
              </div>
              <div className="mt-4">
                <label className="font-bold text-lg">Quantity</label>
                <p className="mt-1">{product.quantity}</p>
              </div>
              <div className="mt-4">
                <label className="font-bold text-lg">Product Description</label>
                <p className="mt-1">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
