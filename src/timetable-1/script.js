( function( $ ) {
    'use strict';
    $('.kp-timetable-2 select').on('change', function (event) {
        var selects =  $('.kp-timetable-2 select');
        var classes = selects[0];
        var months = selects[1];
        $('.kp-content').removeClass('active');
        $('.kp-mobile').removeClass('active');
        $('.kp-content.'+ months.value + '_' + classes.value).addClass('active');
        $('.kp-mobile.'+ months.value + '_' + classes.value).addClass('active');
    })

}( jQuery ) );
