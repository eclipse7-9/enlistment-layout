import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "../context/AlertContext";

const COMMENTS_KEY = "ph_comments_v1";

const Comments = () => {
  const { showAlert } = useAlert();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COMMENTS_KEY);
      if (raw) setComments(JSON.parse(raw));
    } catch (e) {
      setComments([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    } catch (e) {
      // ignore
    }
  }, [comments]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      showAlert?.({ type: "warning", message: "Por favor completa nombre y comentario." });
      return;
    }

    const newComment = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      created_at: new Date().toISOString(),
      synced: false,
    };

    setSubmitting(true);

    // Try to POST to backend, fallback to saving local
    try {
      await axios.post("http://127.0.0.1:8000/comentarios", {
        nombre: newComment.name,
        mensaje: newComment.message,
      });
      newComment.synced = true;
      showAlert?.({ type: "success", message: "Comentario enviado. Gracias!" });
    } catch (err) {
      // If no backend or error, keep local and warn user
      showAlert?.({ type: "info", message: "Comentario guardado localmente (sin conexión con backend)." });
    }

    setComments((c) => [newComment, ...c]);
    setName("");
    setMessage("");
    setSubmitting(false);
  };

  return (
    <section className="bg-[#f7f6f2] border-t border-[#d8c6aa] py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-[#7a8358] mb-4">Comentarios y sugerencias</h2>
        <p className="text-sm text-gray-700 mb-6">Déjanos tu opinión sobre la plataforma, servicios o cualquier idea que tengas. ¡Nos ayuda a mejorar!</p>

        <form onSubmit={submitComment} className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-3 py-2 border border-[#d8c6aa] rounded-lg outline-none"
            />
            <input
              value={""}
              readOnly
              className="hidden"
            />
          </div>

          <div className="mb-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu comentario aquí..."
              rows={4}
              className="w-full px-3 py-2 border border-[#d8c6aa] rounded-lg outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Puedes dejar comentarios públicos sobre tu experiencia.</div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#7a8358] text-white rounded-lg hover:bg-[#69724c] disabled:opacity-60"
            >
              {submitting ? "Enviando..." : "Enviar comentario"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-gray-600">No hay comentarios aún. Sé el primero en opinar.</div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <strong className="text-[#4e5932]">{c.name}</strong>
                  <span className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <p className="text-gray-700 mt-2 whitespace-pre-line">{c.message}</p>
                {!c.synced && <div className="text-xs text-yellow-600 mt-2">No sincronizado con servidor</div>}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Comments;
