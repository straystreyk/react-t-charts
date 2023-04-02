import { IChartOptions, IGraphData, IGrids } from "./chart";

const getMinMax = (graphs: IGraphData[]) => {
  let minX: number | undefined;
  let minY: number | undefined;
  let maxX: number | undefined;
  let maxY: number | undefined;

  graphs.forEach((item) => {
    for (const [x, y] of item.points) {
      if (typeof minY !== "number") minY = y;
      if (typeof maxY !== "number") maxY = y;
      if (typeof minX !== "number") minX = x;
      if (typeof maxX !== "number") maxX = x;

      if (minY > y) minY = y;
      if (minX > x) minX = x;
      if (maxY < y) maxY = y;
      if (maxX < y) maxX = x;
    }
  });

  return {
    minX: minX || 0,
    minY: minY || 0,
    maxX: maxX || 0,
    maxY: maxY || 0,
  };
};

const renderYAxis = ({
  ctx,
  maxY,
  minY,
  VIEW_HEIGHT,
  grids,
  dpiWidth,
  PADDING,
}: {
  ctx: CanvasRenderingContext2D;
  maxY: number;
  minY: number;
  VIEW_HEIGHT: number;
  grids?: IGrids;
  dpiWidth: number;
  PADDING: any;
}) => {
  const rowsCount = grids?.rowsCount || 5;
  const step = VIEW_HEIGHT / rowsCount;
  const textStep = (maxY - minY) / rowsCount;

  ctx.beginPath();
  for (let i = 0; i <= rowsCount; i++) {
    const y = step * i;
    const text = maxY - textStep * i;
    ctx.font = "normal 30px Inter, san-serif";
    ctx.fillText(text.toString(), 0, y + PADDING.bottom);
    if (grids?.enabled) {
      ctx.moveTo(0, y + PADDING.bottom);
      ctx.lineTo(dpiWidth, y + PADDING.bottom);
    }
  }

  ctx.strokeStyle = "#bbb";
  ctx.stroke();
  ctx.closePath();
};

export const drawLine = (
  canvas: HTMLCanvasElement,
  opts: IChartOptions,
  item: IGraphData
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { dpiHeight, dpiWidth, graphs } = opts;
  const { points, grids, padding } = item;
  const PADDING = {
    top: padding?.top || 40,
    bottom: padding?.bottom || 40,
    left: padding?.left || 40,
    right: padding?.right || 40,
  };
  const VIEW_HEIGHT = dpiHeight - PADDING.top - PADDING.bottom;
  const VIEW_WIDTH = dpiWidth;
  const { maxY, maxX, minY, minX } = getMinMax(graphs);
  const yRatio = VIEW_HEIGHT / (maxY - minY);
  const xRatio = VIEW_WIDTH / (maxX - minX);

  // Y AXIS START
  renderYAxis({ ctx, maxY, minY, VIEW_HEIGHT, grids, dpiWidth, PADDING });
  // Y AXIS END

  // X AXIS START
  if (item.name === graphs[0].name && VIEW_HEIGHT && VIEW_WIDTH) {
    ctx.beginPath();
    const data = graphs[0].points;
    const labelsCount = 6 > data.length ? data.length : 6;
    const step = Math.round(data.length / labelsCount);
    const xStep = VIEW_WIDTH / (labelsCount - 1);

    for (let i = 0; i < data.length; i += step) {
      const text = data[i][0].toString();
      const textWidth = ctx.measureText(text).width;
      ctx.font = "normal 30px Inter, san-serif";
      const index = i / step;
      const x =
        index === labelsCount - 1 ? xStep * index - textWidth : xStep * index;
      ctx.fillText(text, x, dpiHeight);
    }
    ctx.closePath();
  }
  // X AXIS END

  // LINE START
  if (VIEW_WIDTH && VIEW_HEIGHT) {
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      ctx.lineTo(
        Math.floor(points[i][0] * xRatio),
        Math.floor(dpiHeight - PADDING.bottom - points[i][1] * yRatio)
      );
    }
    ctx.strokeStyle = item.chart.color || "#000000";
    ctx.stroke();
    ctx.closePath();
  }
  // LINE END
};

export const drawBar = (
  canvas: HTMLCanvasElement,
  opts: IChartOptions,
  item: IGraphData
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { dpiHeight, dpiWidth, graphs } = opts;
  const { points, grids, padding } = item;
  const PADDING = {
    top: padding?.top || 40,
    bottom: padding?.bottom || 40,
    left: padding?.left || 40,
    right: padding?.right || 40,
  };
  const VIEW_HEIGHT = dpiHeight - PADDING.top - PADDING.bottom;
  const VIEW_WIDTH = dpiWidth;
  const { maxY, maxX, minY, minX } = getMinMax(graphs);
  const yRatio = VIEW_HEIGHT / (maxY - minY);
  const xRatio = VIEW_WIDTH / (maxX - minX);

  // Y AXIS START
  renderYAxis({ ctx, maxY, minY, VIEW_HEIGHT, grids, dpiWidth, PADDING });
  // Y AXIS END

  // X AXIS START
  if (item.name === graphs[0].name && VIEW_HEIGHT && VIEW_WIDTH) {
    // ctx.beginPath();
    // const data = graphs[0].points;
    // const labelsCount = 6 > data.length ? data.length : 6;
    // const step = Math.round(data.length / labelsCount);
    // const xStep = VIEW_WIDTH / (labelsCount - 1);
    //
    // for (let i = 0; i < data.length; i += step) {
    //   const text = data[i][0].toString();
    //   const textWidth = ctx.measureText(text).width;
    //   ctx.font = "normal 30px Inter, san-serif";
    //   const index = i / step;
    //   const x =
    //     index === labelsCount - 1 ? xStep * index - textWidth : xStep * index;
    //   ctx.fillText(text, x, dpiHeight);
    // }
    // ctx.closePath();
  }
  // X AXIS END

  // LINE START
  if (VIEW_WIDTH && VIEW_HEIGHT) {
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      ctx.lineTo(
        Math.floor(points[i][0] * xRatio),
        Math.floor(dpiHeight - PADDING.bottom - points[i][1] * yRatio)
      );
    }
    ctx.strokeStyle = item.chart.color || "#000000";
    ctx.stroke();
    ctx.closePath();
  }
  // LINE END
};

export const draw = (canvas: HTMLCanvasElement, opts: IChartOptions) => {
  const { graphs } = opts;

  graphs.forEach((item) => {
    if (item.chart.type === "line") drawLine(canvas, opts, item);
    if (item.chart.type === "bar") drawBar(canvas, opts, item);
  });
};
