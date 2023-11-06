import React, { useEffect } from "react";
import "./app.css";
import Head from "./components/Head";
import ListContainer from "./container/ListContainer";
import ResultContainer from "./container/ResultContainer";
import { useStore } from "./tools/store";
import { listItem } from "./types/common.odt";
import AddContainer from "./container/AddContainer";

const App = () => {
  const setList = useStore((state) => state.setList);
  const addPageFlag: boolean = useStore((state) => state.addPageFlag);

  useEffect(() => {
    // get list from chrome storage
    const getListFromStorage = async () => {
      const storedList: listItem[] = (await chrome.storage.local.get("list"))
        .list as listItem[];
      console.log(storedList);
      if (storedList) {
        setList(storedList);
      }
    };
    getListFromStorage();
  }, []);

  return (
    <div className="app">
      <Head />
      <ListContainer />
      {addPageFlag ? <AddContainer /> : <ResultContainer />}
    </div>
  );
};

export default App;
