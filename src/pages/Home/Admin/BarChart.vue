<template>
  <div class="chart-container">
    <h3>{{ title }}</h3>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart :data="chartData">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          :dataKey="xKey"
          :label="{ value: xLabel, position: 'insideBottom', offset: -5 }"
          :tickFormatter="formatXAxisValue"
        />
        <YAxis 
          :label="{ value: yLabel, angle: -90, position: 'insideLeft' }"
          :tickFormatter="formatYAxisValue"
        />
        <Tooltip 
          :formatter="formatTooltipValue"
          :labelFormatter="formatXAxisValue"
        />
        <Legend />
        <Bar
    :dataKey="yKey"
    fill="#8884d8"
    :activeBar="{ fill: '#413ea0' }"
  />
      </BarChart>
    </ResponsiveContainer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  xKey: {
    type: String,
    required: true
  },
  yKey: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Biểu Đồ'
  },
  xLabel: {
    type: String,
    default: 'X'
  },
  yLabel: {
    type: String,
    default: 'Y'
  },
  formatXAxis: {
    type: Function,
    default: (value) => value
  }
})

// Dữ liệu biểu đồ với key được điều chỉnh
const chartData = computed(() => 
  props.data.map(item => ({
    [props.xKey]: props.formatXAxis ? props.formatXAxis(item[props.xKey]) : item[props.xKey],
    [props.yKey]: item[props.yKey]
  }))
)

// Format tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value)
}

// Format giá trị trục X
const formatXAxisValue = (value) => {
  return props.formatXAxis ? props.formatXAxis(value) : value
}

// Format giá trị trục Y
const formatYAxisValue = (value) => {
  return formatCurrency(value)
}

// Phần cuối của script trong BarChart.vue
// Format tooltip
const formatTooltipValue = (value) => {
  return formatCurrency(value)
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>