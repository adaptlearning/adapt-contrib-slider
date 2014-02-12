define(function(require) {
    var QuestionView = require('coreViews/questionView');
    var Adapt = require('coreJS/adapt');

    var Slider = QuestionView.extend({

        events: {
            'click .slider-slide': 'onSliderSelected',
            'click .slider-slide.slider-handle': 'preventEvent',
            'touchstart .slider-slide.slider-handle':'onHandlePressed',
            'mousedown .slider-slide.slider-handle': 'onHandlePressed',
            'focus .slider-slide.slider-handle':'onHandleFocus',
            "click .button.submit": "onSubmitClicked",
            "click .button.reset": "onResetClicked",
            "click .button.model": "onModelAnswerClicked",
            "click .button.user": "onUserAnswerClicked"
        },
        
        animateToPosition: function(newPosition) {
            this.$('.slider-slide.slider-handle').stop(true).animate({
                left: newPosition + 'px'
            },200);
            this.$('.slider-bar').stop(true).animate({width:newPosition + 'px'});
            this.$('.slider-scale-marker').stop(true).animate({
                left: newPosition + 'px'
            },200);
            this.$('.slider-bar').stop(true).animate({width:newPosition + 'px'});
        },
        
        canSubmit: function() {
            return true;
        },
        
        forEachAnswer: function(callback) {
            _.each(this.model.get('items'), function(item, index) {
                var correctSelection = item.selected && item.correct;
                if(correctSelection) this.model.set('atLeastOneCorrectSelection');
                callback(item.correct || (!item.selected && !item.correct), item);
            }, this);
        },
        
        getIndexFromValue: function(itemValue) {
            var scaleStart = this.model.get('scalestart'),
                scaleEnd = this.model.get('scaleend');
            
            return Math.floor(this.mapValue(itemValue, scaleStart, scaleEnd, 0, this.model.get('items').length - 1));
        },
        
        preRender: function() {
            this.setReadyStatus();
            if(!this.model.get('items')) {
                this.setupModelItems();
            }
            QuestionView.prototype.preRender.apply(this, arguments);
            this.selectItem(0);
        },

        mapIndexToPixels: function(value, $widthObject) {
            var numberOfItems = this.model.get('items').length,
                width = $widthObject ? $widthObject.width() : this.$('.slider-slide').width();
            
            return Math.round(this.mapValue(value, 0, numberOfItems - 1, 0, width));
        },
        
        mapPixelsToIndex: function(value) {
            var numberOfItems = this.model.get('items').length,
                width = this.$('.slider-slide').width();
            
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
            
            var itemIndex = this.getIndexFromValue(this.getSelectedItems().value);
            //this.selectItem(itemIndex);
            this.animateToPosition(this.mapIndexToPixels(itemIndex));
        },
        
        onHandleDragged: function (event) {
            event.preventDefault();
            
            var left = (event.pageX || event.originalEvent.touches[0].pageX) - event.data.offsetLeft;
            left = Math.max(Math.min(left, event.data.width), 0);
            
            this.$('.slider-slide.slider-handle').css({
                left: left + 'px'
            });
            
            this.$('.slider-scale-marker').css({
                left: left + 'px'
            });

            this.selectItem(this.mapPixelsToIndex(left));
        },
        
        onHandleFocus: function(event) {
            event.preventDefault();
            
            this.$('.slider-slide.slider-handle').on('keydown', _.bind(this.onKeyDown, this));
        },
        
        onHandlePressed: function (event) {
            event.preventDefault();
            if (!this.model.get("_isEnabled") || this.model.get("_isSubmitted")) return;
            
            this.showScaleMarker(true);
            
            var eventData = {
                    width:this.$('.slider-slide').width(),
                    offsetLeft: this.$('.slider-slide').offset().left
                };
            $(document).on('mousemove touchmove', eventData, _.bind(this.onHandleDragged, this));
            $(document).one('mouseup touchend', eventData, _.bind(this.onDragReleased, this));
        },
        
        onKeyDown: function(event) {
            event.preventDefault();
            
            var newItemIndex = this.getIndexFromValue(this.getSelectedItems().value);
            
            switch (event.which) {
                case 40: // ↓ down
                case 37: // ← left
                    newItemIndex = Math.max(newItemIndex - 1, 0);
                    break;
                case 38: // ↑ up
                case 39: // → right
                    newItemIndex = Math.min(newItemIndex + 1, this.model.get('items').length - 1);
                    break;
            }
            
            this.selectItem(newItemIndex);
            if(typeof newItemIndex == "number") this.showScaleMarker(true);
            this.animateToPosition(this.mapIndexToPixels(newItemIndex));
        },
        
        onSliderSelected: function (event) {
            event.preventDefault();
             if (!this.model.get("_isEnabled") || this.model.get("_isSubmitted")) return;
            
            this.showScaleMarker(true);
                    
            var offsetLeft = this.$('.slider-slide').offset().left,
                width = this.$('.slider-slide').width(),
                left = (event.pageX || event.originalEvent.touches[0].pageX) - offsetLeft;
            
            left = Math.max(Math.min(left, width), 0);
            left = this.mapPixelsToIndex(left);
            this.selectItem(left);
            this.animateToPosition(this.mapIndexToPixels(left));
        },
        
        onModelAnswerShown: function() {
            var answers = [],
                bottom = this.model.get('correctrange').bottom,
                top = this.model.get('correctrange').top,
                range = top - bottom;
            
            this.showScaleMarker(false);
            
            if(this.model.get('correctanswer') != "") {
                answers.push(this.model.get('correctanswer'));
            } else if(bottom != "") {
                for(var i = 0; i <= range; i++) {
                    answers.push(this.model.get('items')[this.getIndexFromValue(bottom) + i].value);
                }
            } else {
                console.log(this.constructor + "::WARNING: no correct answer or correct range set in JSON")
            }
            var middleAnswer = answers[Math.floor(answers.length / 2)];
            this.animateToPosition(this.mapIndexToPixels(this.getIndexFromValue(middleAnswer)));
            this.showModelAnswers(answers);
        },
        
        onUserAnswerShown: function() {
            var userAnswerIndex = this.getIndexFromValue(this.model.get("_UserAnswer"));
            this.$('.slider-modelranges').empty();
            
            this.showScaleMarker(true);
            this.selectItem(userAnswerIndex);
            this.animateToPosition(this.mapIndexToPixels(userAnswerIndex));
        },
        
        preventEvent: function(event) {
            event.preventDefault();
        },
        
        resetControlStyles: function() {
            this.$('.slider-slide.slider-handle').empty();
            this.showScaleMarker(false);
            this.$('.slider-bar').animate({width:'0px'});     
        },
        
        resetItems:function() {
            this.selectItem(0);
            this.animateToPosition(0);
            this.resetControlStyles();
        },
        
        onScreenSizeChanged: function() {
            this.$(".slider-markers").empty();
            var $scaler = this.$('.scaler'),
                $markers = this.$('.slider-markers');
            for(var i = 0, count = this.model.get('items').length; i < count; i++) {
                $markers.append("<div class='line'>");
                $('.line', $markers).eq(i).css({left: this.mapIndexToPixels(i, $scaler) + 'px'});
            }
            var currentIndex = this.getIndexFromValue(this.getSelectedItems().value);
            this.$('.slider-slide.slider-handle').css({left: this.mapIndexToPixels(currentIndex, $scaler) + 'px'});
            this.$('.slider-scale-marker').css({left: this.mapIndexToPixels(currentIndex, $scaler) + 'px'});
            this.$('.slider-slide .slider-bar').width(this.mapIndexToPixels(currentIndex, $scaler));
        },
        
        selectItem: function(itemIndex) {
            _.each(this.model.get('items'), function(item, index) {
                item.selected = (index == itemIndex);
                if(item.selected) {
                    var selectedItems = this.model.get('_selectedItems');
                    selectedItems[0] = item;
                    this.model.set('_selectedItems', selectedItems);
                }
            }, this);
            this.showNumber(true);
        },
        
        setupModelItems: function() {
            var items = [],
                answer = this.model.get('correctanswer'),
                range = this.model.get('correctrange'),
                start = this.model.get('scalestart'),
                end = this.model.get('scaleend');
            
            for(var i = start; i <= end; i++) {
                if(answer != "") {
                    items.push({value: i, selected:false, correct: (i == answer)});
                } else {
                    items.push({value: i, selected:false, correct: (i >= range.bottom && i <= range.top)});
                }
            }
            this.model.set('items', items);
        },
        
        showMarking: function() {
            this.$('.slider-item').addClass(this.getSelectedItems().correct ? 'correct' : 'incorrect');
        },
        
        showModelAnswers: function(correctAnswerArray) {
            var $parentDiv = this.$('.slider-modelranges');
            _.each(correctAnswerArray, function(correctAnswer, index) {
                $parentDiv.append($("<div class='model-answer'>"));
                
                var $element = $(this.$('.slider-modelranges .model-answer')[index]),
                    startingLeft = this.mapIndexToPixels(this.getIndexFromValue(this.getSelectedItems().value));
                
                if(this.model.get("showNumber")) $element.html(correctAnswer);
                
                $element.css({left:startingLeft}).fadeIn(0, _.bind(function() {
                    $element.animate({left: this.mapIndexToPixels(this.getIndexFromValue(correctAnswer))});
                }, this));
            }, this);
        },
        
        showNumber: function(show) {
            var $scaleMarker = this.$('.slider-scale-marker');
            if(this.model.get("showNumber")) {
                if(show) {
                    $scaleMarker.html(this.getSelectedItems().value);
                } else {
                    $scaleMarker.html = "";
                }
            }
        },
        
        showScaleMarker: function(show) {
            var $scaleMarker = this.$('.slider-scale-marker');
            if (this.model.get('showScaleIndicator')) {
                this.showNumber(show);
                if(show) {
                    $scaleMarker.addClass('display-block');
                } else {
                    $scaleMarker.removeClass('display-block');
                }
            }
        },
        
        
        storeUserAnswer: function() {
            this.model.set('_UserAnswer', this.getSelectedItems().value);
        }

    });

    Adapt.register("slider", Slider);

});
