import ReactDataGrid from "react-data-grid";

class ExtDataGrid extends ReactDataGrid {
  componentDidMount() {
    this._mounted = true;
    this.dataGridComponent = document.getElementsByClassName(
      "react-grid-Viewport"
    )[0];

    window.addEventListener("resize", this.metricsUpdated);

    if (this.props.cellRangeSelection) {
      this.dataGridComponent.addEventListener("mouseup", this.onWindowMouseUp);
    }
    this.metricsUpdated();
  }

  componentWillUnmount() {
    this._mounted = false;
    window.removeEventListener("resize", this.metricsUpdated);
    this.dataGridComponent.removeEventListener("mouseup", this.onWindowMouseUp);
  }
}

export default ExtDataGrid;
