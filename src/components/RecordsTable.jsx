import React from "react";

export function RecordsTable({ fields, records, editingId, onEdit, onDelete }) {
  if (records.length === 0) {
    return <p className="empty-state">Nenhum registro cadastrado ainda.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {fields.map((field) => (
              <th key={field.name}>{field.label}</th>
            ))}
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className={editingId === record.id ? "selected-row" : ""}>
              {fields.map((field) => (
                <td key={field.name}>{formatValue(record, field)}</td>
              ))}
              <td className="actions-cell">
                <button type="button" className="table-button" onClick={() => onEdit(record)}>
                  Editar
                </button>
                <button type="button" className="table-button danger" onClick={() => onDelete(record.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatValue(record, field) {
  const value = record[field.name];

  if (field.name === "imageUrl") {
    return (
      <div className="product-thumb">
        <img src={value} alt={record.name || "Produto"} />
      </div>
    );
  }

  if (field.type === "select") {
    return field.options.find((option) => option.value === value)?.label || "Nao informado";
  }

  if (field.name === "price") {
    return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return value;
}
