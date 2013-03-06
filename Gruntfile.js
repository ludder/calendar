module.exports = function (grunt) {

    "use strict";

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
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('default', ['uglify']);
    // grunt.registerTask('default', ['jshint', 'uglify']);

};
