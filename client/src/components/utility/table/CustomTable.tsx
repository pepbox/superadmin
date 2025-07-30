import React, { useState } from "react";

/**
 * CustomTable Component with Pagination
 * 
 * @example
 * ```tsx
 * <CustomTable 
 *   keyField="_id" 
 *   data={tableData} 
 *   columns={columns} 
 *   pageSize={10}           // Optional: default is 10
 *   enablePagination={true} // Optional: default is true
 * />
 * ```
 */

interface Column {
  key: string;
  header: string;
  type?: "action" | "simple" | "component";
  component?: React.ComponentType<any>;
  handler?: (row: any) => void;
  componentProps?: Record<string, any>;
}

interface CustomTableProps {
  columns: Column[];
  data: Record<string, any>[];
  keyField: string;
  pageSize?: number;
  enablePagination?: boolean;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  keyField,
  pageSize = 10,
  enablePagination = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getNestedValue = (obj: Record<string, any>, path: string): any => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = enablePagination ? data.slice(startIndex, endIndex) : data;

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const renderCell = (column: Column, row: Record<string, any>) => {
    if (column.type === "action" && column.component && column.handler) {
      const ActionComponent = column.component;
      return (
        <ActionComponent
          onClick={() => column.handler!(row)}
          {...(column.componentProps || {})}
        />
      );
    }
    if (column.type === "component" && column.component) {
      const CustomComponent = column.component;
      const value = getNestedValue(row, column.key);
      return (
        <CustomComponent
          value={value}
          row={row}
          {...(column.componentProps || {})}
        />
      );
    }
    const value = getNestedValue(row, column.key);
    return value !== undefined && value !== null ? value : "_";
  };

  return (
    <div className="w-full bg-white rounded-lg">
      <div className="overflow-x-auto">
      <table className="min-w-full w-full table-auto">
        <thead className="hidden md:table-header-group">
        <tr>
          {columns.map((column, index) => (
          <th
            key={index}
            className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {column.header}
          </th>
          ))}
        </tr>
        </thead>
        <tbody>
        {paginatedData.length > 0 ? (
          paginatedData.map((row, rowIndex) => (
            <tr
            key={row[keyField] || rowIndex}
            className={`${rowIndex % 2 === 0 ? "bg-gray-50" : ""} md:table-row flex flex-col md:flex-row w-full mb-4 md:mb-0 hover:bg-gray-100 transition-colors duration-150`}
            >
            {columns.map((column, colIndex) => (
              <td
              key={colIndex}
              className="px-4 md:px-6 py-3 whitespace-nowrap text-sm flex md:table-cell items-center"
              data-label={column.header}
              >
              <span className="block md:hidden font-medium text-gray-500 mr-2">{column.header}:</span>
              {renderCell(column, row)}
              </td>
            ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="px-4 md:px-6 py-12 text-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <div className="text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <p className="text-lg font-medium">No data available</p>
                <p className="text-sm">There are no records to display at this time.</p>
              </div>
            </td>
          </tr>
        )}
        </tbody>
      </table>
      </div>

      {/* Pagination Controls */}
      {enablePagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4 pb-4">
          {/* Items info */}
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
          </div>
          
          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageClick(page as number)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;
