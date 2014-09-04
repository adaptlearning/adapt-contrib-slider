/*
 * adapt-contrib-slider
 * License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Maintainers - Daryl Hedley <darylhedley@hotmail.com>, Dan Gray <dan@sinensis.co.uk>, Himanshu Rajotia <himanshu.rajotia@credipoint.com>
 */
define(function(require) {
    var QuestionView = require('coreViews/questionView');
    var Adapt = require('coreJS/adapt');

    var Slider = QuestionView.extend({

        events: {
            'click .slider-sliderange': 'onSliderSelected',
            'click .slider-handle': 'preventEvent',
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
            this.selectItem(0);
        },

        setupModelItems: function() {
            var items = [],
                answer = this.model.get('_correctAnswer'),
                range = this.model.get('_correctRange'),
                start = this.model.get('_scaleStart'),
                end = this.model.get('_scaleEnd');

            for(var i = start; i <= end; i++) {
                if(answer != "") {
                    items.push({value: i, selected:false, correct: (i == answer)});
                } else {
                    items.push({value: i, selected:false, correct: (i >= range._bottom && i <= range._top)});
                }
            }
            this.model.set('_items', items);
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
            this.$('.slider-handle').attr('alt', value);
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
            $(document).off('mousemove touchmove');
            
            var itemIndex = this.getIndexFromValue(this.model.get('_selectedItem').value);
            //this.selectItem(itemIndex);
            this.animateToPosition(this.mapIndexToPixels(itemIndex));
            this.setAltText(itemIndex + 1);
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
            if (!this.model.get("_isEnabled") || this.model.get("_isSubmitted")) return;

            this.showScaleMarker(true);

            var eventData = {
                width:this.$('.slider-sliderange').width(),
                offsetLeft: this.$('.slider-sliderange').offset().left
            };
            $(document).on('mousemove touchmove', eventData, _.bind(this.onHandleDragged, this));
            $(document).one('mouseup touchend', eventData, _.bind(this.onDragReleased, this));
        },

        onKeyDown: function(event) {
            if(event.which == 9 || !event.ctrlKey) return; // tab key
            event.preventDefault();
            
            var newItemIndex = this.getIndexFromValue(this.model.get('_selectedItem').value);
            
            switch (event.which) {
                case 188: // < left
                    newItemIndex = Math.max(newItemIndex - 1, 0);
                    break;
                case 190: // > right
                    newItemIndex = Math.min(newItemIndex + 1, this.model.get('_items').length - 1);
                    break;
            }

            this.selectItem(newItemIndex);
            if(typeof newItemIndex == "number") this.showScaleMarker(true);
            this.animateToPosition(this.mapIndexToPixels(newItemIndex));
            this.setAltText(newItemIndex + 1);
        },

        onSliderSelected: function (event) {
            event.preventDefault();
             if (!this.model.get("_isEnabled") || this.model.get("_isSubmitted")) return;
            
            this.showScaleMarker(true);
                    
            var offsetLeft = this.$('.slider-sliderange').offset().left,
                width = this.$('.slider-sliderange').width(),
                left = (event.pageX || event.originalEvent.touches[0].pageX) - offsetLeft;
            
            left = Math.max(Math.min(left, width), 0);
            left = this.mapPixelsToIndex(left);
            this.selectItem(left);
            this.animateToPosition(this.mapIndexToPixels(left));
            this.setAltText(left + 1);
        },

        preventEvent: function(event) {
            event.preventDefault();
        },

        resetControlStyles: function() {
            this.$('.slider-handle').empty();
            this.showScaleMarker(false);
            this.$('.slider-bar').animate({width:'0px'});     
        },

        //Use to check if the user is allowed to submit the question
        canSubmit: function() {
            return true;
        },

        // Blank method for question to fill out when the question cannot be submitted
        onCannotSubmit: function() {},

        //This preserve the state of the users answers for returning or showing the users answer
        storeUserAnswer: function() {
            this.model.set('_userAnswer', this.model.get('_selectedItem').value);
        },

        // this return a boolean based upon whether to question is correct or not
        isCorrect: function() {
            var numberOfCorrectAnswers = 0;

            _.each(this.model.get('_items'), function(item, index) {
                if(item.selected && item.correct)  {
                    this.model.set('_isAtLeastOneCorrectSelection', true);
                    numberOfCorrectAnswers++;
                }
            }, this);

            return this.model.get('_isAtLeastOneCorrectSelection') ? true : false;
        },

        // Used to set the score based upon the _questionWeight
        setScore: function() {

            var numberOfCorrectAnswers = this.model.get('_numberOfCorrectAnswers');
            var questionWeight = this.model.get("_questionWeight");
            var itemLength = this.model.get('_items').length;

            var score = questionWeight * numberOfCorrectAnswers / itemLength;

            this.model.set('_score', score);

        },

        // This is important and should give the user feedback on how they answered the question
        // Normally done through ticks and crosses by adding classes
        showMarking: function() {
            this.$('.slider-item').removeClass('correct incorrect')
                .addClass(this.model.get('_selectedItem').correct ? 'correct' : 'incorrect');
        },

        // Used by the question to determine if the question is incorrect or partly correct
        isPartlyCorrect: function() {
            return this.model.get('_isAtLeastOneCorrectSelection');
        },

        // Used by the question view to reset the stored user answer
        resetUserAnswer: function() {
            this.model.set({
                _selectedItem: {},
                _userAnswer: ''
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

        onScreenSizeChanged: function() {
            this.$(".slider-markers").empty();
            var $scaler = this.$('.slider-scaler'),
                $markers = this.$('.slider-markers');
            for(var i = 0, count = this.model.get('_items').length; i < count; i++) {
                $markers.append("<div class='slider-line component-item-color'>");
                $('.slider-line', $markers).eq(i).css({left: this.mapIndexToPixels(i, $scaler) + 'px'});
            }
            var currentIndex = this.getIndexFromValue(this.model.get('_selectedItem').value);
            this.$('.slider-handle').css({left: this.mapIndexToPixels(currentIndex, $scaler) + 'px'});
            this.$('.slider-scale-marker').css({left: this.mapIndexToPixels(currentIndex, $scaler) + 'px'});
            this.$('.slider-bar').width(this.mapIndexToPixels(currentIndex, $scaler));

            if (this.$('.slider-widget.user .button.model').css('display') === 'inline-block') {
                this.hideCorrectAnswer();
            } else if (this.$('.slider-widget.model .button.user ').css('display') === 'inline-block') {
                this.showCorrectAnswer();
            }
        },

        // Used by the question to display the correct answer to the user
        showCorrectAnswer: function() {
            var answers = [],
                bottom = this.model.get('_correctRange')._bottom,
                top = this.model.get('_correctRange')._top,
                range = top - bottom;

            this.showScaleMarker(false);

            if(this.model.get('_correctAnswer') != "") {
                answers.push(this.model.get('_correctAnswer'));
            } else if(bottom != "") {
                for(var i = 0; i <= range; i++) {
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

                if(this.model.get("_showNumber")) $element.html(correctAnswer);

                $element.css({left:startingLeft}).fadeIn(0, _.bind(function() {
                    $element.animate({left: this.mapIndexToPixels(this.getIndexFromValue(correctAnswer))});
                }, this));
            }, this);
        },

        // Used by the question to display the users answer and
        // hide the correct answer
        // Should use the values stored in storeUserAnswer
        hideCorrectAnswer: function() {
            var userAnswerIndex = this.getIndexFromValue(this.model.get("_userAnswer"));
            this.$('.slider-modelranges').empty();

            this.showScaleMarker(true);
            this.selectItem(userAnswerIndex);
            this.animateToPosition(this.mapIndexToPixels(userAnswerIndex));
        },

        // according to given item index this should make the item as selected
        selectItem: function(itemIndex) {
            _.each(this.model.get('_items'), function(item, index) {
                item.selected = (index == itemIndex);
                if(item.selected) {
                    this.model.set('_selectedItem', item);
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
            var $scaleMarkerNumber = $scaleMarker.find('.slider-scale-marker-number');
            if(this.model.get("_showNumber")) {
                if(show) {
                    $scaleMarkerNumber.html(this.model.get('_selectedItem').value);
                } else {
                    $scaleMarkerNumber.html = "";
                }
            }
        }

    });

    Adapt.register("slider", Slider);

    return Slider;
});
