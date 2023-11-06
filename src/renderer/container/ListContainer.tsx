import React from "react";
import "./listContainer.css";
import { listItem } from "../types/common.odt";
import { useStore } from "../tools/store";
import ListItem from "../components/ListItem";

// Define a function component called ListContainer
const ListContainer = () => {
  const list: listItem[] = useStore((state) => state.list);
  const setList = useStore((state) => state.setList);
  const listComponent = list.map((item: listItem, index: number) => {
    return <ListItem item={item} key={index + item.id}/>;
  });
  
  return <div className="listContainer">
    {listComponent}
  </div>;
};

// Export the ListContainer component as the default export of this module
export default ListContainer;