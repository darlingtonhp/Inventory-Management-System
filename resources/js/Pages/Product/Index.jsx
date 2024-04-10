import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";

export default function Index({ auth, products, queryParams = null, success }) {
  queryParams = queryParams || {};
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route("product.index", queryParams));
  };
  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged("name", e.target.value);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc";
      } else {
        queryParams.sort_direction = "asc";
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }
    router.get(route("product.index", queryParams));
  };

  const deleteProduct = (product) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    router.delete(route("product.destroy", product.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Products
          </h2>
          <Link
            href={route("product.create")}
            className="bg-emerald-500 px-3 py-1 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Add new
          </Link>
        </div>
      }
    >
      <Head title="Products" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            <div className="bg-emerald-500 px-4 py-2 text-white rounded mb-4">
              {success}
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table
                  className="w-full text-sm text-left rtl.text-right
                            text-gray-500 dark:text-gray-400"
                >
                  <thead
                    className="text-xs text-gray-700 uppercase
                                bg-gray-50 dark:bg-gray-700 dark:text-gray-400
                                border-b-2 border-gray-500"
                  >
                    <tr className="text-nowrap">
                      <TableHeading
                        name="id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        ID
                      </TableHeading>
                      <th className="px-3 py-3">Image</th>
                      <TableHeading
                        name="name"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Name
                      </TableHeading>
                      <TableHeading
                        name="price"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Price $
                      </TableHeading>
                      <TableHeading
                        name="quantity"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Quantity
                      </TableHeading>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <thead
                    className="text-xs text-gray-700 uppercase
                                bg-gray-50 dark:bg-gray-700 dark:text-gray-400
                                border-b-2 border-gray-500"
                  >
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaulValue={queryParams.name}
                          placeholder="Product Name"
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.data.map((product) => (
                      <tr
                        className="bg-white border-b dark:bg-gray-800
                                        dark:border-gray-700"
                        key={product.id}
                      >
                        <td className="px-3 py-2">{product.id}</td>
                        <td className="px-3 py-2">
                          <img src={product.image_path} style={{ width: 60 }} />
                        </td>
                        <td className="px-3 py-2 text-gray-100 hover:underline text-nowrap">
                          <Link href={route("product.show", product.id)}>
                            {product.name}
                          </Link>
                        </td>
                        <td className="px-3 py-2">${product.price}</td>
                        <td className="px-3 py-2">{product.quantity}</td>
                        <td className="px-3 py-2 text-nowrap">
                          <Link
                            href={route("product.edit", product.id)}
                            className="font-medium text-blue-600
                                            dark:text-blue-600 hover:underline mx-1"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={(e) => deleteProduct(product)}
                            className="font-medium text-red-600
                                            dark:text-red-600 hover:underline mx-1"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={products.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
