/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

const TableNodeComponent = ({ id, content, data }) => {
  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-700 border rounded shadow w-[200px]">
        <h3 className="p-4 text-sm font-bold text-black dark:text-white">
          {content}
        </h3>
        <hr />
        <div className="p-2">
          <ul className="space-y-1 mt-2">
            {data?.ports.map((port) => (
              <li
                key={port.id}
                className="p-1 bg-gray-200 dark:bg-gray-600 rounded text-sm"
              >
                {port.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TableNodeComponent;
