import { GridStack } from "gridstack";
import { AppletName } from "./types";

export let findWidgetElement = (name: AppletName, grid: GridStack): HTMLElement => {
    // can not make use of Utils.find() since it holds stale DOM references during drag
    return grid.el.querySelector(`[gs-id="${name}"]`) as HTMLElement;
};