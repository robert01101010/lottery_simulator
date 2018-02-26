<template>
    <div class="lottery-container">
        <div class="coupon-generator-container">
            <div class="coupon-generator__question">How many coupons you want to generate ?</div>
            <div class="coupon-generator__buttons">
                <span class="coupon-generator__button-item"
                      v-for="index in couponsMaxAmount"
                      @click="generateCoupon(index)">
                    {{index}}
                </span>
            </div>
        </div>
        <div class="coupons-generated" v-if="couponsToGenerate">
            <div class="coupon-item" v-for="index in couponsToGenerate">
                asda
            </div>
        </div>
    </div>

</template>

<script>

  export default {
    name: 'Lottery',
    data () {
      return {
        couponsMaxAmount: 8,
        couponsToGenerate: 0
      }
    },
    methods: {
      generateCoupon (amount) {
        this.couponsToGenerate = amount
      }
    },
    mounted () {
    },
    components: {}
  }
</script>

<style lang="less" scoped>
    @standard-button-height: 50px;
    @standard-border: 1px solid black;
.lottery-container{
    margin: 0 auto;
    width: 60%;

    .coupon-generator-container {
        display: flex;
        flex-direction: column;
        background: gold;

        .coupon-generator__question {
            height: @standard-button-height;
            line-height: @standard-button-height;
            width: 100%;
            text-align: center;
        }

        .coupon-generator__buttons {
            height: @standard-button-height;
            line-height: @standard-button-height;
            display: flex;
            flex-direction: row;

            .coupon-generator__button-item {
                text-align: center;
                border: @standard-border;
                width: 12.5%;

                &:hover {
                    cursor: pointer;
                    background: lighten(gold, 10%);
                }
            }

        }
    }

    .coupons-generated {
        background: gold;


    }

}
</style>
