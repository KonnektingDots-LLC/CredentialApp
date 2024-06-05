import { List } from "react-content-loader";

interface Props {
  count?: number;
}
const SkeletonLoader = ({count = 2}: Props) => {
    return (
        <div className="flex flex-col gap-10">
          <List/> 
          {count >= 2 && <List/>}
          {count >= 3 && <List/>}
          {count >= 4 && <List/>}
        </div>
    );
}

export default SkeletonLoader;
