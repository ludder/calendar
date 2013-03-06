'use strict';

// Set livereload parameters
var path        = require('path');
var lrSnippet   = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var folderMount = function folderMount(connect, point) {
    return connect.static(path.resolve(point));
};

module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd hh:mm") %> */ \n'
            },
            squeeze: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['src/js/*.js']
                }
            },
            beautify: {
                options: {
                    beautify: true
                },
                files: {
                    'dist/<%= pkg.name %>.js': ['src/js/*.js']
                }
            }
        },

        qunit : {
            all : ['test/tests/*.html']
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all_files: [
                'Gruntfile.js',
                'src/js/*.js'
                // 'test/tests/*.js'
            ]
        },

        connect: {
            livereload: {
                options: {
                    port: 9001,
                    middleware: function(connect, options) {
                        return [lrSnippet, folderMount(connect, '.')]
                    }
                }
            }
        },
        // Configuration to be run (and then tested)
        regarde: {
            html: {
                files: '**/*.html',
                tasks: ['livereload']
            },
            js: {
                files: 'src/**/*.js',
                tasks: ['livereload']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-regarde');

    grunt.registerTask('default', ['uglify']);
    // grunt.registerTask('default', ['jshint', 'uglify']);
    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('watcher', ['livereload-start', 'connect', 'regarde']);

};
