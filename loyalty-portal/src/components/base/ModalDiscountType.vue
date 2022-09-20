<template lang="pug">
Modal(
  v-if="props.secondaryAction",
  :open="active",
  @close="toggleActive",
  :primaryAction="{ content: props.primaryAction, onAction: onHandlePrimaryAction }"
  :secondaryActions="[{ content: props.secondaryAction, onAction: onHandleSecondaryAction },]",
)
  template(#activator)
    Button( 
      @click="toggleActive",
    ) {{ props.primaryAction }}
  template(#title)
    h2 {{ props.content }}
  template(#content)
    .container
      div(class="f-row")
        div(class="f-col col-12")
          div(class="f-row margin-top-1")
            label(for="name", class="col-12") Name:
          div(class="f-row")
            input(type="text", name="name", class="col-12 input-name", v-model="props.discountType.name", placeholder="Enter a discount name")
            div(class="f-row")
      div(class="f-col col-12")
        div(class="f-row")
          label(for="description", class="col-12") Description:
        div(class="f-row")
          textarea( name="description", maxlength=255 class="col-12 input-textaria" v-model="props.discountType.description")
      div(class="f-row")
        div(class="f-col col-6")
          div(class="f-row")
            label(for="description", class="col-10") Apply to:
          div(class="f-row")
            select(
              name="apply-to",
              id="apply-to",
              class="col-10 select-apply-to",
              v-model="selectApplyTo",
            )
              option(value="prerequisite") Prerequisite
              option(value="all") All
        div(class="f-col col-6")
          div(class="f-row")
            label(for="loyalty-price", class="col-12") Loyalty Price:
          div(class="f-row")
            input(type="number", name="loyalty-price", class="col-12 input-number", v-model="props.discountType.loyalty_price")
      div(class="f-row")
        div(class="f-col col-6")
          div(class="f-row")
            label(for="description", class="col-10") Type:
          div(class="f-row")
            select(
              name="apply-to",
              id="apply-to",
              class="col-10 select-apply-to",
              v-model="selectDiscountOption",
            )
              option(value="fix-amount") Fix Amount
              option(value="percentage") Percentage
        div(class="f-col col-6")
          div(class="f-row")
            label(v-if="isSelectFixAmount" for="amount-off", class="col-12") Amount off ({{ currency }}):
            label(v-else, for="percentage-off", class="col-12") Percentage off (%):
          div(class="f-row")
            input(type="number", name="loyalty-price", class="col-12 input-number", v-model="discountValue")
      div(class="f-row") 
        div( class="f-col col-12")
          div(class="f-row")
            label(for="time-limit", class="col-12") Time Limit:
          div(class="f-row ")
            div(class="f-row col-4 p-1 align-center")
              div(class="f-row col-4") Day:
              div(class="f-row col-8")
                input(type="number", min="0", name="date", class="col-10", v-model="datetime.date")
            div(class="f-row col-4 p-1 align-center")
              div(class="f-row col-4") Hour:
              div(class="f-row col-8")
                input(type="number", min="0", name="hour", class="col-10", v-model="datetime.hour")
            div(class="f-row col-4 p-1 align-center")
              div(class="f-row col-4") Minute:
              div(class="f-row col-8")
                input(type="number", min="0", name="minute", class="col-10", v-model="datetime.minute")
      div(class="f-row")
        div(class="f-col col-12")
          div(class="f-row")
            label(for="status", class="col-1") Status:
            TextStyle(
              v-if="props.discountType.status === 1",
              variation="positive",
            ) {{ discountStatus(props.discountType) }}
            TextStyle(
              v-else,
              variation="negative",
            ) {{ discountStatus(props.discountType) }}
        
Modal(
  v-else,
  :open="active",
  @close="toggleActive",
  :primaryAction="{ content: props.primaryAction, onAction: onHandlePrimaryAction }",
  :secondaryActions="[]",
)
  template(#activator)
    Button( 
      @click="toggleActive",
    ) {{ props.primaryAction }}
  template(#title)
    h2 {{ props.content }}
  template(#content)
    .container
      div(class="f-row")
        div(class="f-col col-12")
          div(class="f-row margin-top-1")
            label(for="name", class="col-12") Name:
          div(class="f-row")
            input(type="text", name="name", class="col-12 input-name", v-model="props.discountType.name", placeholder="Enter a discount name")
            div(class="f-row")
      div(class="f-col col-12")
        div(class="f-row")
          label(for="description", class="col-12") Description:
        div(class="f-row")
          textarea( name="description", maxlength=255 class="col-12 input-textaria" v-model="props.discountType.description")
      div(class="f-row")
        div(class="f-col col-6")
          div(class="f-row")
            label(for="description", class="col-10") Apply to:
          div(class="f-row")
            select(
              name="apply-to",
              id="apply-to",
              class="col-10 select-apply-to",
              v-model="selectApplyTo",
            )
              option(value="prerequisite") Prerequisite
              option(value="all") All
        div(class="f-col col-6")
          div(class="f-row")
            label(for="loyalty-price", class="col-12") Loyalty Price:
          div(class="f-row")
            input(type="number", name="loyalty-price", class="col-12 input-number", v-model="props.discountType.loyalty_price")
      div(class="f-row")
        div(class="f-col col-6")
          div(class="f-row")
            label(for="description", class="col-10") Type:
          div(class="f-row")
            select(
              name="apply-to",
              id="apply-to",
              class="col-10 select-apply-to",
              v-model="selectDiscountOption",
            )
              option(value="fix-amount") Fix Amount
              option(value="percentage") Percentage
        div(class="f-col col-6")
          div(class="f-row")
            label(v-if="isSelectFixAmount" for="amount-off", class="col-12") Amount off ({{ currency }}):
            label(v-else, for="percentage-off", class="col-12") Percentage off (%):
          div(class="f-row")
            input(type="number", name="loyalty-price", class="col-12 input-number", v-model="discountValue")
      div(class="f-row") 
        div( class="f-col col-12")
          div(class="f-row")
            label(for="time-limit", class="col-12") Time Limit:
          div(class="f-row ")
            div(class="f-row col-4 p-1 align-center")
              div(class="f-row col-4") Day:
              div(class="f-row col-8")
                input(type="number", min="0", name="date", class="col-10", v-model="datetime.date")
            div(class="f-row col-4 p-1 align-center")
              div(class="f-row col-4") Hour:
              div(class="f-row col-8")
                input(type="number", min="0", name="hour", class="col-10", v-model="datetime.hour")
            div(class="f-row col-4 p-1 align-center")
              div(class="f-row col-4") Minute:
              div(class="f-row col-8")
                input(type="number", min="0", name="minute", class="col-10", v-model="datetime.minute")
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import axios from "@/bootstrap/api-interceptor";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
const props = defineProps([
  "discountType",
  "primaryAction",
  "secondaryAction",
  "content",
]);
const datetime = reactive({
  date: 0,
  hour: 0,
  minute: 0,
});
const active = ref(false);
const discountValue = ref(0);
const selectDiscountOption = ref("fix-amount");
const selectApplyTo = ref("all");
const router = useRouter();
const auth = useAuthStore();
const currency = ref("");

auth.getUser().then(() => {
  currency.value = auth.user?.currency || "";
});
const toggleActive = () => {
  active.value = !active.value;
};

const discountStatus = (discount: { status: number }) => {
  if (discount.status === 1) {
    return "Active";
  }
  return "Inactive";
};

const isSelectFixAmount = computed(() => {
  return selectDiscountOption.value === "fix-amount";
});
const changeTimeLimit = () => {
  datetime.date = Math.floor(props.discountType.time_limit / (24 * 3600));
  datetime.hour = Math.floor(
    (props.discountType.time_limit % (24 * 3600)) / 3600
  );
  datetime.minute = Math.floor((props.discountType.time_limit % 3600) / 60);
};
const createDiscountType = () => {
  axios
    .post(`/price-rule-molds`, {
      name: props.discountType.name,
      customer_selection: selectApplyTo.value,
      discount_amount:
        selectDiscountOption.value === "fix-amount"
          ? discountValue.value
          : null,
      discount_percentage:
        selectDiscountOption.value === "percentage"
          ? discountValue.value
          : null,
      description: props.discountType.description,
      loyalty_price: props.discountType.loyalty_price,
      time_limit:
        datetime.date * 24 * 60 * 60 +
        datetime.hour * 60 * 60 +
        datetime.minute * 60,
    })
    .then(() => {
      datetime.date = 0;
      datetime.hour = 0;
      datetime.minute = 0;
      active.value = false;
      alert("Create Discount Type Successfully");
      router.go(0);
    });
};
const updateDiscountType = () => {
  axios
    .put(`/price-rule-molds/${props.discountType.id}`, {
      name: props.discountType.name,
      customer_selection: selectApplyTo.value,
      discount_amount:
        selectDiscountOption.value === "fix-amount"
          ? discountValue.value
          : null,
      discount_percentage:
        selectDiscountOption.value === "percentage"
          ? discountValue.value
          : null,
      description: props.discountType.description,
      loyalty_price: props.discountType.loyalty_price,
      time_limit:
        datetime.date * 24 * 60 * 60 +
        datetime.hour * 60 * 60 +
        datetime.minute * 60,
    })
    .then(() => {
      datetime.date = 0;
      datetime.hour = 0;
      datetime.minute = 0;
      active.value = false;
      alert("Update Discount Type Successfully");
      router.go(0);
    });
};

const onHandlePrimaryAction = () => {
  if (props.discountType.id) {
    updateDiscountType();
  } else {
    createDiscountType();
  }
};
const onHandleSecondaryAction = () => {
  if (props.discountType.status === 0) {
    axios
      .post(`/price-rule-molds/${props.discountType.id}/activate`)
      .then(() => {
        alert("Activate Discount Type Successfully");
        router.go(0);
      });
  } else {
    axios
      .post(`/price-rule-molds/${props.discountType.id}/deactivate`)
      .then(() => {
        alert("Deactivate Discount Type Successfully");
        router.go(0);
      });
  }
};
const updateDataComponent = () => {
  selectApplyTo.value = props.discountType.customer_selection || "all";
  selectDiscountOption.value = props.discountType.discount_amount
    ? "fix-amount"
    : "percentage";
  discountValue.value =
    props.discountType.discount_amount ||
    props.discountType.discount_percentage;
};
updateDataComponent();
changeTimeLimit();
</script>
<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: left;
}

.f-row {
  display: flex;
  flex-direction: row;
  padding-bottom: 4px;
}

.f-col {
  display: flex;
  flex-direction: column;
  padding: 0 4px 0 4px;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.align-center {
  align-items: center;
}

.f-colum {
  display: column;
  flex-direction: column;
}

.p-1 {
  margin: 0.1rem;
}

.col-1 {
  width: 8.33%;
}

.col-2 {
  width: 16.66%;
}

.col-3 {
  width: 25%;
}

.col-4 {
  width: 33.33%;
}

.col-5 {
  width: 41.66%;
}

.col-6 {
  width: 50%;
}

.col-7 {
  width: 58.33%;
}

.col-8 {
  width: 66.66%;
}

.col-9 {
  width: 75%;
}

.col-10 {
  width: 83.33%;
}

.col-11 {
  width: 91.66%;
}

.col-12 {
  width: 100%;
}
.input-name {
  width: 100%;
  height: 2.5rem;
  padding: 0.25rem;
}
.input-number {
  width: 100%;
  height: 2.5rem;
  padding: 0.25rem;
}
input[type="number"] {
  width: 100%;
  height: 2.5rem;
  padding: 0.25rem;
}
.input-textaria {
  width: 100%;
  height: 5rem;
  padding: 0.25rem;
}
.select-apply-to {
  width: 100%;
  height: 2.5rem;
  padding: 0.25rem;
}
.margin-top-1 {
  margin-top: 1rem;
}
</style>
