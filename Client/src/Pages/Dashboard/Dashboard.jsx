import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const fetchProjects = async () => {

  return [
    { id: 1, name: "ER Diagram Tool", description: "Build and edit ER diagrams." },
    { id: 2, name: "CRM System", description: "Manage customer relationships." },
    { id: 3, name: "Task Manager", description: "Organize and track your tasks." },
    { id: 4, name: "Portfolio Website", description: "Showcase your portfolio." },
    { id: 5, name: "E-commerce Platform", description: "Sell and buy products online." },
    { id: 6, name: "Chat App", description: "Real-time communication tool." },
  ];
};

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects();
      setProjects(data);
    };
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Projects</h1>
      <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;
