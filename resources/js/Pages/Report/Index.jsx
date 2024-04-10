import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { REPORT_TYPE_TEXT_MAP, REPORT_TYPE_MAP } from "@/constants";

export default function ReportIndex({ auth, reports }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Reports" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Reports</h2>
              <div className="mb-4">
                <Link href={route("report.create")} className="btn btn-primary">
                  Create New Report
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Name
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
                    {reports.data.map((report) => (
                      <tr key={report.id}>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          {report.name}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              REPORT_TYPE_MAP[report.type]
                            }`}
                          >
                            {REPORT_TYPE_TEXT_MAP[report.type]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium">
                          <Link className="text-indigo-600 hover:text-indigo-900 mr-2">
                            Edit
                          </Link>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(report.id)}
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
