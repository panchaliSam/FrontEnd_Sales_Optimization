import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

interface ChartThreeState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut"
  },
  colors: ["#3C50E0", "#6577F3"],
  labels: ["Credit Card", "Cash"],
  legend: {
    show: false,
    position: "bottom"
  },

  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent"
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380
        }
      }
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200
        }
      }
    }
  ]
};

const ChartThree = ({
  paymentMethodData,
  paymentMethodsPercentage
}) => {
  const [state, setState] = useState<ChartThreeState>({
    series: paymentMethodsPercentage
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      series: paymentMethodsPercentage
    }));
  };
  handleReset;
  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-12">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Payment Methods{" "}
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {paymentMethodData.map((item) => {
          return (
            <div className="sm:w-1/2 w-full px-8">
              <div className="flex w-full items-center">
                <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
                <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                  <span>{item["Payment Method"]}</span>
                  <span>{(item.Percentage).toFixed(2) + '%'}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartThree;
