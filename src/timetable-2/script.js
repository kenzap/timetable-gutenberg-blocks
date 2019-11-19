jQuery(document).ready(function(){

    var calendar = jQuery(".kenzap .kp-timetable-1 .owl-carousel").owlCarousel({
        autoplay: false,
        loop: false,
        margin: 0,
        dots: false,
        mouseDrag:false,
        slideBy: 1,
        nav: false,
        responsive: {
            0:{
                items:1
            },
            600:{
                items:1
            },
            1200:{
                items:1
            }
        }
    });

    jQuery('.kenzap .kp-timetable-1 .kp-nav li:first-child').addClass('active');
    jQuery('.kenzap .kp-timetable-1 .tab-content:first').addClass('active');

    jQuery(".kenzap .kp-timetable-1 a,.kenzap .kp-timetable-1 li").on("click", function(){
        if (jQuery(this).hasClass("month-next")) {
            calendar.trigger('next.owl.carousel');
        }

        if (jQuery(this).hasClass("month-prev")) {
            calendar.trigger('prev.owl.carousel');
        }

        if (jQuery(this).hasClass("tab-link")) {
            jQuery('.kenzap .kp-timetable-1 .kp-nav ul li').removeClass('active');
            jQuery(this).addClass('active');
            jQuery('.kenzap .kp-timetable-1 .tab-content').removeClass('active');

            var activeTab = jQuery(this).find('a').attr('href');
            jQuery(activeTab).addClass('active');
            calendar.trigger('refresh.owl.carousel');
            return false;
        }
    });

    var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
    var transitionsSupported = ( jQuery('.csstransitions').length > 0 );
    //if browser does not support transitions - use a different event to trigger them
    if( !transitionsSupported ) transitionEnd = 'noTransition';

    //should add a loding while the events are organized

    function SchedulePlan( element ) {
        this.element = element;
        this.timeline = this.element.find('.timeline');
        this.timelineItems = this.timeline.find('li');
        this.timelineItemsNumber = this.timelineItems.length;
        this.timelineStart = getScheduleTimestamp(this.timelineItems.eq(0).attr('data-time'));
        //need to store delta (in our case half hour) timestamp
        this.timelineUnitDuration = getScheduleTimestamp(this.timelineItems.eq(1).attr('data-time')) - getScheduleTimestamp(this.timelineItems.eq(0).attr('data-time'));
        this.eventsWrapper = this.element.find('.events');
        this.eventsGroup = this.eventsWrapper.find('.events-group');
        this.singleEvents = this.eventsGroup.find('.single-event');
        //this.eventSlotHeight = this.eventsGroup.eq(0).children('.top-info').outerHeight();
        this.eventSlotHeight = this.timeline.find('li').outerHeight();

        this.modal = this.element.find('.event-modal');
        this.modalHeader = this.modal.find('.header');
        this.modalHeaderBg = this.modal.find('.header-bg');
        this.modalBody = this.modal.find('.body');
        this.modalBodyBg = this.modal.find('.body-bg');
        this.modalMaxWidth = 800;
        this.modalMaxHeight = 480;

        this.animating = false;

        this.initSchedule();
    }

    SchedulePlan.prototype.initSchedule = function() {
        this.scheduleReset();
        this.initEvents();
    };

    SchedulePlan.prototype.scheduleReset = function() {
        var mq = this.mq();
        if( mq == 'desktop' && !this.element.hasClass('js-full') ) {
            //in this case you are on a desktop version (first load or resize from mobile)
            //this.eventSlotHeight = this.eventsGroup.eq(0).children('.top-info').outerHeight();
            this.eventSlotHeight = this.timeline.find('li').outerHeight();
            this.element.addClass('js-full');
            this.placeEvents();
            this.element.hasClass('modal-is-open') && this.checkEventModal();
        } else if(  mq == 'mobile' && this.element.hasClass('js-full') ) {
            //in this case you are on a mobile version (first load or resize from desktop)
            this.element.removeClass('js-full loading');
            this.eventsGroup.children('ul').add(this.singleEvents).removeAttr('style');
            this.eventsWrapper.children('.grid-line').remove();
            this.element.hasClass('modal-is-open') && this.checkEventModal();
        } else if( mq == 'desktop' && this.element.hasClass('modal-is-open')){
            //on a mobile version with modal open - need to resize/move modal window
            this.checkEventModal('desktop');
            this.element.removeClass('loading');
        } else {
            this.element.removeClass('loading');
        }
    };

    SchedulePlan.prototype.initEvents = function() {
        var self = this;

        this.singleEvents.each(function(){
            //create the .event-date element for each event
            if(!window.location.href.indexOf('/wp-admin/post.php')) {
                var durationLabel = '<span class="event-date">'+jQuery(this).data('start')+' - '+jQuery(this).data('end')+'</span>';
                jQuery(this).children('a').prepend(jQuery(durationLabel));
            }
            //detect click on the event and open the modal
            jQuery(this).on('click', 'a', function(event){
                event.preventDefault();
                //if( !self.animating ) self.openModal(jQuery(this));
            });
        });
    };

    SchedulePlan.prototype.placeEvents = function() {
        var self = this;
        this.singleEvents.each(function(){
            //place each event in the grid -> need to set top position and height
            var start = getScheduleTimestamp(jQuery(this).attr('data-start')),
                duration = getScheduleTimestamp(jQuery(this).attr('data-end')) - start;

            var eventTop = self.eventSlotHeight*(start - self.timelineStart)/self.timelineUnitDuration,
                eventHeight = self.eventSlotHeight*duration/self.timelineUnitDuration;

            jQuery(this).css({
                top: (eventTop ) +'px',
                height: (eventHeight)+'px'
            });
        });

        this.element.removeClass('loading');
    };

    SchedulePlan.prototype.mq = function(){
        //get MQ value ('desktop' or 'mobile')
        var self = this;
        return window.getComputedStyle(this.element.get(0), '::before').getPropertyValue('content').replace(/["']/g, '');
    };

    // var schedules = jQuery('.kp-schedule');
    // var objSchedulesPlan = [],
    //     windowResize = false;
    //
    // if( schedules.length > 0 ) {
    //     schedules.each(function(){
    //         //create SchedulePlan objects
    //         objSchedulesPlan.push(new SchedulePlan(jQuery(this)));
    //     });
    // }

    var schedules = [];
    var objSchedulesPlan = [];
    var windowResize = false;

    function init() {
        schedules = jQuery('.kp-schedule');
        objSchedulesPlan = [];
        if( schedules.length > 0 ) {
            schedules.each(function(){
                //create SchedulePlan objects
                objSchedulesPlan.push(new SchedulePlan(jQuery(this)));
            });
        }
    }

    function reset() {
        objSchedulesPlan.forEach(function (value) {
            value.scheduleReset();
        })
    }

    function placeEvents() {
        objSchedulesPlan.forEach(function (value) {
            value.placeEvents();
        })
    }

    init();

    if(window.location.href.indexOf('/wp-admin/post.php')) {
        window.addEventListener('kp-timetable-2:init' , init);
        window.addEventListener('kp-timetable-2:reset' , reset);
        window.addEventListener('kp-timetable-2:placeEvents' , placeEvents);
    }

    if(window.location.href.indexOf('/wp-admin/post.php') === -1) {
        jQuery(window).on('resize', function(){
            if( !windowResize ) {
                windowResize = true;
                (!window.requestAnimationFrame) ? setTimeout(checkResize) : window.requestAnimationFrame(checkResize);
            }
        });
    }


    jQuery(window).keyup(function(event) {
        if (event.keyCode == 27) {
            objSchedulesPlan.forEach(function(element){
                element.closeModal(element.eventsGroup.find('.selected-event'));
            });
        }
    });

    function checkResize(){
        objSchedulesPlan.forEach(function(element){
            element.scheduleReset();
        });
        windowResize = false;
    }

    function getScheduleTimestamp(time) {
        //accepts hh:mm format - convert hh:mm to timestamp
        time = time.replace(/ /g,'');
        var timeArray = time.split(':');
        var timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
        return timeStamp;
    }

    function transformElement(element, value) {
        element.css({
            '-moz-transform': value,
            '-webkit-transform': value,
            '-ms-transform': value,
            '-o-transform': value,
            'transform': value
        });
    }
});
