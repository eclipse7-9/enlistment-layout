import React from "react";

const ManualUsuario = () => (
  <div style={{ height: "100vh" }}>
    <iframe
      src="http://localhost:8000/manual/index.html"
      title="Manual de Usuario"
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  </div>
);

export default ManualUsuario;
