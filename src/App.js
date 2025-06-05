import React from "react";
import RoutesWrapper from "./Routes";
import "./styles/main.scss";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

function App() {
  const { contentData } = useSelector((state) => state.content);

  return (
    <div className="">
      <Helmet>
        <meta
          name="description"
          content={contentData.descriptionSEO || "Default description"}
        />
        <meta
          name="keywords"
          content={contentData.keywordSEO || "default, keywords"}
        />
      </Helmet>
      <RoutesWrapper />
    </div>
  );
}

export default App;
