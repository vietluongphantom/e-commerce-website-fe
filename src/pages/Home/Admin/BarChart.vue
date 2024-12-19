<template>
  <div>
    <h3>{{ title }}</h3>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: "Bar Chart"
    },
    xLabel: {
      type: String,
      default: "X Axis"
    },
    yLabel: {
      type: String,
      default: "Y Axis"
    }
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    data: "renderChart"
  },
  methods: {
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      const labels = this.data.map(item => item.x);
      const values = this.data.map(item => item.y);

      this.chartInstance = new Chart(this.$refs.chartCanvas, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: this.title,
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: context => `${context.raw}`
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: this.xLabel
              }
            },
            y: {
              title: {
                display: true,
                text: this.yLabel
              },
              beginAtZero: true
            }
          }
        }
      });
    }
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
};
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
