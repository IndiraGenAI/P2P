import { IContainerHeaderProps } from "./ContainerHeader.model";

const ContainerHeader = ({ title }: IContainerHeaderProps) => {
  return (
    <div className="rnw-page-heading">
      <h2 className="rnw-page-title">{title}</h2>
    </div>
  );
};

export default ContainerHeader;
