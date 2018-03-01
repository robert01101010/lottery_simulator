<template>
    <div class="lottery-container">
        <div class="coupon-generator">
            <div class="coupon-generator__lottery-range">
                <span>
                    How many numbers on coupon:
                </span>
                <input type="number" v-model.number="numbersOnCouponsAmount"
                       :disabled="isRangeDeclarationEnabled"
                       class="coupon-generator__lottery-range--input">
                <span>
                    how much to draw:
                </span>
                <input type="number" v-model.number="numbersToDrawnAmount"
                       :disabled="isRangeDeclarationEnabled"
                       class="coupon-generator__lottery-range--input">
                <span>
                    total pool:
                </span>
                <input type="number" v-model.number="lotteryRange"
                       :disabled="isRangeDeclarationEnabled"
                       class="coupon-generator__lottery-range--input">
            </div>
            <div class="coupon-generator__lottery-range" v-if="!isRangeValid">
                 <span class="coupon-generator__lottery-range--warning">
                    Correct numbers! Number on coupons (1 to 12), for draw (1 to 30)
                     lottery pool (1 to 99) and (number on coupons <= pool)
                 </span>
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
                        <div class="coupons-generated-items__single-item--numbers">
                            {{ getStringValueOfArr(coupons[ number - 1 ]) }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="coupons-check">
                <div class="coupons-check__button">
                    <div v-if="!checked" @click="checkCoupons()" class="coupons-check__button--to-check">
                        Check Coupons
                    </div>
                    <div v-if="checked" class="coupons-check__button--checked">
                        Drawn numbers: {{ getStringValueOfArr(drawnNumbers) }}
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
        numbersToDrawnAmount: 8,
        numbersOnCouponsAmount: 6,
        checked: false,
        numbersHit: [],
        maxNumberOnCoupon: 12,
        maxLotteryPool: 99,
        maxNumbersToDraw: 30
      }
    },

    computed: {
      isRangeValid () {
        return this.isRangeToSmall && !this.isRangeOverstep && this.isRangedSizeValid
      },

      isRangedSizeValid () {
        return this.lotteryRange >= this.numbersOnCouponsAmount && this.numbersToDrawnAmount < this.lotteryRange
      },

      isRangeToSmall () {
        return this.numbersOnCouponsAmount > 0 && this.lotteryRange >= 0 && this.numbersToDrawnAmount > 0
      },

      isRangeOverstep () {
        return this.numbersOnCouponsAmount > this.maxNumberOnCoupon || this.lotteryRange > this.maxLotteryPool || this.numbersToDrawnAmount > this.maxNumbersToDraw
      },

      isRangeDeclarationEnabled () {
        return this.coupons.length > 0
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
          this.coupons.push(this._getRandomNumbers(this.numbersOnCouponsAmount, this.lotteryRange))
        }
      },

      getStringValueOfArr (arr) {
        return arr.length ? arr.join(', ') : ''
      },

      checkCoupons () {
        this.checked = true
        this.createDraw()
      },

      createDraw () {
        this.drawnNumbers = this._getRandomNumbers(this.numbersToDrawnAmount, this.lotteryRange)

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
          return this.getStringValueOfArr(this.numbersHit[ index ].sameNumbers)
        }
      },

      reset () {
        this.couponsToGenerateAmount = 0
        this.coupons = []
        this.checked = false
        this.numbersHit = []
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
    @base-background: #5D809E;
    @contrast-to-base-background: #6E99BF;
    @highlighted-base-background: #84B8E5;
    @warning-colors: darkred;

    // heights
    @standard-button-height: 40px;
    @double-standard-button-height: (@standard-button-height + @standard-button-height);

    // widths
    @max-width: 100%;
    @base-width: 80%;
    @eight-part-of-max-width: 12.5%;
    @numeric-input-standard-width: 35px;

    // fonts
    @native-font-size: 16px;
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
    @center-align: center;

    // Mixins
    .displayFlexWithDirectionAndWrap (@direction, @wrap) {
        display: flex;
        flex-direction: @direction;
        flex-wrap: @wrap;
    }

    .quarterWidthWithPadding (@padding: padding) {
        width: calc(25% - (@padding + @padding));
        padding: @padding;
    }

    .nativeInputResetWithBackground (@background: background) {
        border: none;
        box-shadow: none;
        background: @background;
    }

    // style
    .lottery-container {
        margin: 0 auto;
        width: @base-width;
        border: @standard-border;
        border-radius: @small-border-radius;

        .coupon-generator {
            .displayFlexWithDirectionAndWrap(column, wrap);
            background: @base-background;

            &__lottery-range {
                &--input {
                    .nativeInputResetWithBackground(@contrast-to-base-background);
                    text-align: @center-align;
                    font-size: @native-font-size;
                    width: @numeric-input-standard-width;
                    border-radius: @small-border-radius;
                }
                &--warning {
                    color: @warning-colors;
                }
            }

            &__lottery-range, &__question {
                font-size: @standard-font-size;
                font-weight: @standard-font-weight;
                height: @standard-button-height;
                line-height: @standard-button-height;
                width: @max-width;
                text-align: @center-align;
            }

            &__buttons {
                .displayFlexWithDirectionAndWrap(row, nowrap);
                height: @standard-button-height;
                line-height: @standard-button-height;

                &--standard-item {
                    text-align: @center-align;
                    border: @standard-border;
                    width: @eight-part-of-max-width;

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
            text-align: @center-align;
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
                    padding: @small-padding;
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
            text-align: @center-align;
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
