<template>
    <div class="lottery-container">
        <div class="coupon-generator-container">
            <div class="coupon-generator__question">How many coupons you want to generate ?</div>
            <div class="coupon-generator__buttons">
                <span class="coupon-generator__button-item"
                      v-for="index in couponsMaxAmount"
                      @click="generateCoupons(index)">
                    {{index}}
                </span>
            </div>
        </div>
        <div class="coupons-generated" v-if="couponsToGenerate">
            <div class="coupon-item-container"
                 v-for="index in couponsToGenerate">
                <div class="coupon-item">
                    Coupon number: {{index}}
                    <div class="coupon-item__title">Generated numbers:</div>
                    <div class="coupon-item__numbers">1,2,3,3,4,4</div>
                </div>
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
        couponsToGenerate: 0,
        coupons: [],
        lotteryRange: 49,
        createdNumberCount: 6
      }
    },
    computed: {},
    methods: {
      generateCoupons (amount) {
        this.couponsToGenerate = amount
        this.generateNumbers()
      },

      generateNumbers () {
        for (let i = 0; i < this.couponsToGenerate; i += 1) {
          this.generateNumbersForCoupon(i)
        }
      },

      generateNumbersForCoupon (idx) {
        const numbers = []

        for (let i = 0; i < this.createdNumberCount; i += 1) {
          const number = Math.round(Math.random() * (this.lotteryRange - 1) + 1);
          numbers.push(number)
          // different number
        }
      }
    },
    mounted () {
    },
    components: {}
  }
</script>

<style lang="less" scoped>
    @standard-button-height: 50px;
    @double-standard-button-height: (@standard-button-height + @standard-button-height);
    @standard-border: 1px solid black;

    .lottery-container {
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
            display: flex;
            flex-wrap: wrap;
            background: gold;

            .coupon-item-container {
                width: calc(25% - 20px);
                height: @double-standard-button-height;
                padding: 10px;

                .coupon-item {
                    background: goldenrod;

                }
            }

        }

    }
</style>
