import React, { useState } from "react";
import { RecordForm } from "../components/RecordForm.jsx";
import { RecordsTable } from "../components/RecordsTable.jsx";

export function CrudPage({ title, description, storageKey, fields, records, setRecords }) {
  const [editingRecord, setEditingRecord] = useState(null);

  function handleSave(formData) {
    if (editingRecord) {
      setRecords((currentRecords) =>
        currentRecords.map((record) =>
          record.id === editingRecord.id ? { ...formData, id: editingRecord.id } : record
        )
      );
      setEditingRecord(null);
      return;
    }

    setRecords((currentRecords) => [
      ...currentRecords,
      {
        ...formData,
        id: `${storageKey}-${crypto.randomUUID()}`
      }
    ]);
  }

  function handleDelete(id) {
    const shouldDelete = window.confirm("Deseja excluir este registro?");
    if (shouldDelete) {
      setRecords((currentRecords) => currentRecords.filter((record) => record.id !== id));
    }
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">CRUD completo</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>

      <RecordForm
        fields={fields}
        editingRecord={editingRecord}
        onSave={handleSave}
        onCancel={() => setEditingRecord(null)}
        usedImageUrls={records
          .filter((record) => record.id !== editingRecord?.id)
          .map((record) => record.imageUrl)}
      />

      {records.some((record) => record.imageUrl) && (
        <div className="product-gallery">
          {records.map((record) => (
            <article key={record.id} className="product-card">
              <img src={record.imageUrl} alt={record.name} />
              <div>
                <strong>{record.name}</strong>
                <span>{Number(record.price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <RecordsTable
        fields={fields}
        records={records}
        editingId={editingRecord?.id}
        onEdit={setEditingRecord}
        onDelete={handleDelete}
      />
    </section>
  );
}
