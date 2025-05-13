import "@styles/components/SpecialtyItem.css";

const SpecialtyItem = ({ name, onClick }) => {
  return (
    <div className="specialty-card" onClick={onClick}>
      <h4>{name}</h4>
    </div>
  );
};

export default SpecialtyItem;
