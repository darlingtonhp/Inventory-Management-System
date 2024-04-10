import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create({ auth }) {
  const { data, setData, post, errors, reset } = useForm({
    name: "",
    description: "",
    image_path: "",
    price: "",
    quantity: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("product.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Create new Product
          </h2>
        </div>
      }
    >
      <Head title="Create Product" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800
            shadow sm:rounded-lg"
            >
              <div>
                <InputLabel htmlFor="product_image" value="Product Image" />
                <TextInput
                  id="product_image"
                  type="file"
                  name="image_path"
                  className="mt-1 block w-full"
                  onChange={(e) => setData("image_path", e.target.files[0])}
                />
                <InputError message={errors.image_path} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="product_name" value="Product Name" />
                <TextInput
                  id="product_name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel
                  htmlFor="product_description"
                  value="Product Description"
                />
                <TextInput
                  id="product_description"
                  type="text"
                  name="description"
                  value={data.description}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("description", e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="product_price" value="Price" />
                <TextInput
                  id="product_price"
                  type="number"
                  name="price"
                  value={data.price}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("price", e.target.value)}
                />
                <InputError message={errors.price} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="product_quantity" value="Quantity" />
                <TextInput
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
                  className="bg-gray-100 px-3 py-1 text-gray-800 rounded
                shadow transition-all hover:bg-gray-200 mr-2 text-sm h-8"
                >
                  Cancel
                </Link>
                <button
                  className="bg-emerald-500 px-3 py-1 text-white
                   shadow transition-all hover:bg-emerald-600 text-sm h-8"
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
