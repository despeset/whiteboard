define([ 'app', 'jquery', 'underscore', 'backbone', 'recorder', 'speex' ],
function( app ,  $      ,  _          ,  Backbone ,  Recorder ,  Speex  ){
    var audioRec = _.extend({},Backbone.Events)
      , recorder = null
      , audio_ctx
      , codec = new Speex({ benchmark: false
                          , quality: 8
                          , complexity: 2
                          , bits_size: 15 })

    app.proxy( 'audio', audioRec )

    audioRec.init = function(){
        try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = ( navigator.getUserMedia       ||
                                       navigator.webkitGetUserMedia ||
                                       navigator.mozGetUserMedia    ||
                                       navigator.msGetUserMedia)
            window.URL = window.URL || window.webkitURL            
            audio_ctx = new AudioContext()
            window.audio_ctx = audio_ctx
            app.log('Audio context set up.')
            app.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'))
        } catch (e) {
            audioRec.trigger('unsupported', audioRec)
        }
        
        navigator.getUserMedia({audio: true}, function userApproved( stream ){
            audioRec.trigger('init', stream )
        }, function userDeniedOrError(e) {
            app.log('No live audio input: ' + e)
            audioRec.trigger('noinput', audioRec, e)
        });
    }

    // once the user approves recording
    audioRec.on('init', function(stream){
            audioRec.input = audio_ctx.createMediaStreamSource(stream)
            audioRec.recorder = new Recorder( audioRec.input, { workerPath: 'js/libs/recorderWorker.js' })
    })

    audioRec.record = function(){
            audioRec.recorder.record()
            audioRec.trigger('record', audioRec)
    }

    audioRec.stop = function(){
            audioRec.recorder.stop()
            audioRec.trigger('stop', audioRec)
    }

    buildAndPlay = function( blob ){
            if( !$('#audioPlayer').length ){
                var url = URL.createObjectURL(blob)
                var li  = document.createElement('li')
                var au  = document.createElement('audio')
                var hf  = document.createElement('a')
                
                au.autoplay = true
                au.src = url
                hf.href = url
                hf.download = new Date().toISOString() + '.wav'
                hf.innerHTML = hf.download
                li.appendChild(au)
                li.appendChild(hf)
                $('body').append($('<ul id="audioPlayer"></ul>').append(li))
            } else {
                $('#audioPlayer audio')[0].src = $('#audioPlayer audio')[0].src
            }
    }

    audioRec.play = function(){
        // audioRec.recorder.exportWAV(function(blob) {
        //     buildAndPlay( blob )
        //     audioRec.trigger('play', audioRec)
        // })
        audioRec.export();
    }

    audioRec.export = function(){
        app.log('exporting');
        audioRec.recorder.exportSpeex(function(spxData){
            app.log('cb!!!');
            // app.log( blob );
            // app.log( blob.toString() );
            // var url = URL.createObjectURL(blob)
            //   , hf  = document.createElement('a')
            // hf.href = url
            // hf.download = new Date().toISOString() + '.ogg'
            // hf.innerHTML = hf.download
            // $('body').append(hf);
            console.log('showtime!')
            Speex.util.play(codec.decode(spxData));
            // codec.close();
        })
    }

    window.audioRec = audioRec
    return audioRec

});