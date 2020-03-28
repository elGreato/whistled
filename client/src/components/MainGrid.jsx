import React, { Component } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { NavBar } from "./NavBar";
import { Provider } from "rendition";
import { GridCard } from "./DashboardGridStyles";
import { layouts, breakpoints, cols } from "./gridLayout";

class MainGrid extends Component {

  render() {
    const ResponsiveGridLayout = WidthProvider(Responsive);

    return (
      <Provider>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={breakpoints}
          cols={cols}
          isDraggable={true}
          margin={[40, 50, 10, 20]}
          // FIXME rowHeight should be dynamic; it depends on the window height of each device
          rowHeight={100}
        ></ResponsiveGridLayout>
      </Provider>
    );
  }
}

export default MainGrid;
