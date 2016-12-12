'use strict';
var path = require('path');

module.exports = function(grunt) {
    require('time-grunt')(grunt);
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: pkg,
        clean: {
            dist: ['dist/*'],
        },
        jshint: {
            options: {jshintrc: '.jshintrc'},
            all: ['src/*.js', './*.js'],
        },
        browserify: {
            options: {
                browserifyOptions: {debug: true},
                transform: [
                    ['browserify-versionify', {
                        placeholder: '__VERSION__',
                        version: pkg.version,
                    }],
                    'browserify-css',
                ],
            },
            watch: {
                options: {
                    watch: true,
                    keepAlive: true,
                },
                files: {'dist/hola_player.dev.js': ['src/hola_player.js']},
            },
            dist: {
                files: {'dist/hola_player.dev.js': ['src/hola_player.js']},
            },
        },
        exorcise: {
            dist: {
                options: {},
                files: {
                    'dist/hola_player.dev.js.map': ['dist/hola_player.dev.js'],
                },
            },
        },
        copy: {
            videojs: {
                src: 'node_modules/@hola.org/videojs-swf/dist/video-js.swf',
                dest: 'dist/videojs.swf',
            },
            'videojs-osmf': {
                src: 'node_modules/@hola.org/videojs-osmf/dist/videojs-osmf.swf',
                dest: 'dist/videojs-osmf.swf',
            },
        },
        uglify : {
            options: {
                sourceMap: true,
                sourceMapIn: 'dist/hola_player.dev.js.map',
            },
            dist : {
                files: {'dist/hola_player.js' : 'dist/hola_player.dev.js'},
            },
        },
        zip: {
            dist: {
                router: function(filepath){
                    if (path.extname(filepath)=='.zip')
                        return null;
                    return path.relative('dist', filepath);
                },
                src: ['dist/**/*'],
                dest: 'dist/hola-player-'+ pkg.version+'.zip'
            },
        },
    });
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('build', ['clean', 'jshint', 'browserify:dist',
        'exorcise', 'copy', 'uglify', 'zip']);
    grunt.registerTask('default', ['build']);
};
