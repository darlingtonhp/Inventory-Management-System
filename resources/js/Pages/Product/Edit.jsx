import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError"; // Import the useForm hook

export default function Edit({ auth, product }) {
  // Initialize the form data using the useForm hook
  const { data, setData, post, errors } = useForm({
    image: "",
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    quantity: product.quantity || "",
    _method: "PUT", // Ensure the correct HTTP method is used for updating
  });

  // Define the onSubmit function
  const onSubmit = (e) => {
    e.preventDefault();
    post(route("product.update", product.id)); // Post the form data to the update route
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Edit Product "{product.name}"
          </h2>
        </div>
      }
    >
      <Head title="Edit Product" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              {/* Input field for product image */}
              <div>
                <label className="font-bold text-lg" htmlFor="product_image">
                  Product Image
                </label>
                <input
                  id="product_image"
                  type="file"
                  name="image"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("image", e.target.files[0])}
                />
                <InputError message={errors.image} className="mt-2" />
              </div>

              {/* Input field for product name */}
              <div className="mt-4">
                <label className="font-bold text-lg" htmlFor="product_name">
                  Product Name
                </label>
                <input
                  id="product_name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("name", e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Input field for product description */}
              <div className="mt-4">
                <label
                  className="font-bold text-lg"
                  htmlFor="product_description"
                >
                  Product Description
                </label>
                <textarea
                  id="product_description"
                  name="description"
                  value={data.description}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("description", e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              {/* Input field for product price */}
              <div className="mt-4">
                <label className="font-bold text-lg" htmlFor="product_price">
                  Product Price
                </label>
                <input
                  id="product_price"
                  type="number"
                  name="price"
                  value={data.price}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("price", e.target.value)}
                />
                <InputError message={errors.price} className="mt-2" />
              </div>

              {/* Input field for product quantity */}
              <div className="mt-4">
                <label className="font-bold text-lg" htmlFor="product_quantity">
                  Product Quantity
                </label>
                <input
                  id="product_quantity"
                  type="number"
                  name="quantity"
                  value={data.quantity}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("quantity", e.target.value)}
                />
                <InputError message={errors.quantity} className="mt-2" />
              </div>

              <div className="mt-4 text-right">
                <Link
                  href={route("product.index")}
                  className="bg-gray-100 px-3 py-1 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2 text-sm h-8"
                >
                  Cancel
                </Link>
                <button
                  className="bg-emerald-500 px-3 py-1 text-white shadow transition-all hover:bg-emerald-600 text-sm h-8"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
