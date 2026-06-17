import React, { useEffect, useMemo, useState } from "react";
import { getRandomProductPhoto } from "../services/productPhotoApi.js";

export function RecordForm({ fields, editingRecord, onSave, onCancel, usedImageUrls = [] }) {
  const emptyRecord = useMemo(
    () =>
      fields.reduce((accumulator, field) => {
        accumulator[field.name] = field.options?.[0]?.value || "";
        return accumulator;
      }, {}),
    [fields]
  );

  const [formData, setFormData] = useState(emptyRecord);
  const [error, setError] = useState("");
  const hasImageField = fields.some((field) => field.name === "imageUrl");

  useEffect(() => {
    setFormData(editingRecord || emptyRecord);
    setError("");
  }, [editingRecord, emptyRecord]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  }

  async function handleRandomPhoto() {
    const imageUrl = await getRandomProductPhoto(usedImageUrls, formData.imageUrl);
    setFormData((currentData) => ({ ...currentData, imageUrl }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const missingField = fields.find((field) => field.required && !String(formData[field.name] || "").trim());

    if (missingField) {
      setError(`Preencha o campo: ${missingField.label}.`);
      return;
    }

    onSave(formData);
    setFormData(emptyRecord);
    setError("");
  }

  return (
    <form className={editingRecord ? "form-panel editing" : "form-panel"} onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <span>{editingRecord ? "Modo edicao" : "Novo cadastro"}</span>
          <strong>{editingRecord ? "Atualize os dados do registro selecionado" : "Preencha os campos obrigatorios"}</strong>
        </div>
        {editingRecord && <small>ID: {editingRecord.id}</small>}
      </div>

      <div className="form-grid">
        {fields.map((field) => (
          <label key={field.name} className="field">
            <span>{field.label}</span>
            {field.type === "select" ? (
              <select name={field.name} value={formData[field.name] || ""} onChange={handleChange}>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                type={field.type}
                min={field.min}
                step={field.step}
                value={formData[field.name] || ""}
                onChange={handleChange}
              />
            )}
          </label>
        ))}
      </div>

      {formData.imageUrl && (
        <div className="image-preview">
          <span>Previa do produto</span>
          <img src={formData.imageUrl} alt={formData.name || "Previa do produto"} />
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="button-row">
        {hasImageField && (
          <button type="button" className="secondary-button" onClick={handleRandomPhoto}>
            Gerar foto aleatoria
          </button>
        )}
        <button type="submit" className="primary-button">
          {editingRecord ? "Salvar alteracoes" : "Cadastrar"}
        </button>
        {editingRecord && (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancelar edicao
          </button>
        )}
      </div>
    </form>
  );
}
