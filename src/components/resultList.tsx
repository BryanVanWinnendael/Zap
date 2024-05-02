import { useSearch } from "@/context/searchContext";
import ListItem from "./listItem";
import { FixedSizeList as ListWindow } from 'react-window';
import Loading from "./loading";

const List = ({ disk }: { disk: string[] }) => {

  const Column = ({ index, style }: any) => (
    <div style={style}><ListItem key={index} name={disk[index][0]} type={disk[index][1]}/></div>
  );

  return (
    <ListWindow
    height={500}
    itemCount={disk.length}
    itemSize={70}
    width="100%"
    style={{
      height: "100%",
    }}
  >
    {Column}
  </ListWindow>
  )
}

const ResultList = () => {
  const { loading, results } = useSearch();

  return (
    <div className="h-full rounded-md">
      {
        loading ? <Loading />
        :
        <div className="w-full h-full overflow-x-hidden">
          {
            Object.keys(results).map((disk, index) => (
              <List disk={results[disk]} key={index} />
            ))
          }
        </div>
      }
      
    </div>
  )
}

export default ResultList