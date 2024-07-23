export const barChartDepositsPerPhaseData = (data?: ISaleStats['depositsPerPhase']) => [
  {
    name: "Total Deposits",
    data: [
        {
            x: "Lottery V1",
            y: data?.lv1 || 0,
        },
        {
            x: "Lottery V2",
            y: data?.lv2 || 0,
        },
        {
            x: "Auction V1",
            y: data?.av1 || 0,
        },
        {
            x: "Auction V1",
            y: data?.av2 || 0,
        },
    ],
  },
];

export const barChartDepositsPerPhaseOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
    },
    onDatasetHover: {
      style: {
        fontSize: "12px",
      },
    },
    theme: "dark",
  },
  xaxis: {
    categories: ["Lottery V1", "Lottery V2", "Auction V1", "Auction V2"],
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: "black",
    labels: {
      show: true,
      style: {
        colors: "#CBD5E0",
        fontSize: "14px",
      },
    },
  },
  grid: {
    show: false,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        [
          {
            offset: 0,
            color: "#4318FF",
            opacity: 1,
          },
          {
            offset: 100,
            color: "rgba(67, 24, 255, 1)",
            opacity: 0.28,
          },
        ],
      ],
    },
  },
  dataLabels: {
    enabled: false,
  },

};

export const revenuePerPhaseChartData = (revenuePerPhase?: ISaleStats['revenuePerPhase']) => [
  {
    name: "Revenue",
    data: [revenuePerPhase?.lv1 || 0, 0, 0, 0],
  },
  {
    name: "Revenue",
    data: [0, revenuePerPhase?.lv2 || 0, 0, 0],
  },
  {
    name: "Revenue",
    data: [0, 0, revenuePerPhase?.av1 || 0, 0],
  },
  {
    name: "Revenue",
    data: [0, 0, 0, revenuePerPhase?.av2 || 0],
  },
];

export const participantsPerPhaseChartData = (participantsPerPhase?: ISaleStats['participantsPerPhase']) => [
  {
    name: "Participants",
    data: [participantsPerPhase?.lv1 || 0, 0, 0, 0],
  },
  {
    name: "Participants",
    data: [0, participantsPerPhase?.lv2 || 0, 0, 0],
  },
  {
    name: "Participants",
    data: [0, 0, participantsPerPhase?.av1 || 0, 0],
  },
  {
    name: "Participants",
    data: [0, 0, 0, participantsPerPhase?.av2 || 0],
  },
];

export const revenuePerPhaseOptionsConsumption = {
  chart: {
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
    },
    onDatasetHover: {
      style: {
        fontSize: "12px",
      },
    },
    theme: "dark",
  },
  xaxis: {
    categories: ["Lottery V1", "Lottery V2", "Auction V1", "Auction V2"],
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: "black",
    labels: {
      show: false,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
  },

  grid: {
    borderColor: "rgba(163, 174, 208, 0.3)",
    show: true,
    yaxis: {
      lines: {
        show: false,
        opacity: 0.5,
      },
    },
    row: {
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
          {
            offset: 0,
            color: "#1859ff",
            opacity: 1,
          },
          {
            offset: 100,
            color: "rgb(24,55,255)",
            opacity: 0.28,
          },
      ],
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },

};


