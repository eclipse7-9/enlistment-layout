import React, { useState } from "react";
import "../styles/ProductsAdmin.css";

const initialProducts = [
  {
    id: 1,
    title: "Productos",
    description:
      "Encuentra productos de cuidado, comida y utensilios para todo tipo de animales de campo.",
    img: "https://i0.wp.com/www.solla.com/wp-content/uploads/2022/02/sollapro.png?fit=391%2C527&ssl=1",
    link: "productos.html",
    btnText: "Ver productos",
  },
  {
    id: 2,
    title: "Servicios médicos",
    description: "Atención veterinaria especializada.",
    img: "https://a.storyblok.com/f/160385/2fafa27955/veterinarios.jpg",
    link: "#",
    btnText: "Servicios médicos",
  },
];

const AdminProducts = () => {
  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    img: "",
    link: "",
    btnText: "",
  });

  // Eliminar producto
  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Editar producto
  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    const updatedTitle = prompt("Editar título:", product.title);
    const updatedDesc = prompt("Editar descripción:", product.description);
    if (updatedTitle && updatedDesc) {
      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, title: updatedTitle, description: updatedDesc } : p
        )
      );
    }
  };

  // Agregar producto
  const handleAdd = () => {
    if (
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.img ||
      !newProduct.btnText
    ) {
      alert("Completa todos los campos");
      return;
    }
    setProducts([
      ...products,
      { ...newProduct, id: Date.now(), link: newProduct.link || "#" },
    ]);
    setNewProduct({ title: "", description: "", img: "", link: "", btnText: "" });
  };

  return (
    <section className="admin-products">
      <h2>Administrar Productos</h2>

      {/* Formulario agregar producto */}
      <div className="add-product-form">
        <input
          type="text"
          placeholder="Título"
          value={newProduct.title}
          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="URL Imagen"
          value={newProduct.img}
          onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })}
        />
        <input
          type="text"
          placeholder="Texto botón"
          value={newProduct.btnText}
          onChange={(e) => setNewProduct({ ...newProduct, btnText: e.target.value })}
        />
        <input
          type="text"
          placeholder="Link (opcional)"
          value={newProduct.link}
          onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
        />
        <button onClick={handleAdd}>Agregar Producto</button>
      </div>

      {/* Lista de productos */}
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.img} alt={product.title} />
            <p>
              <b>{product.title}</b>
              <br />
              {product.description}
            </p>
            {product.link !== "#" && (
              <a href={product.link}>
                <button>{product.btnText}</button>
              </a>
            )}
            <button onClick={() => handleEdit(product.id)}>Editar</button>
            <button onClick={() => handleDelete(product.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminProducts;
