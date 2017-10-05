module.exports = function(grunt) {
    "use strict";

    /*Main Config*/
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Uglify
        uglify: {
            options: {
                mangle: true,
                compress: true
            },
            buildProd: {
                options: {
                    compress: {
                        drop_console: true
                    }
                },
                src: 'src/assets/js/global.js',
                dest: 'assets/js/global.js',
                report: 'min'
            }
        },

        htmlmin: { // Task
            buildProd: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'index.htm': 'src/index.htm' // 'destination': 'source'
                        // 'dist/404.htm': 'src/404.htm' // 'destination': 'source'
                }
            }
        },

        cssmin: {
            options: {
                report: 'min',
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            buildProd: {
                files: {
                    'assets/css/style.css': ['src/assets/css/style.css']
                }
            }
        },

        // JSHint
        jshint: {
            options: {
                jshintrc: '.jshintrc.config'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            assetsjs: {
                src: 'src/assets/js/global.js'
            }
        },

        copy: {
            main: {
                cwd: 'src/', // set working folder / root to copy
                src: '**', // copy all files and subfolders
                dest: '', // destination folder
                expand: true, // required when using cwd
                flatten: false
            },
        },

        csslint: {
            // options: {
            //     csslintrc: '.csslintrc',
            //     formatters: [{
            //         id: 'junit-xml',
            //         dest: 'report/csslint_junit.xml'
            //     }, {
            //         id: 'csslint-xml',
            //         dest: 'report/csslint.xml'
            //     }]
            // },
            strict: {
                options: {
                    import: 2
                },
                src: ['src/assets/css/style.css']
            }
        },

        uncss: {
            dist: {
                files: {
                    'assets/css/tidy.css': ['_site/*.html']
                }
            }
        },

        // Clean
        clean: {
            // Pre-build cleaning
            dist: ["dist"]
        },

    });

    // Load Grunt tasks declared in the package.json file.  These plugins provide necessary tasks.  https://www.npmjs.com/package/load-grunt-tasks
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-template-jasmine-requirejs']
    });

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['copy', 'htmlmin', 'cssmin']);
    grunt.registerTask('hint', ['csslint']);
};
