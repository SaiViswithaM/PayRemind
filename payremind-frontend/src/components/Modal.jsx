export default function Modal({ title, children, onClose }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-header"><h3>{title}</h3><button className="icon-btn" onClick={onClose}>×</button></div>{children}</div></div>;
}
