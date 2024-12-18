/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Diagram, useSchema } from "beautiful-react-diagrams";
import { BsFillPlusCircleFill, BsPencil, BsCheck, BsX } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";

const DiagramDetails = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [schema, { onChange, addNode, removeNode }] = useSchema({
    nodes: [],
  });
  const [editingTable, setEditingTable] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const addNodeToDiagram = () => {
    const newNode = {
      id: `node-${schema.nodes.length + 1}`,
      content: `Table ${schema.nodes.length + 1}`,
      coordinates: [250, 150],
      data: {
        ports: [{ id: `port-${Math.random()}`, name: "Primary Key", type: "input" }],
      },
      render: TableNode,
    };
    addNode(newNode);
  };

  const updateNode = (nodeId, updatedData) => {
    const updatedNodes = schema.nodes.map((node) =>
      node.id === nodeId ? { ...node, ...updatedData } : node
    );
    onChange({ ...schema, nodes: updatedNodes });
  };

  const addPortToNode = (nodeId) => {
    const updatedNodes = schema.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              ports: [
                ...node.data.ports,
                {
                  id: `port-${Math.random()}`,
                  name: `Column ${node.data.ports.length + 1}`,
                  type: "output",
                },
              ],
            },
          }
        : node
    );
    onChange({ ...schema, nodes: updatedNodes });
  };

  const handleTableNameChange = (e, nodeId) => {
    const newContent = e.target.value;
    updateNode(nodeId, { content: newContent });
  };

  const handleColumnNameChange = (e, nodeId, columnId) => {
    const newColumnName = e.target.value;
    const updatedNodes = schema.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              ports: node.data.ports.map((port) =>
                port.id === columnId ? { ...port, name: newColumnName } : port
              ),
            },
          }
        : node
    );
    onChange({ ...schema, nodes: updatedNodes });
  };

  return (
    <div className="flex min-h-screen bg-gray-200 dark:bg-gray-800 text-black dark:text-white">

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform hideScroll ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out shadow-md`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-bold">Schema Design</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            <FiMenu size={24} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <button
            onClick={addNodeToDiagram}
            className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition"
          >
            <BsFillPlusCircleFill className="inline-block mr-2" />
            Add Table Node
          </button>
          <div className="space-y-4 mt-4 text-base">
            {schema.nodes.map((node) => (
              <div key={node.id} className="p-2 border rounded-lg border-gray-300 ">
                {/* Table Name */}
                {editingTable === node.id ? (
                  <div className="flex gap-2 items-center w-full">
                    <input
                      className="w-2/3 px-2  border rounded dark:bg-gray-700 bg-gray-300 text-black dark:text-white"
                      value={node.content}
                      onChange={(e) => handleTableNameChange(e, node.id)}
                    />
                   <div className="flex items-center justify-center">
                   <BsCheck
                      className="text-2xl  cursor-pointer text-green-500"
                      onClick={() => setEditingTable(null)}
                    />
                    <BsX
                      className="text-2xl cursor-pointer text-red-500"
                      onClick={() => setEditingTable(null)}
                    />
                   </div>
                    
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>{node.content}</span>
                    <BsPencil
                      className="cursor-pointer text-gray-500"
                      onClick={() => setEditingTable(node.id)}
                    />
                  </div>
                )}

                {/* Columns */}
                <ul className="mt-2 text-sm">
                  {node.data.ports.map((port) => (
                    <li key={port.id} className="flex items-center justify-between">
                      {editingColumn === port.id ? (
                        <>
                          <input
                            className="flex-1 px-2 py-1 border rounded"
                            value={port.name}
                            onChange={(e) => handleColumnNameChange(e, node.id, port.id)}
                          />
                          <BsCheck
                            className="ml-2 cursor-pointer text-green-500"
                            onClick={() => setEditingColumn(null)}
                          />
                          <BsX
                            className="ml-2 cursor-pointer text-red-500"
                            onClick={() => setEditingColumn(null)}
                          />
                        </>
                      ) : (
                        <>
                          <span>{port.name}</span>
                          <BsPencil
                            className="cursor-pointer text-gray-500"
                            onClick={() => setEditingColumn(port.id)}
                          />
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => addPortToNode(node.id)}
                  className="mt-2 px-2 py-1 border dark:border-white border-black w-full text-white rounded hover:bg-gray-600 text-xs"
                >
                  Add Column
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diagram */}
      <div className="flex-1 flex flex-col">
        <div className="w-full h-full p-4 bg-gray-900 dark:bg-gray-900">
          <Diagram  schema={schema} onChange={onChange} />
        </div>
      </div>
    </div>
  );
};


const TableNode = ({ id, content, data }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 border rounded shadow w-[200px]">
      <h3 className="p-4 text-sm font-bold text-black dark:text-white">{content}</h3>
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
  );
};

export default DiagramDetails;
