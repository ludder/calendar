
module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat : {

            dist : {
                // files to concat
                src : ['src/js/*.js'],
                // location of resulting js file
                dest : 'dist/concat-<%= pkg.name %>.js'

            }
        },

        uglify : {
            dist : {
                src : '<%= concat.dist.dest %>',
                dest : 'dist/<%= pkg.name %>.min.js'

            }
        },

        qunit : {
            files : ['test/tests/*.html']
        },

        lint : {
            files: ['grunt.js', 'src/js/*.js', 'test/tests/*.js']
        },


        jshint : {
            // define the files to lint
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('test', 'lint qunit');
    // grunt.registerTask('default', 'lint qunit concat min');
    grunt.registerTask('default', 'qunit concat min');

};
