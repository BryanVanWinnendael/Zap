import ListItem from "./listItem"

const RecentList = () => {
  const recents = localStorage.getItem('recents')

  if (recents) {
    const parsed = JSON.parse(recents)
    return (
      <div className="overflow-y-auto">
        {parsed.map((item: {name: string, type: string}, index: number) => (
          <ListItem name={item.name} type={item.type} key={index} />
        ))}
     </div>
    )
  
  }
 
}

export default RecentList