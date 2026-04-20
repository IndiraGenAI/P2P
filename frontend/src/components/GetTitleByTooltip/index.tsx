import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import { MOBILE } from "src/constants/ThemeSetting";

const GetTitleByTooltip = (props:{title: string}) =>{
    const {
        title
      } = props;
    const ContainerHeader = ({ title }: {title: string}) => {
        const width = useSelector(({ common }: any) => common.width);
        const getTitle = ()=>{
          if(title.length > 55){
            return (<> {`${title.slice(0, 55)}...`} <a className="view-more-heading">View More</a></>)
          }
          return title;  
        }
        if (width < MOBILE) {
          return (
            <>
              <Tooltip title={title}>
                <span>
                  {getTitle()}
                </span>
              </Tooltip>
            </>
          );
        } else {
          return <span>{title}</span>;
        };
        }
            return(
                <>
                    <ContainerHeader title={title} />
                </>
            )
}
export default GetTitleByTooltip;