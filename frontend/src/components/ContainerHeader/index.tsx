interface ContainerHeaderProps {
  title: string;
}

const ContainerHeader = ({ title }: ContainerHeaderProps) => (
  <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>
    {title}
  </h2>
);

export default ContainerHeader;
