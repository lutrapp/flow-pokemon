import React, { useState, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, MiniMap, Controls, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css'; // Importando o CSS

const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=100';

const initialNodes = [
  { id: '-1', type: 'input', position: { x: 250, y: 0 }, data: { label: 'Start' } },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    // Fetch the list of all Pokémon
    fetch(POKE_API_URL)
      .then((response) => response.json())
      .then((data) => {
        // Limit to 30 Pokémon
        const limitedPokemon = data.results.slice(0, 30);
        setPokemonList(limitedPokemon);

        // Create nodes for the Pokémon
        const pokemonNodes = limitedPokemon.map((pokemon, index) => ({
          id: (index + 2).toString(), // Ensure unique IDs for nodes
          type: 'default',
          position: { x: 100 + (index % 6) * 200, y: 100 + Math.floor(index / 6) * 150 }, // Arrange nodes in a grid
          data: { label: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) },
        }));
        setNodes((nds) => [...nds, ...pokemonNodes]);

        // Create edges between nodes
        const edgesList = pokemonNodes.map((node, index) => {
          if (index < pokemonNodes.length - 1) {
            return {
              id: `e${index + 2}-${index + 3}`,
              source: node.id,
              target: pokemonNodes[index + 1].id,
              type: 'smoothstep',
            };
          }
          return null;
        }).filter(edge => edge !== null);

        setEdges(edgesList);
      })
      .catch((error) => console.error('Error fetching Pokémon list:', error));
  }, [setEdges, setNodes]);

  // Function to fetch detailed data of selected Pokémon
  const fetchPokemonData = (pokemonName) => {
    if (!pokemonName) return;

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => setPokemonData(data))
      .catch((err) => console.error('Error fetching Pokémon data:', err));
  };

  // Handle node click to show Pokémon details
  const onNodeClick = (event, node) => {
    if (node.id === '-1') return; // Ignore click on the "Start" node

    const pokemonName = node.data.label.toLowerCase(); // Get Pokémon name
    setSelectedPokemon(pokemonName);
    fetchPokemonData(pokemonName);
  };

  return (
    <ReactFlowProvider>
      <div className="container">
        {/* Flow Diagram */}
        <div className="react-flow">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
          >
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>

        {/* Side Panel */}
        <div className="side-panel">
          <h1>Pokémon Details</h1>
          {selectedPokemon ? (
            <div>
              <h3>Pokemon: {selectedPokemon}</h3>
              {pokemonData ? (
                <div>
                  <img src={pokemonData.sprites.front_default} alt={selectedPokemon} />
                  <p><strong>Name:</strong> {pokemonData.name}</p>
                  <p><strong>Height:</strong> {pokemonData.height / 10} m</p>
                  <p><strong>Weight:</strong> {pokemonData.weight / 10} kg</p>
                  <p><strong>Type:</strong> {pokemonData.types.map((typeInfo) => typeInfo.type.name).join(', ')}</p>
                </div>
              ) : (
                <p>Loading data...</p>
              )}
            </div>
          ) : (
            <p>Click on a Pokémon to see details.</p>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;

//old example
// import React, { useCallback, useState } from 'react';
// import ReactFlow, {
//   MiniMap,
//   Controls,
//   Background,
//   addEdge,
//   useNodesState,
//   useEdgesState
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import './App.css'; // Para os estilos personalizados, como a aba lateral

// const initialNodes = [
//   {
//     id: '1',
//     type: 'input',
//     data: { label: 'Start' },
//     position: { x: 250, y: 0 },
//     draggable: true
//   },
//   {
//     id: '2',
//     data: { label: 'Decision A' },
//     position: { x: 100, y: 100 },
//     draggable: true
//   },
//   {
//     id: '3',
//     data: { label: 'Decision B' },
//     position: { x: 400, y: 100 },
//     draggable: true
//   },
//   {
//     id: '4',
//     data: { label: 'Result C' },
//     position: { x: 100, y: 200 },
//     draggable: true
//   },
//   {
//     id: '5',
//     data: { label: 'Result D' },
//     position: { x: 400, y: 200 },
//     draggable: true
//   }
// ];

// const initialEdges = [
//   { id: 'e1-2', source: '1', target: '2' },
//   { id: 'e1-3', source: '1', target: '3' },
//   { id: 'e2-4', source: '2', target: '4' },
//   { id: 'e3-5', source: '3', target: '5' }
// ];

// function App() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [selectedNode, setSelectedNode] = useState(null);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const handleNodeDoubleClick = (event, node) => {
//     setSelectedNode(node);
//     setIsSidebarOpen(true);
//   };

//   const closeSidebar = () => {
//     setIsSidebarOpen(false);
//     setSelectedNode(null);
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       <div style={{ width: '80%', height: '100%' }}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeDoubleClick={handleNodeDoubleClick}
//           fitView
//         >
//           <MiniMap />
//           <Controls />
//           <Background />
//         </ReactFlow>
//       </div>

//       {isSidebarOpen && (
//         <div className="sidebar">
//           <h2>Node Variables</h2>
//           <p>Selected Node ID: {selectedNode?.id}</p>
//           <p>Label: {selectedNode?.data.label}</p>
//           {/* Aqui você pode adicionar inputs para alterar variáveis */}
//           <button onClick={closeSidebar}>Close</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
