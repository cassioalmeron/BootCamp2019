import React, { useState, useEffect, useMemo, useCallback } from "react";

function App() {
  const [tech, setTeck] = useState([]);
  const [newTech, setNewTeck] = useState("");

  // function handleAdd() {
  //   setTeck([...tech, newTech]);
  //   setNewTeck("");
  // }

  // Otimiza a função para ser recreada somente quando tech ou newTech forem alteradas
  const handleAdd = useCallback(() => {
    setTeck([...tech, newTech]);
    setNewTeck("");
  }, [tech, newTech]);

  // com o segundo parâmetro vazio, substitui o ComponentDidMount
  useEffect(() => {
    const storageTech = localStorage.getItem("tech");
    if (storageTech) setTeck(JSON.parse(storageTech));
  }, []);

  // substitui o ComponentDidUpdate
  useEffect(() => {
    localStorage.setItem("tech", JSON.stringify(tech));
  }, [tech]);

  // Para finz de performance, refazer um cálculo apenas quando alterado
  const techSize = useMemo(() => tech.length, [tech]);

  return (
    <>
      <ul>
        {tech.map(t => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <input value={newTech} onChange={e => setNewTeck(e.target.value)} />
      <button type="button" onClick={handleAdd}>
        Adicionar
      </button>

      <br />

      <strong>Você tem {techSize} tecnologias</strong>
    </>
  );
}

export default App;
