/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Diagram, useSchema } from "beautiful-react-diagrams";
import { BsFillPlusCircleFill, BsPencil, BsCheck, BsX } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";

const DiagramDetails = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedTables, setExpandedTables] = useState({});
  const [schema, { onChange, addNode, removeNode }] = useSchema({
    nodes: (JSON.parse(localStorage.getItem("diagram-schema"))?.nodes || []).map(
      (node, index) => ({
        ...node,
        id: node.id || `node-${index + 1}`, 
        content: node.content || `Table ${index + 1}`,
        coordinates: node.coordinates || [250, 150], 
        data: {
          ports: node.data?.ports || [
            { id: `port-${Math.random()}`, name: "Primary Key", type: "input" },
          ],
        },
        render: node.render || TableNode, 
      })
    ),
  });
  
  const [editingTable, setEditingTable] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);

  useEffect(() => {
    localStorage.setItem("diagram-schema", JSON.stringify(schema));
  }, [schema]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const addNodeToDiagram = () => {
    const newNode = {
      id: `node-${schema.nodes.length + 1}`,
      content: `Table ${schema.nodes.length + 1}`,
      coordinates: [250, 250],
      data: {
        ports: [
          { id: `port-${Math.random()}`, name: "Primary Key", type: "input" },
        ],
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

  const toggleTableExpand = (tableId) => {
    setExpandedTables((prev) => ({ ...prev, [tableId]: !prev[tableId] }));
  };

  const deleteTable = (nodeId) => {
    const updatedNodes = schema.nodes.filter((node) => node.id !== nodeId);
    onChange({ ...schema, nodes: updatedNodes });
  };

  const deletePort = (nodeId, portId) => {
    const updatedNodes = schema.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              ports: node.data.ports.filter((port) => port.id !== portId),
            },
          }
        : node
    );
    onChange({ ...schema, nodes: updatedNodes });
  };

  const handleRightClick = (e, callback) => {
    e.preventDefault();
    callback();
  };

  return (
    <div className="flex min-h-screen bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 transform hideScroll ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out shadow-md`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-bold">Schema Design</h2>
          <button
            onClick={toggleSidebar}
            className={`p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white absolute right-0 `}
          >
            {isSidebarOpen ? (
              <MdKeyboardArrowLeft size={24} />
            ) : (
              <MdKeyboardArrowRight size={24} />
            )}
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
              <div
                key={node.id}
                className="p-2 border rounded-lg border-gray-300 relative"
                onContextMenu={(e) =>
                  handleRightClick(e, () => deleteTable(node.id))
                }
              >
                {/* Table Name */}
                {editingTable === node.id ? (
                  <div className="flex gap-2 items-center w-full">
                    <input
                      className="w-2/3 px-2 border rounded dark:bg-gray-700 bg-gray-300 text-black dark:text-white"
                      value={node.content}
                      onChange={(e) => handleTableNameChange(e, node.id)}
                    />
                    <div className="flex items-center justify-center">
                      <BsCheck
                        className="text-2xl cursor-pointer text-green-500"
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
                    <div className="flex items-center gap-2">
                      <BsPencil
                        className="cursor-pointer text-gray-500"
                        onClick={() => setEditingTable(node.id)}
                      />
                      <button onClick={() => toggleTableExpand(node.id)}>
                        {expandedTables[node.id] ? (
                          <MdKeyboardArrowUp size={20} />
                        ) : (
                          <MdKeyboardArrowDown size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Columns */}
                {expandedTables[node.id] && (
                  <ul className="mt-2 text-sm">
                    {node.data.ports.map((port) => (
                      <li
                        key={port.id}
                        className="flex items-center justify-between"
                        onContextMenu={(e) =>
                          handleRightClick(e, () =>
                            deletePort(node.id, port.id)
                          )
                        }
                      >
                        {editingColumn === port.id ? (
                          <>
                            <input
                              className="flex-1 w-20 text-black px-2 border rounded"
                              value={port.name}
                              onChange={(e) =>
                                handleColumnNameChange(e, node.id, port.id)
                              }
                            />
                            <select  name="dataType" id="dataType" className="text-black w-10">
                              <option value="Primarykey">Primary Key</option>
                              <option value="Primarykey">Integer</option>
                              <option value="Primarykey">Float</option>
                              <option value="Primarykey">String</option>
                              <option value="Primarykey">Boolean</option>
                            </select>

                           
                            <div className="flex text-2xl gap-2 justify-between items-center">
                              <BsCheck
                                className="ml-2 cursor-pointer text-green-500"
                                onClick={() => setEditingColumn(null)}
                              />
                              <BsX
                                className="ml-2 cursor-pointer text-red-500"
                                onClick={() => setEditingColumn(null)}
                              />
                            </div>
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
                )}
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
          <Diagram schema={schema} onChange={onChange} />
        </div>
      </div>
    </div>
  );
};

const TableNode = ({ id, content, data }) => {
  return (
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
  );
};

export default DiagramDetails;
