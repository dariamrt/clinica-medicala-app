import React from "react";
import "@styles/layout/EditableField.css";

const EditableField = ({ label, value, isEditing, onChange, name }) => {
  const isValid = value && value.trim().length > 0;

  return (
    <div className="editable-field">
      <label className="field-label">{label}:</label>
      {isEditing ? (
        <input
          type="text"
          className={`field-input ${isValid ? "valid" : "invalid"}`}
          name={name}
          value={value}
          onChange={onChange}
        />
      ) : (
        <span className="field-value">{value || "N/A"}</span>
      )}
    </div>
  );
};

export default EditableField;
