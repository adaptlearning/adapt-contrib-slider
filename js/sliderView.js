define([
	'core/js/adapt',
    'core/js/views/questionView'
], function(Adapt, QuestionView) {

    var SliderView = QuestionView.extend({
    	tempValue: true,

        events: {
            'click .slider-scale-number': 'onNumberSelected',
            'focus input[type="range"]': 'onHandleFocus',
            'blur input[type="range"]': 'onHandleBlur'
        },

        // Used by the question to reset the question when revisiting the component
        resetQuestionOnRevisit: function() {
            this.setAllItemsEnabled();
            this.model.deselectAllItems();
            this.resetQuestion();
        },

        // Used by question to setup itself just before rendering
        setupQuestion: function() {
            if (this.model.get('_isSubmitted')) return;

            this.selectItem(this.getIndexFromValue(this.model.get('_selectedItem').value), true);
        },

        setupRangeslider: function () {
            this.$sliderScaleMarker = this.$('.slider-scale-marker');
            this.$slider = this.$('input[type="range"]');
            if(this.model.has('_scaleStep')) {
                this.$slider.attr({"step": this.model.get('_scaleStep')});
            }

            this.$slider.rangeslider({
                polyfill: false,
                onSlide: _.bind(this.handleSlide, this)
            });
            this.oldValue = 0;

            if (this._deferEnable) {
                this.setAllItemsEnabled();
            }
        },

        handleSlide: function (position, value) {
            if (this.oldValue === value) {
                return;
            }
            var itemIndex = this.getIndexFromValue(value);
            var pixels = this.mapIndexToPixels(itemIndex);
            this.selectItem(itemIndex, false);
            this.animateToPosition(pixels);
            this.oldValue = value;
            this.tempValue = true;
        },

        disableQuestion: function() {
            this.setAllItemsEnabled();
        },

        enableQuestion: function() {
            this.setAllItemsEnabled();
        },

        setAllItemsEnabled: function() {
            var isEnabled = this.model.get('_isEnabled');

            if (!this.$slider) {
                this._deferEnable = true; // slider is not yet ready
                return;
            }

            if (!isEnabled) {
                this.$('.slider-widget').addClass('disabled');
                this.$slider.prop('disabled', true).rangeslider('update', true);
                return;
            }

            this.$('.slider-widget').removeClass('disabled');
            this.$slider.prop('disabled', false).rangeslider('update', true);
        },

        onQuestionRendered: function() {
            this.setupRangeslider();
            this.setScalePositions();
            this.onScreenSizeChanged();
            this.showScaleMarker(true);
            this.listenTo(Adapt, 'device:resize', this.onScreenSizeChanged);
            this.setAltText(this.model.get('_scaleStart'));
            this.setReadyStatus();
        },

        // this should make the slider handle, slider marker and slider bar to animate to give position
        animateToPosition: function(newPosition) {
            if (!this.$sliderScaleMarker) return;

            this.$sliderScaleMarker
                .velocity('stop')
                .velocity({
                    left: newPosition
                }, {
                    duration: 200,
                    easing: "linear",
                    mobileHA: false
                });
        },

        // this shoud give the index of item using given slider value
        getIndexFromValue: function(itemValue) {
            var scaleStart = this.model.get('_scaleStart');
            var scaleEnd = this.model.get('_scaleEnd');
            return Math.round(this.mapValue(itemValue, scaleStart, scaleEnd, 0, this.model.get('_items').length - 1));
        },

        // this should set given value to slider handle
        setAltText: function(value) {
            this.$('.slider-handle').attr('aria-valuenow', value);
        },

        mapIndexToPixels: function(value, $widthObject) {
            var numberOfItems = this.model.get('_items').length;
            var width = $widthObject ? $widthObject.width() : this.$('.slider-scaler').width();

            return Math.round(this.mapValue(value, 0, numberOfItems - 1, 0, width));
        },

        mapPixelsToIndex: function(value) {
            var numberOfItems = this.model.get('_items').length;
            var width = this.$('.slider-sliderange').width();

            return Math.round(this.mapValue(value, 0, width, 0, numberOfItems - 1));
        },

        normalise: function(value, low, high) {
            var range = high - low;
            return (value - low) / range;
        },

        mapValue: function(value, inputLow, inputHigh, outputLow, outputHigh) {
            var normal = this.normalise(value, inputLow, inputHigh);
            return normal * (outputHigh - outputLow) + outputLow;
        },

        onHandleFocus: function(event) {
            event.preventDefault();
            this.$slider.on('keydown', _.bind(this.onKeyDown, this));
        },

        onHandleBlur: function(event) {
            event.preventDefault();
            this.$slider.off('keydown');
        },

        onKeyDown: function(event) {
            if(event.which == 9) return; // tab key
            event.preventDefault();

            var newItemIndex = this.getIndexFromValue(this.model.get('_selectedItem').value);

            switch (event.which) {
                case 40: // ↓ down
                case 37: // ← left
                    newItemIndex = Math.max(newItemIndex - 1, 0);
                    break;
                case 38: // ↑ up
                case 39: // → right
                    newItemIndex = Math.min(newItemIndex + 1, this.model.get('_items').length - 1);
                    break;
            }

            this.selectItem(newItemIndex);
            if(typeof newItemIndex == 'number') this.showScaleMarker(true);
            this.animateToPosition(this.mapIndexToPixels(newItemIndex));
            this.setSliderValue(this.getValueFromIndex(newItemIndex));
            this.setAltText(this.getValueFromIndex(newItemIndex));
        },

        onNumberSelected: function(event) {
            event.preventDefault();
            this.tempValue = false;

            if (this.model.get('_isInteractionComplete')) {
                return;
            }

            // when component is not reset, selecting a number should be prevented
            if (this.$slider.prop('disabled')) {
                return;
            }

            var itemValue = parseFloat($(event.currentTarget).attr('data-id'));
            var index = this.getIndexFromValue(itemValue);
            this.selectItem(index);
            this.animateToPosition(this.mapIndexToPixels(index));
            this.setAltText(itemValue);
            this.setSliderValue(itemValue);
        },

        getValueFromIndex: function(index) {
            return this.model.get('_items')[index].value;
        },

        resetControlStyles: function() {
            this.$('.slider-handle').empty();
            this.showScaleMarker(false);
            this.$('.slider-bar').animate({width:'0px'});
            this.setSliderValue(this.model.get('_items')[0].value);
        },

        onCannotSubmit: function() {},

        setSliderValue: function (value) {
            if (this.$slider) {
                this.$slider.val(value).change();
            }
        },

        showMarking: function() {
            if (!this.model.get('_canShowMarking')) return;

            this.$('.slider-widget').removeClass('correct incorrect')
                .addClass(this.model.get('_selectedItem').correct ? 'correct' : 'incorrect');
        },

        resetQuestion: function() {
            this.selectItem(0, true);
            this.animateToPosition(0);
            this.resetControlStyles();
            this.showScaleMarker(true);
            this.setAltText(this.model.get('_scaleStart'));
        },

        setScalePositions: function() {
            var numberOfItems = this.model.get('_items').length;
            _.each(this.model.get('_items'), function(item, index) {
                var normalisedPosition = this.normalise(index, 0, numberOfItems -1);
                this.$('.slider-scale-number').eq(index).data('normalisedPosition', normalisedPosition);
            }, this);
        },

        showScale: function () {
            var $markers = this.$('.slider-markers').empty();
            if (this.model.get('_showScale') === false) {
                $markers.eq(0).css({display: 'none'});
                this.$('.slider-scale-numbers *:not(".slider-scale-marker")').css(
                    this.model.get('_showScaleIndicator') ? {visibility: 'hidden'} : {display: 'none'}
                );
                return;
            }

            var $scaler = this.$('.slider-scaler');
            for (var i = 1, count = this.model.get('_items').length - 1; i < count; i++) {
                $markers.append("<div class='slider-line component-item-color' style='left: " + this.mapIndexToPixels(i, $scaler) + "px'>");
            }
            // Do we show scale numbers
            this.showScaleNumbers();
        },

        showScaleNumbers: function () {
            var $scaler = this.$('.slider-scaler');
            if (this.model.get('_showScaleNumbers') === false) {
                this.$('.slider-scale-numbers *:not(".slider-scale-marker")').css('display', 'none');
                return;
            }

            var scaleWidth = $scaler.width();
            var $numbers = this.$('.slider-scale-number');
            this.model.get('_items').forEach(function(item, index) {
                var $number = $numbers.eq(index);
                var newLeft = Math.round($number.data('normalisedPosition') * scaleWidth);
                $number.css({left: newLeft});
            });
        },

        //Labels are enabled in slider.hbs. Here we manage their containing div.
        showLabels: function () {
            if(!this.model.get('labelStart') && !this.model.get('labelEnd')) {
                this.$('.slider-scale-labels').eq(0).css({display: 'none'});
            }
        },

        remapSliderBar: function() {
            var $scaler = this.$('.slider-scaler');
            var currentIndex = this.getIndexFromValue(this.model.get('_selectedItem').value);
            var left = this.mapIndexToPixels(currentIndex, $scaler);
            this.$('.slider-handle').css({left: left + 'px'});
            this.$('.slider-scale-marker').css({left: left + 'px'});
            this.$('.slider-bar').width(left);
        },

        onScreenSizeChanged: function() {
            this.showScale();
            this.showLabels();
            this.remapSliderBar();
            if (this.$('.slider-widget').hasClass('show-user-answer')) {
                this.hideCorrectAnswer();
            } else if (this.$('.slider-widget').hasClass('show-correct-answer')) {
                this.showCorrectAnswer();
            }
        },

        showCorrectAnswer: function() {
            var answers = [];

            if(this.model.has('_correctAnswer')) {
                var correctAnswer = this.model.get('_correctAnswer');
            }

            if (this.model.has('_correctRange')) {
                var bottom = this.model.get('_correctRange')._bottom;
                var top = this.model.get('_correctRange')._top;
                var step = (this.model.has('_scaleStep') ? this.model.get('_scaleStep') : 1);
            }

            this.showScaleMarker(false);

            //are we dealing with a single correct answer or a range?
            if (correctAnswer) {
                answers.push(correctAnswer);
            } else if (bottom !== undefined && top !== undefined) {
                var answer = this.model.get('_correctRange')._bottom;
                var topOfRange = this.model.get('_correctRange')._top;
                while(answer <= topOfRange) {
                    answers.push(answer);
                    answer += step;
                }
            } else {
                console.log("adapt-contrib-slider::WARNING: no correct answer or correct range set in JSON");
            }

            var middleAnswer = answers[Math.floor(answers.length / 2)];
            this.animateToPosition(this.mapIndexToPixels(this.getIndexFromValue(middleAnswer)));

            this.showModelAnswers(answers);

            this.setSliderValue(middleAnswer);
        },

        showModelAnswers: function(correctAnswerArray) {
            var $parentDiv = this.$('.slider-modelranges');
            _.each(correctAnswerArray, function(correctAnswer, index) {
                $parentDiv.append($("<div class='slider-model-answer component-item-color component-item-text-color'>"));

                var $element = $(this.$('.slider-modelranges .slider-model-answer')[index]);
                var startingLeft = this.mapIndexToPixels(this.getIndexFromValue(this.model.get('_selectedItem').value));

                if(this.model.get('_showNumber')) $element.html(correctAnswer);

                $element.css({left:startingLeft}).fadeIn(0, _.bind(function() {
                    $element.animate({left: this.mapIndexToPixels(this.getIndexFromValue(correctAnswer))});
                }, this));
            }, this);
        },

        hideCorrectAnswer: function() {
            var userAnswerIndex = this.getIndexFromValue(this.model.get('_userAnswer'));
            this.$('.slider-modelranges').empty();

            this.showScaleMarker(true);
            this.selectItem(userAnswerIndex, true);
            this.animateToPosition(this.mapIndexToPixels(userAnswerIndex));
            this.setSliderValue(this.model.get('_userAnswer'));
        },

        // according to given item index this should make the item as selected
        selectItem: function(itemIndex, noFocus) {
            _.each(this.model.get('_items'), function(item, index) {
                item.selected = (index == itemIndex);
                if(item.selected) {
                    this.model.set('_selectedItem', item);
                    this.$('input').attr({
                        "value": item.value,
                        "aria-valuenow": item.value
                    });
                }
            }, this);
            this.showNumber(true);
        },

        // this makes the marker visible or hidden
        showScaleMarker: function(show) {
            var $scaleMarker = this.$('.slider-scale-marker');
            if (this.model.get('_showScaleIndicator')) {
                this.showNumber(show);
                if(show) {
                    $scaleMarker.addClass('display-block');
                } else {
                    $scaleMarker.removeClass('display-block');
                }
            }
        },

        // this should add the current slider value to the marker
        showNumber: function(show) {
            var $scaleMarker = this.$('.slider-scale-marker');
            if(this.model.get('_showNumber')) {
                if(show) {
                    $scaleMarker.html(this.model.get('_selectedItem').value);
                } else {
                    $scaleMarker.html = "";
                }
            }
        }
    });

    return SliderView;
});