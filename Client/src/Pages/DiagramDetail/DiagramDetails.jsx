/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { Diagram, useSchema } from "beautiful-react-diagrams";
import Sidebar from "./Sidebar";
import TableNodeComponent from "./TableNodeComponent";

const DiagramDetails = () => {
  const [schema, { onChange, addNode, removeNode }] = useSchema({
    nodes: (
      JSON.parse(localStorage.getItem("diagram-schema"))?.nodes || []
    ).map((node, index) => ({
      ...node,
      id: node.id || `node-${index + 1}`,
      content: node.content || `Table ${index + 1}`,
      coordinates: node.coordinates || [250, 150],
      data: {
        ports: node.data?.ports || [
          { id: `port-${Math.random()}`, name: "Primary Key", type: "input" },
        ],
      },
      links: [],
      render: node.render || TableNodeComponent,
    })),
  });

  const handleLinkConnect = ({ input, output }) => {
    const newLink = {
      input,   
      output,   
      relation: "one-to-one", 
    };
    onChange({ ...schema, links: [...schema.links, newLink] });
  };

  useEffect(() => {
    localStorage.setItem("diagram-schema", JSON.stringify(schema));
  }, [schema]);

  const addNodeToDiagram = () => {
    const newNode = {
      id: `node-${schema.nodes.length + 1}`,
      content: `Table ${schema.nodes.length + 1}`,
      coordinates: [250, 250],
      data: {
        ports: [
          { id: `port-${Math.random()}`, name: "Name", type: "Integer" },
        ],
      },
      render: TableNodeComponent,
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
                  type: "Primarykey",
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

  const handleColumnDataTypeChange = (e, nodeId, columnId) => {
    const newColumnType = e.target.value;
    const updatedNodes = schema.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              ports: node.data.ports.map((port) =>
                port.id === columnId ? { ...port, type: newColumnType } : port
              ),
            },
          }
        : node
    );
    onChange({ ...schema, nodes: updatedNodes });
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

  return (
    <div className="flex min-h-screen bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
      {/* Sidebar */}
      <Sidebar
        schema={schema}
        addNodeToDiagram={addNodeToDiagram}
        deleteTable={deleteTable}
        handleTableNameChange={handleTableNameChange}
        handleColumnNameChange={handleColumnNameChange}
        deletePort={deletePort}
        addPortToNode={addPortToNode}
        handleColumnDataTypeChange={handleColumnDataTypeChange}
      />

      {/* Diagram */}
      <div className="flex-1 flex flex-col">
        <div className="w-full h-full p-4 bg-gray-900 dark:bg-gray-900">
          <Diagram schema={schema} onChange={onChange}  onLinkConnect={handleLinkConnect} />
        </div>
      </div>
    </div>
  );
};

export default DiagramDetails;
