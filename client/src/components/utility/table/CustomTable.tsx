import React from "react";

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
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  keyField,
}) => {
  const getNestedValue = (obj: Record<string, any>, path: string): any => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
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
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row[keyField] || rowIndex}
                className={`${rowIndex % 2 === 0 ? "bg-gray-50" : ""}`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-3 whitespace-nowrap text-sm"
                  >
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;
