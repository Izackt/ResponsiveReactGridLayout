import React, { useEffect, useState, useRef } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import _ from "lodash";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || [];
const originalItems = getFromLS("items") || [];

const DashboardSystemWithHooks = ({
  rowHeight = 60,
  draggableCancel = ".cancelDrag",
  ...props
}) => {
  const [layouts, setLayouts] = useState(originalLayouts);
  const [items, setItems] = useState(
    [].map(function (i, key, list) {
      return {
        i: i.toString(),
        x: i * 2,
        y: 0,
        w: 2,
        h: 2,
        add: i === list.length - 1
      };
    })
  );
  const [breakpoints, setBreakpoints] = useState({
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0
  });
  const [cols, setCols] = useState({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 });
  const [count, setCount] = useState(getFromLS("count") || 0);
  const firstLoad = useRef(true);

  useEffect(() => {
    // Do something here :O
    console.log(`changed`);
    if (firstLoad.current) {
      console.log("hit");
      firstLoad.current = false;
      setLayouts(getFromLS("layouts") || []);
      setItems(getFromLS("items") || []);
    }
  }, []);

  const createElement = (el) => {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer"
    };
    const i = el.add ? "+" : el.i;
    return (
      <div key={i} data-grid={el}>
        {el.add ? (
          <span
            className="add text"
            onClick={onAddItem}
            title="You can add an item by clicking here, too."
          >
            Add +
          </span>
        ) : (
          <button className="text">{i}</button>
        )}
        <span
          className="remove"
          style={removeStyle}
          onClick={() => onRemoveItem(i)}
        >
          x
        </span>
      </div>
    );
  };

  const onLayoutChange = (_items) => {
    console.log(`layout changed`);
    console.log(items);
    saveToLS("layouts", layouts, "items", _items, "count", count);
  };

  // We're using the cols coming back from this to calculate where to add new items.
  const onBreakpointChange = (breakpoint, cols) => {
    console.log(`breakpoint hit`);
    setBreakpoints(breakpoints);
    setCols(cols);
  };

  const onAddItem = () => {
    /*eslint no-console: 0*/
    console.log("adding", "n" + items.length + 1);
    const addToCount = count + 1;
    setCount(addToCount);
    setItems((previous) => [
      ...previous,
      {
        i: `n${addToCount}`,
        x: (items.length * 2) % (cols || 12),
        y: -1, // puts it at the bottom
        w: 2,
        h: 2
      }
    ]);
  };

  const onRemoveItem = (i) => {
    console.log("removing", i);
    const filtered = items.filter((item) => item.i !== i);
    console.log(filtered);
    setItems(items.filter((item) => item.i !== i));
  };

  return (
    <div>
      {/* <button onClick={() => this.resetLayout()}>Reset Layout</button> */}
      <button onClick={onAddItem}>Add Item</button>
      <ResponsiveReactGridLayout
        className="layout"
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        layouts={{ breakpoints }}
        onLayoutChange={onLayoutChange}
        draggableCancel=".cancelDrag"
        onBreakpointChange={onBreakpointChange}
        {...props}
      >
        {items?.map((el) => createElement(el))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(Lkey, Lvalue, Ikey, Ivalue, Xkey, Xvalue) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [Lkey]: Lvalue,
        [Ikey]: Ivalue,
        [Xkey]: Xvalue
      })
    );
  }
}

export default DashboardSystemWithHooks;
