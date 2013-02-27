/*  AMD app boilerplate
    Author: Daniel Espeset
*/

// setup requireJS aliases & load paths
require.config({

    shim: {
          'jquery': {
            exports: function( jQuery ){
                jQuery.noConflict();
                return jQuery;
            }
        }

        , 'underscore': {
            exports: '_'
        }

        , 'recorder': {
            exports: 'Recorder'
        }

        , 'backbone': {
              deps: ['underscore', 'jquery']
            , exports: 'Backbone'
        }

    },

    paths: {
        
        // app global deligator
          app: 'app'

        // audio recorder
        , audioRec: 'audioRec'
        , board: 'board'

        // library dependencies
        , underscore: 'libs/underscore'
        , backbone: 'libs/backbone'
        , jquery: 'libs/jquery-1.7.1.min'
        , modernizr: 'libs/modernizr-2.5.3.min'
        , recorder: 'libs/recorder'

    },
    
    waitSeconds: 60

});

requirejs([ 'app', 'jquery', 'audioRec', 'board' ]
, function(  app ,  $      ,  audioRec ,  board  ){

    app.debug();

    app.trigger( 'boot', app );

    app.on( 'start', function(){ 
        audioRec.init();
        board.init('#board');
    });

    var on = false;

    audioRec.on( 'init', function(){
        window.board = board;
        $('#rec').click(function(){
            if( !on ){
                audioRec.record();
                board.record();
                on = true;
            } else {
                audioRec.stop();
                board.stop();
                on = false;
                $(this).unbind('click');
                $(this).click(function(){
                    if( !on ){
                        audioRec.play();
                        board.spool();
                        board.play();
                    } else {
                        audioRec.stop();
                        board.stop();
                    }
                });
                $(this).click();
            }

        });
    });

    $(function(){ app.trigger( 'start', app ); });

});