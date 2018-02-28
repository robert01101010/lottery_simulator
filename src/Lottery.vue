<template>
    <div class="lottery-container">
        <div class="coupon-generator">
            <div class="coupon-generator__lottery-range">
                <span v-if="isRangeValid">
                    Specify lottery range
                </span>
                <span v-if="!isRangeValid" class="coupon-generator__lottery-range--warning">
                    Select correct numbers: for drawing (1 to 12) and lottery pool (1 to 99)
                </span>
                <input type="number" v-model.number="createdNumberCount" class="coupon-generator__lottery-range--input">
                <span> from </span>
                <input type="number" v-model.number="lotteryRange" class="coupon-generator__lottery-range--input">
            </div>
            <div class="coupon-generator__question">
                 <span v-if="!couponsToGenerateAmount">
                     Click any numbers to generate coupons.
                </span>
                <span v-else>
                    This is yours coupons:
                </span>
            </div>
            <template v-if="!couponsToGenerateAmount">
                <div class="coupon-generator__buttons">
                    <span class="coupon-generator__buttons--standard-item"
                          v-for="number in couponsMaxAmount"
                          @click="generateCoupons(number)">
                        {{number}}
                    </span>
                </div>
            </template>
        </div>
        <template v-if="couponsToGenerateAmount">
            <div class="coupons-generated">
                <div class="coupons-generated-items"
                     v-for="number in couponsToGenerateAmount">
                    <div class="coupons-generated-items__single-item">
                        Coupon number: {{number}}
                        <span class="coupons-generated-items__single-item--title">Generated numbers:</span>
                        <div class="coupons-generated-items__single-item--numbers">{{ coupons[ number - 1 ] }}</div>
                    </div>
                </div>
            </div>
            <div class="coupons-check">
                <div class="coupons-check__button">
                    <div v-if="!checked" @click="checkCoupons()" class="coupons-check__button--to-check">
                        Check Coupons
                    </div>
                    <div v-if="checked" class="coupons-check__button--checked">
                        Drawn numbers: {{ drawnNumbers }}
                    </div>
                </div>
            </div>
            <template v-if="checked">
                <div class="coupons-checked">
                    <div class="coupons-checked-items"
                         v-for="number in couponsToGenerateAmount">
                        <div class="coupons-checked-items__single-item">
                            <div class="coupons-checked-items__single-item__coupon-number">
                                Coupon number: {{number}}
                            </div>
                            <div class="coupons-checked-items__single-item__hit-count">
                                You hit
                                {{ getSameNumbersAmountForCoupon(number - 1) }}
                            </div>
                            <div v-if="getSameNumbersForCoupon(number - 1).length"
                                 class="coupons-checked-items__single-item__hit-numbers">
                                {{ getSameNumbersForCoupon(number - 1) }}
                            </div>
                        </div>

                    </div>
                </div>
                <div class="lottery-reset">
                    <div class="lottery-reset__reset-button" @click="reset()">
                        Reset
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>

<script>

  export default {
    name: 'Lottery',
    data () {
      return {
        couponsMaxAmount: 8,
        couponsToGenerateAmount: 0,
        coupons: [],
        lotteryRange: 49,
        createdNumberCount: 6,
        checked: false,
        numbersHit: []
      }
    },

    computed: {
      isRangeValid () {
        return this.isRangeToSmall && !this.isRangeOverstep && (this.lotteryRange >= this.createdNumberCount)
      },

      isRangeToSmall () {
        return this.createdNumberCount > 0 && this.lotteryRange >= 0
      },

      isRangeOverstep() {
        return this.createdNumberCount > 12 || this.lotteryRange > 99
      }
    },

    methods: {
      generateCoupons (amount) {
        if (this.isRangeValid) {
          this.couponsToGenerateAmount = amount
          this.generateNumbers()
        }
      },

      generateNumbers () {
        for (let i = 0; i < this.couponsToGenerateAmount; i += 1) {
          this.coupons.push(this._getRandomNumbers(this.createdNumberCount, this.lotteryRange))
        }
      },

      checkCoupons () {
        this.checked = true
        this.createDraw()
      },

      createDraw () {
        this.drawnNumbers = this._getRandomNumbers(this.createdNumberCount, this.lotteryRange)

        this.coupons.forEach((coupon) => {
          this.numbersHit.push(this.getSameNumbers(this.drawnNumbers, coupon))
        })
      },

      getSameNumbers (drawnNumbers, arrayToCompare) {
        let sameNumbers = []

        arrayToCompare.forEach((number) => {
          if (drawnNumbers.indexOf(number) !== -1) {
            sameNumbers.push(number)
          }
        })
        return {
          sameNumbers,
          sameNumbersAmount: sameNumbers.length
        }
      },

      getSameNumbersAmountForCoupon (index) {
        if (this.numbersHit[ index ]) {
          return this.numbersHit[ index ].sameNumbersAmount
        }
      },

      getSameNumbersForCoupon (index) {
        if (this.numbersHit[ index ]) {
          return this.numbersHit[ index ].sameNumbers
        }
      },

      reset () {
        this.couponsToGenerateAmount = 0
        this.coupons.length = 0
        this.checked = false
        this.numbersHit.length = 0
      },

      _getRandomNumbers (numbersToCreate, range) {
        const numbers = []
        for (let i = 0; i < numbersToCreate; i += 1) {

          const randomNumber = Math.round(Math.random() * (range - 1) + 1)
          if (numbers.indexOf(randomNumber) === -1) {
            numbers.push(randomNumber)
          } else {
            i -= 1
          }
        }

        return numbers
      }
    }
  }
</script>

<style lang="less" scoped>
    // colors
    @base-background: #49667F;
    @contrast-to-base-background: #6E99BF;
    @highlighted-base-background: #84B8E5;

    // heights
    @standard-button-height: 40px;
    @double-standard-button-height: (@standard-button-height + @standard-button-height);

    // fonts
    @standard-font-size: 18px;
    @standard-font-weight: 500;

    // borders
    @standard-border: 1px solid black;
    @small-border-radius: 3px;

    //padings / margins
    @small-padding: 5px;
    @medium-padding: 10px;

    //others
    @standard-hover-cursor: pointer;
    @standard-lighten-percentage: 10%;

    // Mixins
    .displayFlexWithDirectionAndWrap(@direction, @wrap) {
        display: flex;
        flex-direction: @direction;
        flex-wrap: @wrap;
    }

    .quarterWidthWithPadding(@padding: padding) {
        width: calc(25% - (@padding + @padding));
        padding: @padding;
    }

    // style
    .lottery-container {
        margin: 0 auto;
        width: 60%;
        border: @standard-border;
        opacity: 0.8;
        border-radius: @small-border-radius;

        .coupon-generator {
            .displayFlexWithDirectionAndWrap(column, wrap);
            background: @base-background;

            &__lottery-range {
                &--input {
                    width: 35px;
                }
                &--warning {
                    color: darkred;
                }
            }

            &__lottery-range, &__question {
                font-size: @standard-font-size;
                font-weight: @standard-font-weight;
                height: @standard-button-height;
                line-height: @standard-button-height;
                width: 100%;
                text-align: center;
            }

            &__buttons {
                .displayFlexWithDirectionAndWrap(row, nowrap);
                height: @standard-button-height;
                line-height: @standard-button-height;

                &--standard-item {
                    text-align: center;
                    border: @standard-border;
                    width: 12.5%;

                    &:hover {
                        cursor: @standard-hover-cursor;
                        background: lighten(@base-background, @standard-lighten-percentage);
                    }
                }
            }
        }

        .coupons-generated {
            .displayFlexWithDirectionAndWrap(row, wrap);
            background: @base-background;

            .coupons-generated-items {
                .quarterWidthWithPadding(@medium-padding);
                height: @double-standard-button-height;

                .coupons-generated-items__single-item {
                    padding: @small-padding;
                    background: @contrast-to-base-background;
                    border-bottom: @standard-border;
                    border-radius: @small-border-radius;

                    &--numbers {
                        background: @highlighted-base-background;
                    }
                }
            }
        }

        .coupons-check {
            text-align: center;
            background: @base-background;
            height: @standard-button-height;
            line-height: @standard-button-height;

            .coupons-check__button {
                background: @contrast-to-base-background;
                &--to-check {
                    &:hover {
                        cursor: @standard-hover-cursor;
                        background: lighten(@base-background, @standard-lighten-percentage);
                    }
                }
                &--checked {
                    background: lighten(@highlighted-base-background, @standard-lighten-percentage)
                }
            }
        }

        .coupons-checked {
            .displayFlexWithDirectionAndWrap(row, wrap);
            background: @base-background;

            .coupons-checked-items {
                .quarterWidthWithPadding(@medium-padding);
                height: @double-standard-button-height;

                .coupons-checked-items__single-item {
                    border-radius: @small-border-radius;
                    border-bottom: @standard-border;
                    background: @contrast-to-base-background;

                    &__hit-numbers {
                        background: lighten(@highlighted-base-background, @standard-lighten-percentage);
                    }

                    &__hit-count {
                        background: @highlighted-base-background;
                    }
                }
            }
        }

        .lottery-reset {
            text-align: center;
            background: @base-background;
            height: @standard-button-height;
            line-height: @standard-button-height;

            .lottery-reset__reset-button {
                background: lighten(@highlighted-base-background, @standard-lighten-percentage);
                &:hover {
                    cursor: @standard-hover-cursor;
                    background: lighten(@highlighted-base-background, (@standard-lighten-percentage + @standard-lighten-percentage));
                }
            }
        }
    }
</style>
