export default function StatCard({ label, value, icon, tone='' }) {
  return <div className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><div><p>{label}</p><h3>{value}</h3></div></div>;
}
