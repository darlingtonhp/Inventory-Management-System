import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import TableHeading from "@/Components/TableHeading";
import { ORDER_STATUS_CLASS_MAP, ORDER_STATUS_TEXT_MAP } from "@/constants";
import { Link, usePage } from "@inertiajs/react";

export default function OrdersTable({ orders, success, queryParams = null }) {
  const { route } = usePage();

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    route(route().url(), queryParams);
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
    route(route().url(), queryParams);
  };

  const deleteOrder = (order) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }
    route(route("order.destroy", { id: order.id }), { method: "delete" });
  };

  return (
    <>
      {success && (
        <div className="bg-emerald-500 px-4 py-2 text-white rounded mb-4">
          {success}
        </div>
      )}
      <div className="overflow-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap">
              <TableHeading
                name="id"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                ID
              </TableHeading>
              <TableHeading
                name="status"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Status
              </TableHeading>
              <th className="px-3 py-3">Customer ID</th>
              <th className="px-3 py-3">Created By</th>
              <th className="px-3 py-3">Updated By</th>
              <TableHeading
                name="created_at"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Created At
              </TableHeading>
              <TableHeading
                name="updated_at"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Updated At
              </TableHeading>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.data.map((order) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={order.id}
              >
                <td className="px-3 py-2">{order.id}</td>
                <td
                  className={`px-3 py-2 ${
                    ORDER_STATUS_CLASS_MAP[order.status]
                  }`}
                >
                  {ORDER_STATUS_TEXT_MAP[order.status]}
                </td>
                <td className="px-3 py-2">{order.customer_id}</td>
                <td className="px-3 py-2">{order.created_by.name}</td>
                <td className="px-3 py-2">{order.updated_by.name}</td>
                <td className="px-3 py-2">{order.created_at}</td>
                <td className="px-3 py-2">{order.updated_at}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => editOrder(order.id)}
                    className="font-medium text-blue-600 dark:text-blue-600 hover:underline mx-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteOrder(order)}
                    className="font-medium text-red-600 dark:text-red-600 hover:underline mx-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination links={orders.meta.links} />
    </>
  );
}
