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

        , 'backbone': {
              deps: ['underscore', 'jquery']
            , exports: 'Backbone'
        }

    },

    paths: {
        
        // app global deligator
          app: 'app'

        // library dependencies
        , underscore: 'libs/underscore'
        , backbone: 'libs/backbone'
        , jquery: 'libs/jquery-1.7.1.min'
        , modernizr: 'libs/modernizr-2.5.3.min'

    },
    
    waitSeconds: 60

});

requirejs([ 'app', 'jquery' ], function( app, $ ){
    app.trigger( 'boot', app );
    $(function(){ app.trigger( 'start', app ); });
});