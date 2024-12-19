<template>
    <div>
      <canvas ref="myChart"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto'; // Import Chart.js
  
  export default {
    name: 'PieChart',
    props: {
      chartData: { // Nhận dữ liệu biểu đồ từ component cha
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        chartInstance: null, // Lưu instance của biểu đồ
      };
    },
    watch: {
      chartData: {
        handler(newVal) {
          this.createChart(newVal); // Gọi hàm tạo biểu đồ khi dữ liệu thay đổi
        },
        deep: true, // Theo dõi sự thay đổi sâu bên trong object
      },
    },
    mounted() {
      this.createChart(this.chartData); // Tạo biểu đồ lần đầu khi component được mount
    },
    beforeUnmount() {
        if (this.chartInstance) {
            this.chartInstance.destroy(); // Hủy biểu đồ khi component bị unmount để tránh memory leak
        }
    },
    methods: {
      createChart(data) {
          if (!data || Object.keys(data).length === 0) {
              // Không làm gì nếu dữ liệu rỗng
              return;
          }
  
          const labels = Object.keys(data);
          const values = Object.values(data);
  
          if (this.chartInstance) {
              this.chartInstance.destroy(); // Hủy biểu đồ cũ trước khi vẽ biểu đồ mới
          }
        const ctx = this.$refs.myChart.getContext('2d');
  
        this.chartInstance = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: [ // Mảng màu cho các phần của biểu đồ
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1
            }],
          },
          options: {
              responsive: true,
              maintainAspectRatio: false, // Đảm bảo biểu đồ có thể tự điều chỉnh kích thước
            plugins: {
              legend: {
                  display: true,
                  position: 'bottom'
              },
              title:{
                  display: true,
                  text: "Thống kê đơn hàng theo địa chỉ",
                  font: {
                      size: 16
                  }
              }
            }
          }
        });
      },
    },
  };
  </script>
  <style scoped>
  canvas {
      max-height: 400px; /* Hoặc chiều cao bạn muốn */
  }
  </style>