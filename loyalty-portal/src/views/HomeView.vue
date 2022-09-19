<template lang="pug">
.home-header-container
  h2 Wellcome to Ownego Loyalty
  p this is dash board page
  //- p Here's what's happened with your program in the last 30 days.
//-   span Or you can choose from
//-     input(
//-       type="date",
//-       v-model="startTime",
//-     )
//-   span to
//-     input(
//-       type="date",
//-       v-model="endTime",
//-     )
//- div(
//-   class="chart-container"
//- )
//-   div(
//-     class="order-chart",
//-   )
//-     Bar(:chart-data="chartOrderData")
//-   div(
//-     class="discount-chart",
//-   )
//-     Bar(:chart-data="chartDiscountData")
//-   div(
//-     class="customer-chart",
//-   )
//-     Bar(:chart-data="chartCustomerData")
//- div(
//-   v-if="isLoading",
//-   class="spinner-info-item",
//- )
//-   Spinner(size="large")
//- div(
//-   v-else,
//-   class="body-container",
//- )
//-   div(
//-     class="content-container",
//-   )
//-     .info-item
//-       h3 {{ user.customer_count }}
//-       p New Customers
//-     .info-item
//-       h3 {{ user.order_count }}
//-       p Orders
//-     .info-item
//-       h3 {{ user.product_count }}
//-       p Products
//-     .info-item
//-       h3 {{ user.discount_count }}
//-       p Discounts Reward
//-     .info-item
//-       h3 {{ user.discount_type_count }}
//-       p Discount types
//-     .info-item
//-       h3 {{ user.collection_count }}
//-       p Collection
//-   div(
//-     class="order-container",
//-   )
//-     .home-order-header
//-       h3 Order
//-     .home-order-content
//-       Layout(v-if="isLoadingOrderTable")
//-         LayoutSection
//-           Card(:sectioned="true")
//-             SkeletonBodyText(:lines="3")
//-           Card(:sectioned="true")
//-             SkeletonBodyText(:lines="3")
//-           Card(:sectioned="true")
//-             SkeletonBodyText(:lines="3")
//-           Card(:sectioned="true")
//-             SkeletonBodyText(:lines="2")
//-       table(
//-         v-else-if="haveOrders",
//-         class="order-table",
//-       )
//-         tr
//-           th Order Id
//-           th Customer Id
//-           th Create At
//-           th Processed  At
//-           th Loyalty Reward
//-         tr(
//-           v-for="(order, index) in orders",
//-           :key="index",
//-         )
//-           td {{ order.order_id }}
//-           td {{ order.customer_id }}
//-           td {{ order.created_at }}
//-           td {{ order.processed_at }}
//-           td {{ order.loyalty_reward || 0 }} points
//-       div(v-else-if="haveSearchTitleFilter")
//-         p Oops! No orders found !!
//-       div(v-else)
//-         p Oops! You have not added any orders yet !!
//-       div(
//-         class="pagination",
//-       )
//-         Button(
//-           :icon="CircleLeftMajor"
//-           @click="getOrderPreviousPage",
//-           :disabled="OrderPreviousPage === 0"
//-         )
//-         Button(
//-           :icon="CircleRightMajor"
//-           @click="getOrderNextPage",
//-           :disabled="OrderNextPage === 0"
//-         )
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import axios from "@/bootstrap/api-interceptor";
import CircleRightMajor from "@shopify/polaris-icons/dist/svg/CircleRightMajor.svg";
import CircleLeftMajor from "@shopify/polaris-icons/dist/svg/CircleLeftMajor.svg";
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


const user = reactive({});
const orders = reactive([]);
const isLoading = ref(false);
const isLoadingOrderTable = ref(false);
const OrderNextPage = ref(0);
const OrderPreviousPage = ref(0);
const limit = ref(8);
const startTime = ref("2022-04-24");
const endTime = ref("2022-05-24");
let searchInterval: number | undefined = undefined;
const chartOrderData = reactive({
  labels: [],
  datasets: [
    {
      label: "Order",
      backgroundColor: "rgb(156,106,222, 0.7)",
      data: [],
    }
  ]
});
const chartDiscountData = reactive({
  labels: [],
  datasets: [
    {
      label: "Discount",
      backgroundColor: "rgb(156,106,222, 0.7)",
      data: [],
    }
  ]
});
const chartCustomerData = reactive({
  labels: [],
  datasets: [
    {
      label: "Customer",
      backgroundColor: "rgb(156,106,222, 0.7)",
      data: [],
    }
  ]
});
const graphOrder = reactive([]);
const graphDiscount = reactive([]);
const graphCustomer = reactive([]);

const haveOrders = computed(() => {
  return orders.length > 0;
});
const getUserGraphData = () => {
  axios.get(`/user/graph?from=${new Date(startTime.value).getTime()/1000}&to=${new Date(endTime.value).getTime()/1000}`).then((data) => {
    graphOrder.splice(0, graphOrder.length);
    graphDiscount.splice(0, graphDiscount.length);
    graphCustomer.splice(0, graphCustomer.length);
    chartOrderData.labels.splice(0, chartOrderData.labels.length);
    chartDiscountData.labels.splice(0, chartDiscountData.labels.length);
    chartCustomerData.labels.splice(0, chartCustomerData.labels.length);
    chartOrderData.datasets[0].data = [];
    chartDiscountData.datasets[0].data = [];
    chartCustomerData.datasets[0].data = [];
    graphOrder.push(...data.order_graph)
    graphDiscount.push(...data.discount_graph)
    graphCustomer.push(...data.customer_graph)
    graphOrder.forEach((order, index) => {
      chartOrderData.labels.push(order.date);
      chartOrderData.datasets[0].data[index] = order.count;
    });
    graphDiscount.forEach((discount, index) => {
      chartDiscountData.labels.push(discount.date);
      chartDiscountData.datasets[0].data[index] = discount.count;
    });
    graphCustomer.forEach((customer, index) => {
      chartCustomerData.labels.push(customer.date);
      chartCustomerData.datasets[0].data[index] = customer.count;
    });
  });
};
const userInfo = () => {
  isLoading.value = true;
  axios
    .get(`/user/details?from=${new Date(startTime.value).getTime()/1000}&to=${new Date(endTime.value).getTime()/1000}`)
    .then((data) => {
      isLoading.value = false;
      Object.assign(user, data)
    })
    .catch((error) => {
      console.log(error);
    });
};
const getOrderList = () => {
  isLoadingOrderTable.value = true;
  axios
    .get(`/orders/filter?limit=${limit.value}`)
    .then((data) => {
      isLoadingOrderTable.value = false;
      orders.push(...data.data);
      OrderPreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
      OrderNextPage.value = data.hasNextPage ? data.hasNextPage : 0;

    })
    .catch((error) => {
      console.log(error);
    });
};
const getOrderPreviousPage = () => {
  isLoadingOrderTable.value = true;
  axios
    .get(
      `/orders/filter?limit=${limit.value}&cursor=${OrderNextPage.value}&link=pre`
    )
    .then((data) => {
      isLoadingOrderTable.value = false;
      orders.splice(0);
      orders.push(...data.data);
      OrderPreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
      OrderNextPage.value = data.hasNextPage ? data.hasNextPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};
const getOrderNextPage = () => {
  isLoadingOrderTable.value = true;
  axios
    .get(
      `/orders/filter?limit=${limit.value}&cursor=${OrderNextPage.value}&link=next`
    )
    .then((data) => {
      isLoadingOrderTable.value = false;
      orders.splice(0);
      orders.push(...data.data);
      OrderPreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
      OrderNextPage.value = data.hasNextPage ? data.hasNextPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};

watch(startTime || endTime, () => {
  clearInterval(searchInterval);
  searchInterval = setTimeout(() => {
    getUserGraphData();
    userInfo();
  }, 2000);
});

userInfo();
getOrderList();
getUserGraphData();
</script>
<style lang="scss">
@import "@/scss/pages/_home-view.scss";
</style>
