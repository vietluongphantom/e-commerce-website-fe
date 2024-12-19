// services/fetchStatistics.js

export const fetchStatistics = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/statistics/orders");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return { cancelledOrders: 0, completedOrders: 0 };
    }
  };
  