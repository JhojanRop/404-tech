"use client";

import {
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import Dropdown from "../ui/Dropdown";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Table2Props {
  headers: { label: string; key: string; icon?: React.ReactNode }[];
  data: Record<string, any>[];
  title?: string;
  pageSize?: number;
  actions?: Array<{
    label: string;
    onClick: (row: any) => void;
  }>;
}

export default function Table2({
  headers,
  data,
  title,
  pageSize = 10,
  actions,
}: Table2Props) {
  console.log({ data });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortedData, setSortedData] = useState<Record<string, any>[]>([]);

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((value) => value !== null && value !== undefined)
    );
  }, [data]);

  useEffect(() => {
    if (data.length && !sortedData.length) {
      setSortedData(filteredData);
    }
  }, [data, filteredData, sortedData]);

  const sortData = useCallback(
    (key: string, direction: "asc" | "desc") => {
      const sortedData = [...filteredData].sort((a, b) => {
        if (typeof a[key] === "number" && typeof b[key] === "number") {
          return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
        }
        return direction === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      });
      return sortedData;
    },
    [filteredData]
  );

  const sortOptions = useMemo(() => {
    return headers.map((header) => ({
      label: header.label,
      action: () => {
        const direction =
          sortedData.length && sortedData[0][header.key] === data[0][header.key]
            ? "desc"
            : "asc";
        setSortedData(sortData(header.key, direction));
      },
      active: false,
    }));
  }, [headers, data, sortedData, sortData]);

  const pages = useMemo(() => {
    return Math.ceil(filteredData.length / pageSize);
  }, [filteredData, pageSize]);

  const slicedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return (sortedData.length ? sortedData : filteredData).slice(start, end);
  }, [filteredData, sortedData, currentPage, pageSize]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-2">
        {title && (
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            {title}
          </h2>
        )}

        <Dropdown
          name="Sort by"
          options={sortOptions}
          icon={<ArrowsUpDownIcon />}
        />
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden border-collapse">
          <thead className="bg-[#f6f8fa] dark:bg-gray-800">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left border border-gray-200 dark:border-gray-700"
                >
                  <button
                    className="w-full text-left flex items-center justify-between dark:text-gray-300"
                    onClick={() => {
                      const direction =
                        sortedData.length &&
                        sortedData[0][header.key] === data[0][header.key]
                          ? "desc"
                          : "asc";
                      setSortedData(sortData(header.key, direction));
                    }}
                  >
                    <div className="flex items-center text-base text-gray-500">
                      {header.icon && (
                        <span className="block h-full mr-2 w-4">
                          {header.icon}
                        </span>
                      )}
                      {header.label}
                    </div>

                    <ChevronUpDownIcon className="inline-block w-4 h-4 text-gray-500 ml-1" />
                  </button>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-left border border-gray-200 dark:border-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {slicedData.map((row, index) => (
              <tr key={index}>
                {headers.map((header, i) => {
                  if (i === headers.length - 1 && actions) {
                    return (
                      <>
                        <td
                          key={i}
                          className="px-6 py-3.5 border border-gray-200 dark:border-gray-700"
                        >
                          {typeof row[header.key] === "number" ? (
                            <p className="text-gray-500 text-sm dark:text-gray-400">
                              {row[header.key]}
                            </p>
                          ) : (
                            <p className="font-medium text-gray-800 text-sm dark:text-white/90">
                              {row[header.key]}
                            </p>
                          )}
                        </td>
                        <td
                          key={i}
                          className="px-6 py-4 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex justify-evenly items-center">
                            {actions.map((action, actionIndex) => (
                              <button
                                key={actionIndex}
                                className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                onClick={() => action.onClick(row)}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </td>
                      </>
                    );
                  }

                  return (
                    <td
                      key={i}
                      className="px-6 py-3.5 border border-gray-200 dark:border-gray-700"
                    >
                      {typeof row[header.key] === "number" ? (
                        <p className="text-gray-500 text-sm dark:text-gray-400">
                          {row[header.key]}
                        </p>
                      ) : (
                        <p className="font-medium text-gray-800 text-sm dark:text-white/90">
                          {row[header.key]}
                        </p>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Showing{" "}
          <span className="font-medium text-gray-800 dark:text-white/90">
            {slicedData.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-800 dark:text-white/90">
            {data.length}
          </span>{" "}
          entries
        </p>

        <div className="flex justify-between items-center mt-2">
          <button
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <span className="w-4 mr-2">
              <ChevronLeftIcon />
            </span>
            Previous
          </button>

          <div className="mx-1">
            {[...Array(pages)].map((_, index) => (
              <button
                key={index}
                className={`px-3 py-2 mx-1 text-sm font-medium rounded-md ${
                  index === currentPage - 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={currentPage === pages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
            <span className="w-4 ml-2">
              <ChevronRightIcon />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
