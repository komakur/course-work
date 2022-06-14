import styles from "./styles.module.scss";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  PieChart,
  Line,
  CartesianAxis,
  Text,
  Dot,
  Cell,
  Label,
  Pie,
} from "recharts";
import Dropdown from "../dropdown";
import {
  clientHours,
  graphDataIsForChart,
  graphDatatype,
} from "../../../core/types";
import classNames from "classnames";
import { generateRandomColor } from "../../../core/utils";
import { useState, useEffect } from "react";
import Legend from "../legend";

interface Props {
  type: "area" | "line" | "pie";
  lineType?: "monotone" | "linear";
  data: graphDatatype;

  className?: string;

  contentDirection?: "horizontal" | "vertical";

  title: string;
  subtitle: string;

  someBigText?: string;

  withDropdown?: boolean;
  dropdownValue?: number;

  hideAxis?: boolean;
  hideGrid?: boolean;
  hideTooltip?: boolean;

  showDots?: boolean;
  exportPdf?: boolean;

  strokeWidth?: number;

  onDropdownChange?: (value: string) => void;
}

const Chart: React.FC<Props> = ({
  data,
  type,
  title,
  subtitle,
  className,
  withDropdown,
  dropdownValue,
  onDropdownChange,
  strokeWidth,
  showDots,
  hideAxis,
  hideGrid,
  hideTooltip,
  lineType = "monotone",
  contentDirection = "vertical",
  someBigText,
  exportPdf,
}) => {
  const [pieColors, setPieColors] = useState<string[]>([]);

  useEffect(() => {
    setPieColors(data.map(() => generateRandomColor()));
  }, [data]);

  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <AreaChart
            data={data}
            margin={{
              top: 25,
              left: -25,
              bottom: 0,
            }}
          >
            {!hideGrid && <CartesianGrid vertical={false} />}
            {!hideAxis && (
              <>
                <XAxis
                  dataKey="name"
                  padding={{
                    left: 25,
                  }}
                />
                <YAxis />
              </>
            )}

            {!hideTooltip && <Tooltip />}

            {Object.keys(data[0]).map((key) => {
              const color = generateRandomColor();

              return (
                key !== "name" && (
                  <Area
                    key={color}
                    type={lineType}
                    dataKey={key}
                    stroke={color}
                    fill={color}
                  />
                )
              );
            })}
          </AreaChart>
        );

      case "line":
        return (
          <LineChart
            data={data}
            margin={{
              top: 25,
              left: -25,
              bottom: 0,
            }}
          >
            {!hideGrid && <CartesianGrid vertical={false} />}
            {!hideAxis && (
              <>
                <XAxis
                  dataKey="name"
                  padding={{
                    left: 5,
                  }}
                  tickLine={false}
                />
                <YAxis tickLine={false} />
              </>
            )}
            {!hideTooltip && <Tooltip />}

            {Object.keys(data[0]).map((key) => {
              const color = generateRandomColor();

              return (
                key !== "name" && (
                  <Line
                    key={key}
                    type={lineType}
                    dataKey={key}
                    dot={showDots ? <Dot /> : (null as unknown as undefined)}
                    stroke={color}
                    strokeWidth={strokeWidth}
                  />
                )
              );
            })}
          </LineChart>
        );
      default:
        return null;
    }
  };

  const renderPieChart = () =>
    graphDataIsForChart(data) && (
      <>
        <ResponsiveContainer width={181} height={181}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={65}
              outerRadius={90.5}
            >
              <Label
                content={(props) => {
                  const fontSize = 16;

                  const {
                    /*  @ts-ignore  */
                    viewBox: { cx, cy },
                  } = props;
                  const positioningPropsValue = {
                    x: cx,
                    y: cy - fontSize,
                    textAnchor: "middle",
                    verticalAnchor: "middle",
                  };

                  const positioningPropsText = {
                    x: cx,
                    y: cy + fontSize / 2,
                    textAnchor: "middle",
                    verticalAnchor: "middle",
                  };
                  return (
                    <>
                      {/*  @ts-ignore  */}
                      <Text {...positioningPropsValue}>{`${Math.round(
                        data.reduce((prev, curr) => prev + curr.value, 0)
                      )}`}</Text>
                      {/*  @ts-ignore  */}
                      <Text {...positioningPropsText}>Working Hours</Text>
                    </>
                  );
                }}
              />

              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.legends}>
          {data.map((entry, index) => (
            <Legend
              key={entry.companyName}
              name={entry.companyName}
              value={entry.value}
              color={pieColors[index]}
            />
          ))}
        </div>
      </>
    );

  return (
    <div
      className={classNames(
        styles["graph-container"],
        className,
        styles[contentDirection],
        styles[type]
      )}
    >
      <div className={styles["graph-head"]}>
        <div className={styles["text-container"]}>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        {withDropdown && (
          <Dropdown
            className={styles.dropdown}
            type="dropdown-graph"
            onItemClick={() => {
              return;
            }}
          />
        )}
      </div>
      {someBigText && <div className={styles["big-text"]}>{someBigText}</div>}
      {type !== "pie" ? (
        <ResponsiveContainer height={"95%"}>
          {renderChart()}
        </ResponsiveContainer>
      ) : (
        renderPieChart()
      )}
      {exportPdf && (
        <button className={styles["export-pdf"]}>Export pdf</button>
      )}
    </div>
  );
};

export default Chart;
