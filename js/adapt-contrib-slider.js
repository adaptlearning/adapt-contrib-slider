define(function(require) {
    var QuestionView = require('coreViews/questionView');
    var Adapt = require('coreJS/adapt');

    var Slider = QuestionView.extend({

        events: {
            'click .slider-sliderange': 'onSliderSelected',
            'click .slider-handle': 'preventEvent',
            'click .slider-scale-number': 'onNumberSelected',
            'touchstart .slider-handle':'onHandlePressed',
            'mousedown .slider-handle': 'onHandlePressed',
            'focus .slider-handle':'onHandleFocus',
            'blur .slider-handle':'onHandleBlur'
        },

        // Used by the question to reset the question when revisiting the component
        resetQuestionOnRevisit: function() {
            this.setAllItemsEnabled(true);
            this.deselectAllItems();
            this.resetQuestion();
        },

        // Used by question to setup itself just before rendering
        setupQuestion: function() {
            if(!this.model.get('_items')) {
                this.setupModelItems();
            }

            this.model.set({
                _selectedItem: {}
            });

            this.restoreUserAnswers();
            if (this.model.get('_isSubmitted')) return;

            this.selectItem(0);
        },

        setupModelItems: function() {
            var items = [];
            var answer = this.model.get('_correctAnswer');
            var range = this.model.get('_correctRange');
            var start = this.model.get('_scaleStart');
            var end = this.model.get('_scaleEnd');

            for (var i = start; i <= end; i++) {
                if (answer) {
                    items.push({value: i, selected: false, correct: (i == answer)});
                } else {
                    items.push({value: i, selected: false, correct: (i >= range._bottom && i <= range._top)});
                }
            }

            this.model.set('_items', items);
        },

        restoreUserAnswers: function() {
            if (!this.model.get('_isSubmitted')) return;

            var items = this.model.get('_items');
            var userAnswer = this.model.get('_userAnswer');
            for (var i = 0, l = items.length; i < l; i++) {
                var item = items[i];
                if (item.value == userAnswer) {
                    this.model.set('_selectedItem', item);
                    this.selectItem(this.getIndexFromValue(item.value));
                    break;
                }
            }

            this.setQuestionAsSubmitted();
            this.markQuestion();
            this.setScore();
            this.showMarking();
            this.setupFeedback();
        },

        // Used by question to disable the question during submit and complete stages
        disableQuestion: function() {
            this.setAllItemsEnabled(false);
        },

        // Used by question to enable the question during interactions
        enableQuestion: function() {
            this.setAllItemsEnabled(true);
        },

        setAllItemsEnabled: function(isEnabled) {
            if (isEnabled) {
                this.$('.slider-widget').removeClass('disabled');
            } else {
                this.$('.slider-widget').addClass('disabled');
            }
        },

        // Used by question to setup itself just after rendering
        onQuestionRendered: function() {
            this.setScalePositions();
            this.onScreenSizeChanged();
            this.showScaleMarker(true);
            this.listenTo(Adapt, 'device:resize', this.onScreenSizeChanged);
            this.setAltText(this.model.get('_scaleStart'));
            this.setReadyStatus();
        },

        // this should make the slider handle, slider marker and slider bar to animate to give position
        animateToPosition: function(newPosition) {
            this.$('.slider-handle').stop(true).animate({
                left: newPosition + 'px'
            },200);
            this.$('.slider-bar').stop(true).animate({width:newPosition + 'px'});
            this.$('.slider-scale-marker').stop(true).animate({
                left: newPosition + 'px'
            },200);
            this.$('.slider-bar').stop(true).animate({width:newPosition + 'px'});
        },

        // this shoud give the index of item using given slider value
        getIndexFromValue: function(itemValue) {
            var scaleStart = this.model.get('_scaleStart'),
                scaleEnd = this.model.get('_scaleEnd');
            return Math.floor(this.mapValue(itemValue, scaleStart, scaleEnd, 0, this.model.get('_items').length - 1));
        },

        // this should set given value to slider handle
        setAltText: function(value) {
            this.$('.slider-handle').attr('aria-valuenow', value);
        },

        mapIndexToPixels: function(value, $widthObject) {
            var numberOfItems = this.model.get('_items').length,
                width = $widthObject ? $widthObject.width() : this.$('.slider-sliderange').width();

            return Math.round(this.mapValue(value, 0, numberOfItems - 1, 0, width));
        },

        mapPixelsToIndex: function(value) {
            var numberOfItems = this.model.get('_items').length,
                width = this.$('.slider-sliderange').width();

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

        onDragReleased: function (event) {
            event.preventDefault();

            if (Modernizr.touch) {
                this.$('.slider-handle').off('touchmove');
            } else {
                $(document).off('mousemove.adapt-contrib-slider');
            }

            var itemValue = this.model.get('_selectedItem').value;
            var itemIndex = this.getIndexFromValue(itemValue);
            this.animateToPosition(this.mapIndexToPixels(itemIndex));
            this.setAltText(itemValue);
        },

        onHandleDragged: function (event) {
            event.preventDefault();
            var left = (event.pageX || event.originalEvent.touches[0].pageX) - event.data.offsetLeft;
            left = Math.max(Math.min(left, event.data.width), 0);

            this.$('.slider-handle').css({
                left: left + 'px'
            });

            this.$('.slider-scale-marker').css({
                left: left + 'px'
            });

            this.selectItem(this.mapPixelsToIndex(left));
        },

        onHandleFocus: function(event) {
            event.preventDefault();
            this.$('.slider-handle').on('keydown', _.bind(this.onKeyDown, this));
        },

        onHandleBlur: function(event) {
            event.preventDefault();
            this.$('.slider-handle').off('keydown');
        },

        onHandlePressed: function (event) {
            event.preventDefault();
            if (!this.model.get('_isEnabled') || this.model.get('_isSubmitted')) return;

            this.showScaleMarker(true);

            var eventData = {
                width:this.$('.slider-sliderange').width(),
                offsetLeft: this.$('.slider-sliderange').offset().left
            };

            if(Modernizr.touch) {
                this.$('.slider-handle').on('touchmove', eventData, _.bind(this.onHandleDragged, this));
                this.$('.slider-handle').one('touchend', eventData, _.bind(this.onDragReleased, this));
            } else {
                $(document).on('mousemove.adapt-contrib-slider', eventData, _.bind(this.onHandleDragged, this));
                $(document).one('mouseup', eventData, _.bind(this.onDragReleased, this));
            }
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
            this.setAltText(this.getValueFromIndex(newItemIndex));
        },

        onSliderSelected: function (event) {
            event.preventDefault();

            if (!this.model.get('_isEnabled') || this.model.get('_isSubmitted')) {
              return;
            }

            this.showScaleMarker(true);

            var offsetLeft = this.$('.slider-sliderange').offset().left;
            var width = this.$('.slider-sliderange').width();
            var left = (event.pageX || event.originalEvent.touches[0].pageX) - offsetLeft;

            left = Math.max(Math.min(left, width), 0);
            var itemIndex = this.mapPixelsToIndex(left);
            this.selectItem(itemIndex);
            this.animateToPosition(this.mapIndexToPixels(itemIndex));
            this.setAltText(this.getValueFromIndex(itemIndex));
        },

        onNumberSelected: function(event) {
            event.preventDefault();

            if (this.model.get('_isComplete')) {
              return;
            }

            var itemValue = parseInt($(event.currentTarget).attr('data-id'));
            var index = this.getIndexFromValue(itemValue);
            var $scaler = this.$('.slider-scaler');
            this.selectItem(index);
            this.animateToPosition(this.mapIndexToPixels(index, $scaler));
            this.setAltText(itemValue);
        },

        getValueFromIndex: function(index) {
          return this.model.get('_items')[index].value;
        },

        preventEvent: function(event) {
            event.preventDefault();
        },

        resetControlStyles: function() {
            this.$('.slider-handle').empty();
            this.showScaleMarker(false);
            this.$('.slider-bar').animate({width:'0px'});
        },

        /**
        * allow the user to submit immediately; the slider handle may already be in the position they want to choose
        */
        canSubmit: function() {
            return true;
        },

        // Blank method for question to fill out when the question cannot be submitted
        onCannotSubmit: function() {},

        //This preserves the state of the users answers for returning or showing the users answer
        storeUserAnswer: function() {
            this.model.set('_userAnswer', this.model.get('_selectedItem').value);
        },

        isCorrect: function() {
            var numberOfCorrectAnswers = 0;

            _.each(this.model.get('_items'), function(item, index) {
                if(item.selected && item.correct)  {
                    this.model.set('_isAtLeastOneCorrectSelection', true);
                    numberOfCorrectAnswers++;
                }
            }, this);

            this.model.set('_numberOfCorrectAnswers', numberOfCorrectAnswers);

            return this.model.get('_isAtLeastOneCorrectSelection') ? true : false;
        },

        // Used to set the score based upon the _questionWeight
        setScore: function() {
            var numberOfCorrectAnswers = this.model.get('_numberOfCorrectAnswers');
            var questionWeight = this.model.get('_questionWeight');
            var score = questionWeight * numberOfCorrectAnswers;
            this.model.set('_score', score);
        },

        // This is important and should give the user feedback on how they answered the question
        // Normally done through ticks and crosses by adding classes
        showMarking: function() {
            this.$('.slider-item').removeClass('correct incorrect')
                .addClass(this.model.get('_selectedItem').correct ? 'correct' : 'incorrect');
        },

        isPartlyCorrect: function() {
            return this.model.get('_isAtLeastOneCorrectSelection');
        },

        // Used by the question view to reset the stored user answer
        resetUserAnswer: function() {
            this.model.set({
                _selectedItem: {},
                _userAnswer: undefined
            });
        },

        // Used by the question view to reset the look and feel of the component.
        // This could also include resetting item data
        resetQuestion: function() {
            this.selectItem(0);
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
            this.$('.slider-markers').empty();
            if (this.model.get('_showScale') === false) {
                this.$('.slider-markers').eq(0).css({display: 'none'});
                this.model.get('_showScaleIndicator')
                    ? this.$('.slider-scale-numbers').eq(0).css({visibility: 'hidden'})
                    : this.$('.slider-scale-numbers').eq(0).css({display: 'none'});
            } else {
                var $scaler = this.$('.slider-scaler');
                var $markers = this.$('.slider-markers');
                for (var i = 0, count = this.model.get('_items').length; i < count; i++) {
                    $markers.append("<div class='slider-line component-item-color'>");
                    $('.slider-line', $markers).eq(i).css({left: this.mapIndexToPixels(i, $scaler) + 'px'});
                }
                var scaleWidth = $scaler.width(),
                    $numbers = this.$('.slider-scale-number');
                for (var i = 0, count = this.model.get('_items').length; i < count; i++) {
                    var $number = $numbers.eq(i),
                        newLeft = Math.round($number.data('normalisedPosition') * scaleWidth);
                    $number.css({left: newLeft});
                }
            }
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
            this.$('.slider-handle').css({left: this.mapIndexToPixels(currentIndex, $scaler) + 'px'});
            this.$('.slider-scale-marker').css({left: this.mapIndexToPixels(currentIndex, $scaler) + 'px'});
            this.$('.slider-bar').width(this.mapIndexToPixels(currentIndex, $scaler));
        },

        onScreenSizeChanged: function() {
            this.showScale();
            this.showLabels();
            this.remapSliderBar();
            if (this.$('.slider-widget.user .button.model').css('display') === 'inline-block') {
                this.hideCorrectAnswer();
            } else if (this.$('.slider-widget.model .button.user ').css('display') === 'inline-block') {
                this.showCorrectAnswer();
            }
        },

        showCorrectAnswer: function() {
            var answers = [];
            var bottom = this.model.get('_correctRange')._bottom;
            var top = this.model.get('_correctRange')._top;
            var range = top - bottom;
            var correctAnswer = this.model.get('_correctAnswer');

            this.showScaleMarker(false);

            if (correctAnswer) {
                // Check that correctAnswer is neither undefined nor empty
                answers.push(correctAnswer);
            } else if (bottom !== undefined) {
                for (var i = 0; i <= range; i++) {
                  answers.push(this.model.get('_items')[this.getIndexFromValue(bottom) + i].value);
                }
            } else {
                console.log(this.constructor + "::WARNING: no correct answer or correct range set in JSON")
            }
            var middleAnswer = answers[Math.floor(answers.length / 2)];
            this.animateToPosition(this.mapIndexToPixels(this.getIndexFromValue(middleAnswer)));
            this.showModelAnswers(answers);
        },

        showModelAnswers: function(correctAnswerArray) {
            var $parentDiv = this.$('.slider-modelranges');
            _.each(correctAnswerArray, function(correctAnswer, index) {
                $parentDiv.append($("<div class='slider-model-answer component-item-color component-item-text-color'>"));

                var $element = $(this.$('.slider-modelranges .slider-model-answer')[index]),
                    startingLeft = this.mapIndexToPixels(this.getIndexFromValue(this.model.get('_selectedItem').value));

                if(this.model.get('_showNumber')) $element.html(correctAnswer);

                $element.css({left:startingLeft}).fadeIn(0, _.bind(function() {
                    $element.animate({left: this.mapIndexToPixels(this.getIndexFromValue(correctAnswer))});
                }, this));
            }, this);
        },

        // Used by the question to display the users answer and
        // hide the correct answer
        // Should use the values stored in storeUserAnswer
        hideCorrectAnswer: function() {
            var userAnswerIndex = this.getIndexFromValue(this.model.get('_userAnswer'));
            this.$('.slider-modelranges').empty();

            this.showScaleMarker(true);
            this.selectItem(userAnswerIndex);
            this.animateToPosition(this.mapIndexToPixels(userAnswerIndex));
        },

        // according to given item index this should make the item as selected
        selectItem: function(itemIndex) {
            this.$el.a11y_selected(false);
            _.each(this.model.get('_items'), function(item, index) {
                item.selected = (index == itemIndex);
                if(item.selected) {
                    this.model.set('_selectedItem', item);
                    this.$('.slider-scale-number[data-id="'+(itemIndex+1)+'"]').a11y_selected(true);
                }
            }, this);
            this.showNumber(true);
        },

        // this should reset the selected state of each item
        deselectAllItems: function() {
            _.each(this.model.get('_items'), function(item) {
                item.selected = false;
            }, this);
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
        },

        /**
        * Used by adapt-contrib-spoor to get the user's answers in the format required by the cmi.interactions.n.student_response data field
        */
        getResponse:function() {
            return this.model.get('_userAnswer').toString();
        },

        /**
        * Used by adapt-contrib-spoor to get the type of this question in the format required by the cmi.interactions.n.type data field
        */
        getResponseType:function() {
            return "numeric";
        }

    });

    Adapt.register('slider', Slider);

    return Slider;
});
