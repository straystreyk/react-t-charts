import { FC, useCallback, useEffect, useRef, useState } from "react";
import { draw } from "./utils";

export interface IGrids {
  enabled?: boolean;
  rowsCount?: number;
}

export interface IChartProps {
  type: "line" | "bar";
  color?: string;
}
export interface IGraphData {
  chart: IChartProps;
  name: string;
  points: [number, number][];
  grids?: IGrids;
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export interface IChartOptions {
  width?: number;
  height: number;
  dpiWidth: number;
  dpiHeight: number;
  graphs: IGraphData[];
}

export const Chart: FC<{
  chartId?: string;
  options: Omit<IChartOptions, "dpiWidth" | "dpiHeight" | "width">;
}> = ({ chartId = "chart", options }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [opts, setOpts] = useState<IChartOptions>({
    width: 0,
    height: options.height,
    dpiWidth: 0,
    dpiHeight: options.height * 2,
    graphs: options.graphs,
  });

  const handleResize = useCallback(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const width = canvas.clientWidth;
    const dpiWidth = width * 2;

    canvas.width = dpiWidth;
    canvas.height = options.height * 2;

    setOpts((p) => ({ ...p, width, dpiWidth }));
    draw(canvas, { ...opts, width, dpiWidth });
  }, [opts, options.height]);

  useEffect(() => {
    // INIT!!!!!!!
    if (!ref.current) return;
    const canvas = ref.current;
    const width = canvas.clientWidth;
    const dpiWidth = width * 2;

    canvas.width = dpiWidth;
    canvas.height = options.height * 2;

    setOpts((p) => ({ ...p, width, dpiWidth }));
  }, [options.height]);

  useEffect(() => {
    if (!ref.current) return;
    draw(ref.current, opts);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [opts, handleResize]);

  if (!opts.graphs[0].points.length) return null;

  return (
    <canvas
      style={{
        width: "100%",
        height: opts.height,
      }}
      ref={ref}
      id={chartId}
    ></canvas>
  );
};
