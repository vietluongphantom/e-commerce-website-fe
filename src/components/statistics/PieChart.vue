<template>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, watch } from "vue";
  import { Chart, registerables } from "chart.js";
  
  Chart.register(...registerables);
  
  export default defineComponent({
    props: {
      chartData: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const canvas = ref(null);
      let chartInstance = null;
  
      const renderChart = () => {
        if (chartInstance) chartInstance.destroy(); // Xóa chart cũ nếu tồn tại
        chartInstance = new Chart(canvas.value, {
          type: "pie",
          data: props.chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      };
  
      watch(
        () => props.chartData,
        () => {
          renderChart(); // Render lại chart khi dữ liệu thay đổi
        },
        { deep: true }
      );
  
      return {
        canvas,
      };
    },
  });
  </script>
  
  <style scoped>
  canvas {
    max-width: 500px;
    max-height: 500px;
  }
  </style>
  