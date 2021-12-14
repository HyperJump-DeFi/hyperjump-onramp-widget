import React from "react";
import Header from "../common/Header";
import List from "../common/ListFiat";
import styles from "../styles.module.css";

import { ItemType } from "../ApiContext";

interface PickViewProps {
  title: string;
  items: ItemType[];
  onItemClick?: (name: string, index: number, item: ItemType) => void;
  name?: string;
  searchable?: boolean;
}

const PickViewFiat: React.FC<PickViewProps> = (props) => {
  const { title, items, name = "", searchable = false } = props;
  const { onItemClick = () => null } = props;
  return (
    <main className={styles.view}>
      <Header backButton title={title} />
      <List
        onItemClick={(index, item) => onItemClick(name, index, item)}
        items={items}
        searchable={searchable}
      />
    </main>
  );
};

export default PickViewFiat;
