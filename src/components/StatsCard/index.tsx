import CardUI from "../UI/Card";
interface StatsCardProps {
  title: string;
  value: number | string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  className = "",
}) => (
  <CardUI className={`bg-white p-6 rounded-lg shadow ${className}`}>
    <h3 className="text-lg font-medium text-gray-500">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </CardUI>
);

export default StatsCard;
