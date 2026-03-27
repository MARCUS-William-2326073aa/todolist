import logo from './logo.jpeg';
import React, { useState } from 'react';
import './App.css';
import datas from './cfg/datas.json';
import Header from './Header';
import Footer from './Footer';

let oui = 0;
let tkt = 0;

function App() {
  const [k, setK] = useState(0);
  const [allTasks, setAllTasks] = useState([]);
  const [allCats, setAllCats] = useState([]);
  const [allRels, setAllRels] = useState([]);
  const [hasData, setHasData] = useState(false);

  // Filtres
  const [filter, setFilter] = useState("En cours");
  const [filterFolderId, setFilterFolderId] = useState(null);
  const [sortBy, setSortBy] = useState("title");

  // States création
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskCats, setNewTaskCats] = useState([]);
  const [newCatName, setNewCatName] = useState("");

  // States UI
  const [openedKey, setOpenedKey] = useState(null);
  const [editingKey, setEditingKey] = useState(null);

  function Button() {
    oui = (oui === 0) ? 1 : 0;
    if (tkt === 0) { ouioui(); tkt = 1; }
  }

  function ouioui() {
    setInterval(() => {
      if (oui === 1) {
        const randomColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
        document.documentElement.style.setProperty('--main-bg-color', randomColor);
      }
    }, 10);
  }

  const isTooOld = (dateStr) => {
    if (!dateStr) return false;
    const limit = new Date();
    limit.setDate(limit.getDate() - 7);
    return new Date(dateStr) < limit;
  };

  const handleImportButtonClick = () => {
    if (!hasData) {
      setAllTasks(datas.tasks);
      setAllCats(datas.categories);
      setAllRels(datas.relations);
      setHasData(true);
    }
    setK(1);
  };

  const handleStartZero = () => {
    setAllTasks([]);
    setAllCats([]);
    setAllRels([]);
    setHasData(true);
    setK(1);
  };

  const updateTask = (id, field, value) => {
    setAllTasks(allTasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addTask = () => {
    if (!newTaskName) return;
    const newId = Date.now();
    setAllTasks([...allTasks, {
      id: newId,
      title: newTaskName,
      description: "",
      etat: "Nouveau",
      date_creation: new Date().toISOString(),
      date_echeance: newTaskDate
    }]);
    if (newTaskCats.length > 0) {
      const newRels = newTaskCats.map(catId => ({ tache: newId, categorie: parseInt(catId) }));
      setAllRels([...allRels, ...newRels]);
    }
    setNewTaskName(""); setNewTaskDate(""); setNewTaskCats([]);
  };

  const addFolder = () => {
    if (!newCatName) return;
    const id = Date.now();
    setAllCats([...allCats, { id, title: newCatName, color: "#"+Math.floor(Math.random()*16777215).toString(16).padStart(6, '0') }]);
    setNewCatName("");
  };

  const toggleCatSelection = (catId) => {
    setNewTaskCats(prev => prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]);
  };

  if (k !== 0) {
    return (
        <div className="App">
          <Header onHome={() => setK(0)} />

          <section className="">

            <div style={{ background: "rgba(0,0,0,0.4)", padding: "15px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.8em", color: "white" }}>
              <div style={{borderBottom: "1px solid #666", paddingBottom: "10px", marginBottom: "10px"}}>
                <strong>Nouveau Dossier: </strong>
                <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Nom..." />
                <button onClick={addFolder}>Créer</button>
              </div>

              <div>
                <strong>Nouvelle Tâche: </strong>
                <input value={newTaskName} onChange={e => setNewTaskName(e.target.value)} placeholder="Titre..." />
                <input type="date" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)} />
                <div style={{marginTop: "10px"}}>
                  <span>Dossiers (optionnel): </span>
                  {allCats.map(c => (
                      <label key={c.id} style={{marginRight: "10px", cursor: "pointer", color: c.color}}>
                        <input type="checkbox" checked={newTaskCats.includes(c.id)} onChange={() => toggleCatSelection(c.id)} /> {c.title}
                      </label>
                  ))}
                </div>
                <button onClick={addTask} style={{marginTop: "10px", width: "100%", padding: "5px", background: "#4caf50", color: "white"}}>Ajouter la tâche</button>
              </div>
            </div>

            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
              Filtre: <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="Tous">Toutes</option>
              <option value="En cours">En cours</option>
              <option value="Reussi">Réussi</option>
            </select>
              Tri: <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="title">Nom</option>
              <option value="date_echeance">Expiration</option>
            </select>
              {filterFolderId && <button onClick={() => setFilterFolderId(null)} style={{background: "orange"}}>Voir tous les dossiers</button>}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>

              {/* --- SECTION SANS DOSSIER (Corrigée pour la lisibilité) --- */}
              {allTasks.filter(t => !allRels.some(r => r.tache === t.id)).length > 0 && !filterFolderId && (
                  <div style={{
                    border: "2px dashed #888",
                    padding: "15px",
                    width: "280px",
                    borderRadius: "10px",
                    background: "rgba(0,0,0,0.3)", // Fond sombre ajouté
                    color: "white"
                  }}>
                    <h2 style={{ color: "#bbb" }}>Sans Dossier</h2>
                    <ul style={{ textAlign: "left", listStyle: "none", padding: 0 }}>
                      {allTasks.filter(t => !allRels.some(r => r.tache === t.id)).map(task => (
                          <TaskItem
                              key={task.id}
                              task={task}
                              catId={0}
                              openedKey={openedKey} setOpenedKey={setOpenedKey}
                              editingKey={editingKey} setEditingKey={setEditingKey}
                              updateTask={updateTask}
                              allCats={allCats}
                              allRels={allRels}
                              setFilterFolderId={setFilterFolderId}
                              deleteTask={(id) => setAllTasks(allTasks.filter(x => x.id !== id))}
                          />
                      ))}
                    </ul>
                  </div>
              )}

              {allCats.filter(c => filterFolderId ? c.id === filterFolderId : true).map(cat => {
                const taskIds = allRels.filter(r => r.categorie === cat.id).map(r => r.tache);
                let tasksInCat = allTasks.filter(t => taskIds.includes(t.id));

                tasksInCat = tasksInCat.filter(t => {
                  if (isTooOld(t.date_echeance)) return false;
                  if (filter === "En cours") return t.etat !== "Reussi" && t.etat !== "Abandoné";
                  if (filter !== "Tous") return t.etat === filter;
                  return true;
                }).sort((a, b) => {
                  if (sortBy === "title") return a.title.localeCompare(b.title);
                  return new Date(a[sortBy]) - new Date(b[sortBy]);
                });

                return (
                    <div key={cat.id} style={{ border: `2px solid ${cat.color}`, padding: "15px", width: "280px", borderRadius: "10px", background: "rgba(0,0,0,0.1)", position: "relative" }}>
                      <button onClick={() => setAllCats(allCats.filter(c => c.id !== cat.id))} style={{ position: "absolute", top: "5px", right: "5px", background: "none", border: "none", cursor: "pointer" }}>🗑️</button>
                      <h2 style={{ color: cat.color }}>{cat.title}</h2>
                      <ul style={{ textAlign: "left", listStyle: "none", padding: 0 }}>
                        {tasksInCat.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                catId={cat.id}
                                openedKey={openedKey} setOpenedKey={setOpenedKey}
                                editingKey={editingKey} setEditingKey={setEditingKey}
                                updateTask={updateTask}
                                allCats={allCats}
                                allRels={allRels}
                                setFilterFolderId={setFilterFolderId}
                                deleteTask={(id) => setAllTasks(allTasks.filter(x => x.id !== id))}
                            />
                        ))}
                      </ul>
                    </div>
                );
              })}
            </div>
            <button onClick={Button} style={{marginTop: "20px"}}>ouiouibaguette</button>
          </section>
          <Footer />
        </div>
    );
  }

  return (
      <div className="App">
        <Header onHome={() => setK(0)} />
        <section className="">
          <div style={{marginTop: "20px", display: "flex", gap: "10px"}}>
            <button className="import" onClick={handleImportButtonClick}>{hasData ? "continuer session" : "import backup"}</button>
            <button className="zero" onClick={handleStartZero}>start from nothing</button>
          </div>
        </section>
        <Footer />
      </div>
  );
}

function TaskItem({ task, catId, openedKey, setOpenedKey, editingKey, setEditingKey, updateTask, allCats, allRels, setFilterFolderId, deleteTask }) {
  const uniqueKey = `${catId}-${task.id}`;
  const isOpen = openedKey === uniqueKey;
  const isEditing = editingKey === uniqueKey;

  const myCatIds = allRels.filter(r => r.tache === task.id).map(r => r.categorie);
  const myCats = allCats.filter(c => myCatIds.includes(c.id));

  return (
      <li style={{ marginBottom: "10px", borderBottom: "1px solid #444", paddingBottom: "5px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
                <span onClick={() => { setOpenedKey(isOpen ? null : uniqueKey); setEditingKey(null); }} style={{cursor: "pointer", marginRight: "8px", color: "white"}}>
                    {isOpen ? "▼" : "▶"}
                </span>
          <strong style={{flex: 1, color: task.etat === "Reussi" ? "#4caf50" : "white"}}>{task.title}</strong>
          <button onClick={() => deleteTask(task.id)} style={{background:"none", border:"none", cursor:"pointer", fontSize:"0.7em"}}>🗑️</button>
        </div>

        <div style={{marginTop: "5px"}}>
          {(isOpen ? myCats : myCats.slice(0, 2)).map(c => (
              <span key={c.id} onClick={() => setFilterFolderId(c.id)} style={{fontSize: "0.6em", background: c.color, padding: "2px 5px", borderRadius: "5px", marginRight: "3px", cursor: "pointer", color: "white"}}>
                        {c.title}
                    </span>
          ))}
        </div>

        {isOpen && (
            <div style={{ background: "#eee", color: "#222", padding: "10px", marginTop: "10px", borderRadius: "5px", fontSize: "0.8em", position: "relative" }}>
              <button onClick={() => setEditingKey(isEditing ? null : uniqueKey)} style={{ position: "absolute", right: "5px", top: "5px" }}>
                {isEditing ? "💾" : "📝"}
              </button>

              {isEditing ? (
                  <div style={{display: "flex", flexDirection: "column", gap: "5px", marginTop: "15px"}}>
                    <input value={task.title} onChange={e => updateTask(task.id, 'title', e.target.value)} />
                    <textarea value={task.description} onChange={e => updateTask(task.id, 'description', e.target.value)} placeholder="Description..." />
                    <input type="date" value={task.date_echeance} onChange={e => updateTask(task.id, 'date_echeance', e.target.value)} />
                    <select value={task.etat} onChange={e => updateTask(task.id, 'etat', e.target.value)}>
                      <option value="Nouveau">Nouveau</option>
                      <option value="En attente">En attente</option>
                      <option value="Reussi">Réussi</option>
                      <option value="Abandoné">Abandonné</option>
                    </select>
                  </div>
              ) : (
                  <div style={{marginTop: "10px"}}>
                    <p><strong>Description:</strong> {task.description || "Aucune description"}</p>
                    <p><strong>État:</strong> {task.etat}</p>
                    <p><strong>Echéance:</strong> {task.date_echeance || "Aucune"}</p>
                  </div>
              )}
            </div>
        )}
      </li>
  );
}

export default App;