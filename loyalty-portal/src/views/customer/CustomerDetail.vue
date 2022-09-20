<template lang="pug">
div(
  v-if="isLoading",
  class="spinner-info-item",
)
  Spinner(size="large")
div(
  v-else,
  class="customer-detail-view"
)
  div(
    class="customer-header-content"
  )
    Button(
      :icon="MobileChevronMajor"
      @click="$router.push({name: 'customer-list'})",
    )
    h2 {{ customer.first_name }} {{ customer.last_name }}
  .customer-time-in
    p Customer for about {{ customer.time_in }} days
  
  .customer-detail-container 
    .left-container
      .general-info 
        .general-info-title
          h3 General
        .general-info-content
          .general-info-item
            h4 {{ customer.loyalty_point }}
            p Loyalty Points
          .general-info-item
            h4 {{ customer.discount_count }} 
            p Discounts
          .general-info-item
            h4 {{ customer.order_count }}
            p Orders
      .detail-order-info 
        .order-info-title
          h3 Order 
        Layout(v-if="isLoadingOrder")
          LayoutSection
            Card(:sectioned="true")
              SkeletonBodyText(:lines="3")
            Card(:sectioned="true")
              SkeletonBodyText(:lines="3")
            Card(:sectioned="true")
              SkeletonBodyText(:lines="2")
        table(v-else-if="haveOrders")
          tr
            th Order Id
            th Create At
            th Processed At
            th Loyalty Reward 
          tr(
            v-for="(order, index) in orders",
            :key="index",
          )
            td {{ order.order_id }}
            td {{ order.created_at }}
            td {{ order.processed_at }}
            td {{ order.loyalty_reward || 0 }} points
        div(v-else-if="haveSearchTitleFilter")
          p Oops! No orders found !!
        div(v-else)
          p Oops! {{ customer.first_name }} {{ customer.last_name }} have not added any orders yet !!
        div(
          class="pagination",
        )
          Button(
            :icon="CircleLeftMajor"
            @click="getOrderPreviousPage",
            :disabled="OrderPreviousPage === 0"
          )
          Button(
            :icon="CircleRightMajor"
            @click="getOrderNextPage",
            :disabled="OrderNextPage === 0"
          )
    .customer-info-and-discount
      .detail-customer-info
        .detail-customer-info-title
          h3 Customer
        .customer-info-item 
          h4 Customer Shopify ID
          p {{ customer.customer_id }}
        .customer-info-item 
          h4 Customer Email
          p {{ customer.email }}
        .customer-info-item
          h4 Customer Phone 
          p {{ customer.phone || "Null" }}
        .customer-info-item
          h4 Loyalty Points 
          p {{ customer.loyalty_point || 0 }} point(s)
      .detail-discount-info
        .discount-info-title
          h3 Discount
        Layout(v-if="isLoadingDiscount")
          LayoutSection
            Card(:sectioned="true")
              SkeletonBodyText(:lines="3")
            Card(:sectioned="true")
              SkeletonBodyText(:lines="3")
            Card(:sectioned="true")
              SkeletonBodyText(:lines="2")
        table(v-else-if="haveDicounts")
          tr
            th Code
            th Description
            th End At 
          tr(
            v-for="(discount, index) in discounts",
            :key="index",
          )
            td {{ discount.code }}
            td {{ discount.description }}
            td {{ discount.ends_at || 0 }}
        div(v-else-if="haveSearchTitleFilter")
          p Oops! No discount found !!
        div(v-else)
          p Oops! {{ customer.first_name }} {{ customer.last_name }} have not added any discount yet !!
        div(
          class="pagination",
        )
          Button(
            :icon="CircleLeftMajor"
            @click="getDiscountPreviousPage",
            :disabled="DiscountPreviousPage === 0"
          )
          Button(
            :icon="CircleRightMajor"
            @click="getDiscountNextPage",
            :disabled="DiscountNextPage === 0"
          )
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "@/bootstrap/api-interceptor";
import MobileChevronMajor from "@shopify/polaris-icons/dist/svg/MobileChevronMajor.svg";
import CircleRightMajor from "@shopify/polaris-icons/dist/svg/CircleRightMajor.svg";
import CircleLeftMajor from "@shopify/polaris-icons/dist/svg/CircleLeftMajor.svg";
const id = ref("");
const customer = reactive({});
const orders = reactive([]);
const discounts = reactive([]);
const isLoading = ref(false);
const isLoadingOrder = ref(false);
const isLoadingDiscount = ref(false);
const OrderPreviousPage = ref(0);
const OrderNextPage = ref(0);
const DiscountPreviousPage = ref(0);
const DiscountNextPage = ref(0);
const limit = ref(5);

const route = useRoute();

const haveOrders = computed(() => {
  return orders.length > 0;
});
const haveDicounts = computed(() => {
  return discounts.length > 0;
});
const customerInfo = () => {
  isLoading.value = true;
  axios
    .get(`/customers/${id.value}/details`)
    .then((data) => {
      isLoading.value = false;
      Object.assign(customer, data);
      customer.time_in = getTimeIn(customer.created_at);
    })
    .catch((error) => {
      console.log(error);
    });
};
const customerOrdersInfo = () => {
  isLoadingOrder.value = true;
  axios
    .get(`/customers/${id.value}/orders/filter?limit=${limit.value}`)
    .then((data) => {
      isLoadingOrder.value = false;
      orders.push(...data.data);
      OrderPreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
      OrderNextPage.value = data.hasNextPage ? data.hasNextPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};
const getOrderPreviousPage = () => {
  isLoadingOrder.value = true;
  axios
    .get(
      `/customers/${id.value}/orders/filter?limit=${limit.value}&cursor=${OrderPreviousPage.value}&link=prev`
    )
    .then((data) => {
      isLoadingOrder.value = false;
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
  isLoadingOrder.value = true;
  axios
    .get(
      `/customers/${id.value}/orders/filter?limit=${limit.value}&cursor=${OrderNextPage.value}&link=next`
    )
    .then((data) => {
      isLoadingOrder.value = false;
      orders.splice(0);
      orders.push(...data.data);
      OrderPreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
      OrderNextPage.value = data.hasNextPage ? data.hasNextPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};
const customerDiscountsInfo = () => {
  isLoadingDiscount.value = true;
  axios
    .get(`/customers/${id.value}/discounts/filter?limit=${limit.value}`)
    .then((data) => {
      isLoadingDiscount.value = false;
      discounts.push(...data.data);
      DiscountPreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
      DiscountNextPage.value = data.hasNextPage ? data.hasNextPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getDiscountPreviousPage = () => {
  isLoadingDiscount.value = true;
  axios
    .get(
      `/customers/${id.value}/discounts/filter?limit=${limit.value}&cursor=${DiscountPreviousPage.value}&link=prev`
    )
    .then((data) => {
      isLoadingDiscount.value = false;
      discounts.splice(0);
      discounts.push(...data.data);
      DiscountPreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
      DiscountNextPage.value = data.hasNextPage ? data.hasNextPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};
const getDiscountNextPage = () => {
  isLoadingDiscount.value = true;
  axios
    .get(
      `/customers/${id.value}/discounts/filter?limit=${limit.value}&cursor=${DiscountNextPage.value}&link=next`
    )
    .then((data) => {
      isLoadingDiscount.value = false;
      discounts.splice(0);
      discounts.push(...data.data);
      DiscountPreviousPage.value = data.hasPreviousPage ? data.hasPreviousPage : 0;
      DiscountNextPage.value = data.hasNextPage ? data.hasNextPage : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getTimeIn = (created_at) => {
  const time = new Date(created_at);
  const now = new Date();
  const diff = now.getTime() - time.getTime();
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays;
};
id.value = route.params.id.split("/").at(-1);
customerInfo();
customerOrdersInfo();
customerDiscountsInfo();
</script>
<style lang="scss">
@import "@/scss/pages/customer/_customer-detail.scss";
</style>
