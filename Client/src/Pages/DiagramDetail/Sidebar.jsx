/* eslint-disable react/prop-types */
import { useState } from "react";
import { BsCheck, BsFillPlusCircleFill, BsPencil, BsX } from "react-icons/bs";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";

const Sidebar = ({
  addNodeToDiagram,
  schema,
  deleteTable,
  handleTableNameChange,
  handleColumnNameChange,
  deletePort,
  addPortToNode,
  handleColumnDataTypeChange
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const [expandedTables, setExpandedTables] = useState({});

  const [editingTable, setEditingTable] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);

  const toggleTableExpand = (tableId) => {
    setExpandedTables((prev) => ({ ...prev, [tableId]: !prev[tableId] }));
  };


  return (
    <>
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
            {schema?.nodes.map((node) => (
              <div
                key={node.id}
                className="p-2 border rounded-lg border-gray-300 relative"
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
                    <MdDelete
                      className="cursor-pointer text-red-500 text-lg"
                      onClick={() => deleteTable(node.id)}
                    />
                    <span className="overflow-hidden text-wrap w-1/2">
                      {node.content}
                    </span>
                    <div className="flex items-center gap-2">
                      <BsPencil
                        className="cursor-pointer text-blue-400"
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
                  <ul className="mt-2 text-sm space-y-3">
                    {node.data.ports.map((port) => (
                      <li
                        key={port.id}
                        className="flex items-center justify-between "
                        
                      >
                        {editingColumn === port.id ? (
                          <>
                            <div className="flex w-1/2 justify-between gap-1 items-center">
                              <input
                                className="flex-1 w-28 text-black px-2 border rounded"
                                value={port.name}
                                onChange={(e) =>
                                  handleColumnNameChange(e, node.id, port.id)
                                }
                              />
                              <select
                                name="dataType"
                                id="dataType"
                                className="text-black w-10 rounded"
                                onChange={
                                    (e)=> handleColumnDataTypeChange(e, node.id, port.id)
                                }
                              >
                                <option value="Primarykey">Primary Key</option>
                                <option value="Integer">Integer</option>
                                <option value="Float">Float</option>
                                <option value="String">String</option>
                                <option value="Boolean">Boolean</option>
                              </select>
                            </div>

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
                          <div className="flex items-center justify-between w-full">
                            <div className="flex justify-between w-2/3">
                            <p className="text-ellipsis w-1/2 overflow-hidden ">{port.name}</p>
                            <p>{port.type}</p>
                            </div>

                            <div className="flex justify-center gap-2 items-center">
                            <BsPencil
                              className="cursor-pointer text-gray-500"
                              onClick={() => setEditingColumn(port.id)}
                            />
                            <FaDeleteLeft
                              className="cursor-pointer text-orange-500 text-lg"
                              onClick={() => deletePort(node.id, port.id)}
                            />
                            </div>
                          </div>
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
    </>
  );
};

export default Sidebar;
